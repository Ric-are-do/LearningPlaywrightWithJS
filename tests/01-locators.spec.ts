// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 01 -- LOCATORS: how you tell Playwright which element you mean.
 *
 * A Locator is a lazy description of an element, not the element itself.
 * Nothing is looked up until you act (click, fill) or assert on it, which is
 * why locators survive re-renders that would break a captured element handle.
 *
 * Preference order, best first:
 *   1. getByRole      -- how assistive tech sees the page; survives restyling
 *   2. getByLabel / getByPlaceholder / getByText -- user-visible anchors
 *   3. getByTestId    -- an explicit contract with the developers
 *   4. CSS / XPath    -- last resort, breaks when markup is refactored
 *
 * Docs: https://playwright.dev/docs/locators
 */

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('getByRole is the locator to reach for first', async ({ page }) => {
  // Role + accessible name. Note the name match is case-insensitive and matches
  // substrings by default; pass { exact: true } when you need the whole string.
  await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'TodoMVC' }).first()).toBeVisible();
});

test('getByPlaceholder, getByTestId and getByLabel', async ({ page }) => {
  // getByPlaceholder -- matches the placeholder attribute.
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('learn locators');
  await input.press('Enter');

  // getByTestId -- reads data-testid by default. Change which attribute it
  // reads with `testIdAttribute` in playwright.config.js.
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-title')).toHaveText('learn locators');

  // getByLabel -- matches <label>, aria-label or aria-labelledby.
  await expect(page.getByLabel('Toggle Todo')).not.toBeChecked();
});

test('filter() and chaining narrow a list down to one row', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');
  for (const todo of ['buy milk', 'walk the dog', 'write tests']) {
    await input.fill(todo);
    await input.press('Enter');
  }

  const items = page.getByTestId('todo-item');
  await expect(items).toHaveCount(3);

  // filter({ hasText }) keeps only the rows containing that text...
  const dogRow = items.filter({ hasText: 'walk the dog' });
  await expect(dogRow).toHaveCount(1);

  // ...and chaining searches only INSIDE that row, so this checkbox is
  // unambiguous even though the page has three of them.
  await dogRow.getByLabel('Toggle Todo').check();
  await expect(dogRow.getByLabel('Toggle Todo')).toBeChecked();

  // Positional helpers. Reach for these sparingly -- they break the moment
  // the list order changes.
  await expect(items.first().getByTestId('todo-title')).toHaveText('buy milk');
  await expect(items.nth(1).getByTestId('todo-title')).toHaveText('walk the dog');
  await expect(items.last().getByTestId('todo-title')).toHaveText('write tests');
});

test('strict mode: a locator matching two elements is an error, not a coin flip', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('first');
  await input.press('Enter');
  await input.fill('second');
  await input.press('Enter');

  const items = page.getByTestId('todo-item');
  await expect(items).toHaveCount(2);

  // Acting on a locator that resolves to 2 elements throws rather than silently
  // picking the first one. This is a feature: it catches ambiguous selectors
  // before they become flaky tests. Fix it with .first() or .filter().
  await expect(items.click()).rejects.toThrow(/strict mode violation/i);

  // Assertions on a COUNT are different -- toHaveCount is expected to match many.
  await expect(items).toHaveCount(2);
});

test('falling back to CSS when the app gives you nothing better', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('inspect me');
  await input.press('Enter');

  const item = page.getByTestId('todo-item');

  // This app is well behaved -- its delete button carries aria-label="Delete",
  // so a semantic locator works. When an app gives you nothing, page.locator()
  // takes any CSS selector. It resolves here even though the button is
  // display:none, because counting does not require visibility.
  await expect(item.locator('button.destroy')).toHaveCount(1);
  await expect(item.getByLabel('Delete')).toHaveCount(1);

  // Clicking it, however, DOES require visibility -- see 03-interactions.
  await expect(item.getByLabel('Delete')).toBeHidden();
});
