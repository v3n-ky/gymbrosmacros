/**
 * Netlify Forms contract test.
 *
 * Validates that public/netlify-forms.html (what Netlify's build bot registers)
 * matches the fields that FeedbackLinks.tsx actually POSTs at runtime.
 *
 * Catches: mismatched form names, missing fields, missing honeypot attribute.
 * Does NOT require a deploy or Netlify CLI.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = resolve(__dirname, '../../');
const html = readFileSync(resolve(ROOT, 'public/netlify-forms.html'), 'utf-8');

// ─── parse helpers ────────────────────────────────────────────────────────────

function getForms(html: string): { name: string; attrs: string; fields: string[] }[] {
  const forms: { name: string; attrs: string; fields: string[] }[] = [];
  const formRe = /<form([^>]*)>([\s\S]*?)<\/form>/gi;
  let m: RegExpExecArray | null;
  while ((m = formRe.exec(html)) !== null) {
    const attrs = m[1];
    const body = m[2];
    const nameMatch = /name="([^"]+)"/.exec(attrs);
    if (!nameMatch) continue;
    const fieldRe = /name="([^"]+)"/g;
    const fields: string[] = [];
    let f: RegExpExecArray | null;
    while ((f = fieldRe.exec(body)) !== null) {
      fields.push(f[1]);
    }
    forms.push({ name: nameMatch[1], attrs, fields });
  }
  return forms;
}

const forms = getForms(html);

function getForm(name: string) {
  const f = forms.find((f) => f.name === name);
  expect(f, `form "${name}" not found in netlify-forms.html`).toBeDefined();
  return f!;
}

// ─── fields POSTed by FeedbackLinks.tsx ───────────────────────────────────────
// Keep in sync with the fetch body in FeedbackLinks.tsx handleSubmit.

const COMMON_FIELDS = ['form-name', 'bot-field', 'details', 'email'];
const OUTDATED_EXTRA_FIELDS = ['restaurant', 'item-name'];

// ─── tests ────────────────────────────────────────────────────────────────────

describe('netlify-forms.html structure', () => {
  it('registers exactly two forms', () => {
    expect(forms).toHaveLength(2);
  });

  it('both forms have data-netlify="true"', () => {
    for (const form of forms) {
      expect(form.attrs, `form "${form.name}"`).toContain('data-netlify="true"');
    }
  });

  it('both forms declare the honeypot via data-netlify-honeypot="bot-field"', () => {
    for (const form of forms) {
      expect(form.attrs, `form "${form.name}"`).toContain('data-netlify-honeypot="bot-field"');
    }
  });
});

describe('outdated-data form contract', () => {
  it('form is registered', () => {
    getForm('outdated-data');
  });

  it('declares all fields that FeedbackLinks.tsx POSTs', () => {
    const form = getForm('outdated-data');
    for (const field of [...COMMON_FIELDS, ...OUTDATED_EXTRA_FIELDS]) {
      expect(form.fields, `missing field "${field}"`).toContain(field);
    }
  });

  it('includes bot-field as a declared input (honeypot)', () => {
    const form = getForm('outdated-data');
    expect(form.fields).toContain('bot-field');
  });
});

describe('restaurant-request form contract', () => {
  it('form is registered', () => {
    getForm('restaurant-request');
  });

  it('declares all fields that FeedbackLinks.tsx POSTs', () => {
    const form = getForm('restaurant-request');
    for (const field of COMMON_FIELDS) {
      expect(form.fields, `missing field "${field}"`).toContain(field);
    }
  });

  it('does NOT declare restaurant or item-name (outdated-data only fields)', () => {
    const form = getForm('restaurant-request');
    expect(form.fields).not.toContain('restaurant');
    expect(form.fields).not.toContain('item-name');
  });

  it('includes bot-field as a declared input (honeypot)', () => {
    const form = getForm('restaurant-request');
    expect(form.fields).toContain('bot-field');
  });
});
