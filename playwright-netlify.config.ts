import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for live Netlify Forms tests.
 *
 * NOTE: `netlify dev` does NOT forward form submissions to Netlify's backend —
 * it accepts POSTs locally and returns 200 but nothing is stored remotely.
 * To actually test submissions reaching the Netlify Forms API, run against
 * the deployed site by setting BASE_URL:
 *
 *   BASE_URL=https://eatmacros.netlify.app npm run test:netlify
 *
 * Without BASE_URL the tests run against the deployed production URL by default.
 */

const BASE_URL = process.env.BASE_URL ?? 'https://eatmacros.netlify.app';
const isLocal = BASE_URL.includes('localhost');

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/netlify-forms-live.spec.ts',
  fullyParallel: false, // submissions must not race each other
  retries: 0,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Only spin up a local server when targeting localhost
  ...(isLocal && {
    webServer: {
      command: 'npm run dev',
      url: BASE_URL,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  }),
});
