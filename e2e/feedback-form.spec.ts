/**
 * Feedback form e2e tests.
 *
 * The POST to / is intercepted so tests never actually hit Netlify Forms.
 * We validate field presence, honeypot behaviour, form-name routing,
 * success/error states, and that empty details blocks submission.
 */

import { test, expect } from '@playwright/test';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Intercept the Netlify Forms POST. Returns a promise that resolves with the
 *  parsed URLSearchParams body once the submission is captured. */
function interceptFormPost(page: import('@playwright/test').Page, status = 200) {
  let resolve: (fields: Record<string, string>) => void;
  const captured = new Promise<Record<string, string>>((r) => { resolve = r; });

  page.route('/netlify-forms.html', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const body = request.postData() ?? '';
      const params = Object.fromEntries(new URLSearchParams(body));
      resolve(params);
      await route.fulfill({ status, body: status === 200 ? 'ok' : 'error' });
    } else {
      await route.continue();
    }
  });

  return captured;
}

// ─── Report Outdated Info ─────────────────────────────────────────────────────

test.describe('feedback: Report Outdated Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subway');
  });

  test('opens modal on button click', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    await expect(page.getByRole('heading', { name: /report outdated info/i })).toBeVisible();
  });

  test('submit button disabled when details is empty', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    const submit = page.getByRole('button', { name: /submit/i });
    await expect(submit).toBeDisabled();
  });

  test('submit button enabled after typing details', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    await page.getByPlaceholder(/protein for this item/i).fill('Calories are wrong');
    const submit = page.getByRole('button', { name: /submit/i });
    await expect(submit).toBeEnabled();
  });

  test('posts correct fields to Netlify Forms with empty bot-field', async ({ page }) => {
    const captured = interceptFormPost(page);
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();

    await page.getByPlaceholder(/e\.g\. Subway/i).fill('Subway');
    await page.getByPlaceholder(/chicken teriyaki/i).fill('Chicken Teriyaki');
    await page.getByPlaceholder(/protein for this item/i).fill('Calories should be 396 not 400');
    await page.getByPlaceholder(/you@example\.com/i).fill('user@test.com');

    await page.getByRole('button', { name: /submit/i }).click();

    const fields = await captured;
    expect(fields['form-name']).toBe('outdated-data');
    expect(fields['bot-field']).toBe('');        // honeypot must be empty
    expect(fields['restaurant']).toBe('Subway');
    expect(fields['item-name']).toBe('Chicken Teriyaki');
    expect(fields['details']).toBe('Calories should be 396 not 400');
    expect(fields['email']).toBe('user@test.com');
  });

  test('shows success state after submission', async ({ page }) => {
    interceptFormPost(page);
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    await page.getByPlaceholder(/protein for this item/i).fill('Test feedback');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/thanks for your feedback/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows error state when server returns non-200', async ({ page }) => {
    interceptFormPost(page, 500);
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    await page.getByPlaceholder(/protein for this item/i).fill('Test feedback');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/something went wrong/i)).toBeVisible({ timeout: 5000 });
  });

  test('closes on backdrop click', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    await expect(page.getByRole('heading', { name: /report outdated info/i })).toBeVisible();
    // Click the backdrop (fixed inset-0 behind the modal)
    await page.mouse.click(10, 10);
    await expect(page.getByRole('heading', { name: /report outdated info/i })).not.toBeVisible();
  });
});

// ─── Suggest a Restaurant ─────────────────────────────────────────────────────

test.describe('feedback: Suggest a Restaurant', () => {
  test.beforeEach(async ({ page }) => {
    // SuggestRestaurantButton lives in <main> on the home page
    await page.goto('/');
  });

  test('opens modal on button click', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /suggest a restaurant/i }).click();
    await expect(page.getByRole('heading', { name: /suggest a restaurant/i })).toBeVisible();
  });

  test('does not show restaurant/item-name fields', async ({ page }) => {
    await page.getByRole('main').getByRole('button', { name: /suggest a restaurant/i }).click();
    await expect(page.getByPlaceholder(/e\.g\. Subway/i)).not.toBeVisible();
    await expect(page.getByPlaceholder(/chicken teriyaki/i)).not.toBeVisible();
  });

  test('posts correct form-name and empty bot-field', async ({ page }) => {
    const captured = interceptFormPost(page);
    await page.getByRole('main').getByRole('button', { name: /suggest a restaurant/i }).click();

    await page.getByPlaceholder(/boost juice/i).fill('Boost Juice — smoothies after gym');
    await page.getByRole('button', { name: /submit/i }).click();

    const fields = await captured;
    expect(fields['form-name']).toBe('restaurant-request');
    expect(fields['bot-field']).toBe('');
    expect(fields['details']).toBe('Boost Juice — smoothies after gym');
    expect(fields['restaurant']).toBeUndefined();
  });

  test('shows success state after submission', async ({ page }) => {
    interceptFormPost(page);
    await page.getByRole('main').getByRole('button', { name: /suggest a restaurant/i }).click();
    await page.getByPlaceholder(/boost juice/i).fill('Test suggestion');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/thanks for your feedback/i)).toBeVisible({ timeout: 5000 });
  });
});

// ─── Honeypot guard ───────────────────────────────────────────────────────────

test.describe('feedback: honeypot field', () => {
  test('bot-field input is not visible to users', async ({ page }) => {
    await page.goto('/subway');
    await page.getByRole('main').getByRole('button', { name: /report outdated info/i }).click();
    const honeypot = page.locator('input[name="bot-field"]');
    // Present in DOM but hidden — aria-hidden parent, not visible
    await expect(honeypot).not.toBeVisible();
  });
});
