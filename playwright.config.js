// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for this learning sandbox.
 * Every option is documented at https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Run test files in parallel. Every test here is independent, so this is safe. */
  fullyParallel: true,

  /* Fail the run if a stray `test.only` was left in the source (CI only). */
  forbidOnly: !!process.env.CI,

  /* No retries locally. While learning, a flaky test should fail loudly rather
     than quietly pass on the second attempt. */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* 'list' prints live progress in the terminal; 'html' writes a rich report.
     `open: 'never'` stops a browser tab from hijacking your terminal after every
     run -- open it on demand with `npm run report`. */
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    /* Relative paths in page.goto() are resolved with `new URL(path, baseURL)`.
       GOTCHA WORTH REMEMBERING: a leading slash discards the `/todomvc/` path.
         page.goto('')          -> https://demo.playwright.dev/todomvc/   correct
         page.goto('./#/active')-> https://demo.playwright.dev/todomvc/#/active
         page.goto('/')         -> https://demo.playwright.dev/           wrong!
       An absolute URL (https://playwright.dev/) ignores baseURL entirely. */
    baseURL: 'https://demo.playwright.dev/todomvc/',

    /* Artifacts kept only for failures, so passing runs stay fast and tidy.
       The trace is the single best debugging tool Playwright ships: it records a
       DOM snapshot, network and console for every step. After a failure, run
       `npm run report` and click into the trace. */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* The same tests run against all three engines. Use `--project=chromium`
     for a fast feedback loop while writing. */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
