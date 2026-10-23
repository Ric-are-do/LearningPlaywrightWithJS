// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 02 -- ASSERTIONS: web-first assertions and the one mistake everyone makes.
 *
 * `await expect(locator).toBeVisible()` is a WEB-FIRST assertion: it re-checks
 * the page every ~100ms until it passes or the timeout (5s) expires. That
 * retry loop is what lets you write tests without a single sleep().
 *
 * `expect(value).toBe(...)` on a plain value does NOT retry -- there is nothing
 * to re-check, the value was already computed.
 *
 * Docs: https://playwright.dev/docs/test-assertions
 */

test('web-first assertions retry until the app catches up', async ({ page }) => {
  await page.goto('');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('retry me');
  await input.press('Enter');

  // No waiting code needed. Each of these polls until it passes.
  await expect(page.getByTestId('todo-title')).toHaveText('retry me');
  await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByLabel('Toggle Todo')).toBeVisible();
});

test('the classic mistake: awaiting the value instead of the locator', async ({ page }) => {
  await page.goto('');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('read carefully');
  await input.press('Enter');

  const title = page.getByTestId('todo-title');

  // AVOID: this reads the text ONCE. If the app is 50ms slower than usual --
  // on CI, on a cold cache -- you get '' and a confusing failure. This is the
  // single largest source of flaky Playwright tests.
  //   expect(await title.textContent()).toBe('read carefully');

  // PREFER: pass the locator itself, so expect() owns the retry loop.
  await expect(title).toHaveText('read carefully');

  // The tell is where `await` sits: inside expect(...) is the smell,
  // in front of expect(...) is correct.
  const snapshotValue = await title.textContent(); // fine once state has settled
  expect(snapshotValue).toBe('read carefully');
});

test('negation, and assertions that describe the whole list', async ({ page }) => {
  await page.goto('');

  const input = page.getByPlaceholder('What needs to be done?');
  for (const todo of ['alpha', 'beta']) {
    await input.fill(todo);
    await input.press('Enter');
  }

  // .not inverts any web-first assertion -- and still retries.
  await expect(page.getByTestId('todo-title').first()).not.toHaveText('gamma');

  // Passing an ARRAY asserts on every matched element at once, in order.
  await expect(page.getByTestId('todo-title')).toHaveText(['alpha', 'beta']);
});

test('page-level assertions: toHaveTitle and toHaveURL', async ({ page }) => {
  // An absolute URL ignores the baseURL set in playwright.config.js.
  await page.goto('https://playwright.dev/');

  // Regexes work anywhere a string does.
  await expect(page).toHaveTitle(/Playwright/);

  await page.getByRole('link', { name: 'Get started' }).click();

  await expect(page).toHaveURL(/.*intro/);
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('soft assertions collect failures instead of stopping at the first', async ({ page }) => {
  await page.goto('');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('check everything');
  await input.press('Enter');

  // expect.soft() records a failure and KEEPS GOING, so one run tells you about
  // every broken thing on the page rather than just the first. The test still
  // fails at the end. Useful for verifying a page full of fields at once.
  await expect.soft(page.getByTestId('todo-title')).toHaveText('check everything');
  await expect.soft(page.getByTestId('todo-count')).toContainText('1 item left');
  await expect.soft(page.getByLabel('Toggle Todo')).not.toBeChecked();

  // A hard assertion for the thing that must hold before the rest can run.
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
});

test('custom timeout for one slow assertion', async ({ page }) => {
  await page.goto('');

  // Raise the retry window for a single assertion instead of slowing the whole
  // suite down with a global timeout bump.
  await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible({ timeout: 10_000 });
});
