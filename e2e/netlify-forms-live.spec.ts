/**
 * Live Netlify Forms integration tests.
 *
 * Runs against `netlify dev` (port 8888) so form POSTs are forwarded to the
 * real Netlify site. After each submission the Netlify CLI API is polled until
 * the submission appears, then the test submission is deleted for cleanup.
 *
 * Prerequisites:
 *   - `netlify dev` must be running in a separate terminal
 *   - Netlify CLI must be authenticated (`netlify login`)
 *
 * Run with:
 *   npm run test:netlify
 */

import { test, expect, Page } from '@playwright/test';
import { execSync } from 'node:child_process';

// ─── Netlify API helpers ──────────────────────────────────────────────────────

const FORM_IDS = {
  'outdated-data':       '69c369d26ad1e00008c16308',
  'restaurant-request':  '69c369d26ad1e00008c16309',
} as const;

type FormName = keyof typeof FORM_IDS;

interface NetlifySubmission {
  id: string;
  data: Record<string, string>;
  created_at: string;
}

function netlifyApi<T>(method: string, data: Record<string, unknown>): T {
  const result = execSync(
    `netlify api ${method} --data=${JSON.stringify(JSON.stringify(data))}`,
    { encoding: 'utf-8' }
  );
  return JSON.parse(result);
}

/** Poll until a submission containing `sentinel` in `details` appears, then return it. */
async function waitForSubmission(
  formName: FormName,
  sentinel: string,
  { retries = 10, intervalMs = 2000 } = {}
): Promise<NetlifySubmission> {
  const formId = FORM_IDS[formName];
  for (let i = 0; i < retries; i++) {
    const submissions = netlifyApi<NetlifySubmission[]>('listFormSubmissions', {
      form_id: formId,
      per_page: 10,
    });
    const match = submissions.find((s) => s.data?.details?.includes(sentinel));
    if (match) return match;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Submission with sentinel "${sentinel}" not found after ${retries} retries`);
}

function deleteSubmission(id: string) {
  netlifyApi('deleteSubmission', { submission_id: id });
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

async function openModal(page: Page, buttonName: RegExp, headingName: RegExp) {
  // Wait for the page to be fully interactive before clicking
  await page.waitForLoadState('networkidle');
  await page.getByRole('main').getByRole('button', { name: buttonName }).click();
  // The modal overlay has a fixed-position container — scope heading wait inside it
  await page.locator('.fixed.inset-0').getByRole('heading', { name: headingName })
    .waitFor({ state: 'visible', timeout: 15_000 });
}

// ─── tests ────────────────────────────────────────────────────────────────────

test.describe('live Netlify Forms — outdated-data', () => {
  test('submission reaches Netlify with all fields intact', async ({ page }) => {
    const sentinel = `e2e-outdated-${Date.now()}`;
    let submissionId: string | undefined;

    try {
      await page.goto('/subway');
      await openModal(page, /report outdated info/i, /report outdated info/i);

      await page.getByPlaceholder(/e\.g\. Subway/i).fill('Subway');
      await page.getByPlaceholder(/chicken teriyaki/i).fill('Chicken Teriyaki 6-inch');
      await page.getByPlaceholder(/protein for this item/i).fill(sentinel);
      await page.getByPlaceholder(/you@example\.com/i).fill('e2e@test.com');

      await page.getByRole('button', { name: /submit/i }).click();
      await expect(page.getByText(/thanks for your feedback/i)).toBeVisible({ timeout: 10_000 });

      const submission = await waitForSubmission('outdated-data', sentinel);
      submissionId = submission.id;

      expect(submission.data.restaurant).toBe('Subway');
      expect(submission.data['item-name']).toBe('Chicken Teriyaki 6-inch');
      expect(submission.data.details).toContain(sentinel);
      expect(submission.data.email).toBe('e2e@test.com');
      expect(submission.data['bot-field']).toBeFalsy(); // honeypot must be empty
    } finally {
      if (submissionId) deleteSubmission(submissionId);
    }
  });
});

test.describe('live Netlify Forms — restaurant-request', () => {
  test('submission reaches Netlify with correct form-name', async ({ page }) => {
    const sentinel = `e2e-request-${Date.now()}`;
    let submissionId: string | undefined;

    try {
      await page.goto('/');
      await openModal(page, /suggest a restaurant/i, /suggest a restaurant/i);

      await page.getByPlaceholder(/boost juice/i).fill(sentinel);
      await page.getByRole('button', { name: /submit/i }).click();
      await expect(page.getByText(/thanks for your feedback/i)).toBeVisible({ timeout: 10_000 });

      const submission = await waitForSubmission('restaurant-request', sentinel);
      submissionId = submission.id;

      expect(submission.data.details).toContain(sentinel);
      expect(submission.data['bot-field']).toBeFalsy();
      // restaurant and item-name must not appear in this form's submissions
      expect(submission.data.restaurant).toBeUndefined();
    } finally {
      if (submissionId) deleteSubmission(submissionId);
    }
  });
});

test.describe('live Netlify Forms — honeypot guard', () => {
  test('bot-field filled submission does NOT appear in Netlify submissions', async ({ page }) => {
    const sentinel = `e2e-bot-${Date.now()}`;

    await page.goto('/subway');

    // POST directly with bot-field filled — simulating a bot
    await page.evaluate(async (sentinel) => {
      const body = new URLSearchParams({
        'form-name': 'outdated-data',
        'bot-field': 'I am a bot',
        details: sentinel,
      });
      await fetch('/netlify-forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    }, sentinel);

    // Wait briefly then confirm no matching submission was stored
    await new Promise((r) => setTimeout(r, 4000));
    const submissions = netlifyApi<{ data: Record<string, string> }[]>(
      'listFormSubmissions',
      { form_id: FORM_IDS['outdated-data'], per_page: 20 }
    );
    const botSubmission = submissions.find((s) => s.data?.details?.includes(sentinel));
    expect(botSubmission, 'honeypot-filled submission should not reach Netlify').toBeUndefined();
  });
});
