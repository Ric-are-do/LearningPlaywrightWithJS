// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 03 -- INTERACTIONS: driving the app the way a person would.
 *
 * Every action auto-waits for ACTIONABILITY before it fires: the element must
 * be attached, visible, stable (not animating), enabled and not covered by
 * something else. That is why you never need sleep() before a click.
 *
 * Docs: https://playwright.dev/docs/input
 */

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

/** Small helper so each test starts from a known list. */
async function seed(page, todos) {
  const input = page.getByPlaceholder('What needs to be done?');
  for (const todo of todos) {
    await input.fill(todo);
    await input.press('Enter');
  }
}

test('fill and press -- typing into a form', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');

  // fill() sets the value in one shot and fires the right events. Prefer it.
  await input.fill('buy milk');
  await input.press('Enter');

  await expect(page.getByTestId('todo-title')).toHaveText('buy milk');
  // The input clears itself after submit.
  await expect(input).toHaveValue('');

  // pressSequentially() types character by character, for inputs that react to
  // each keystroke (autocomplete, search-as-you-type). Slower -- use only when
  // fill() genuinely does not trigger the behaviour you need.
  await input.pressSequentially('walk the dog');
  await expect(input).toHaveValue('walk the dog');
  await input.press('Enter');

  await expect(page.getByTestId('todo-item')).toHaveCount(2);
});

test('check and uncheck -- checkboxes assert their own result', async ({ page }) => {
  await seed(page, ['buy milk', 'walk the dog']);

  const milkRow = page.getByTestId('todo-item').filter({ hasText: 'buy milk' });

  // check() is better than click() here: it is idempotent and verifies the box
  // actually ended up checked, failing with a clear message if it did not.
  await milkRow.getByLabel('Toggle Todo').check();
  await expect(milkRow.getByLabel('Toggle Todo')).toBeChecked();
  await expect(page.getByTestId('todo-count')).toContainText('1 item left');

  await milkRow.getByLabel('Toggle Todo').uncheck();
  await expect(page.getByTestId('todo-count')).toContainText('2 items left');

  // The header chevron toggles every row at once.
  await page.getByRole('checkbox', { name: 'Mark all as complete' }).check();
  await expect(page.getByTestId('todo-count')).toContainText('0 items left');
});

test('hover before clicking an element that is hidden until hover', async ({ page }) => {
  await seed(page, ['buy milk', 'walk the dog']);

  const milkRow = page.getByTestId('todo-item').filter({ hasText: 'buy milk' });

  // TodoMVC keeps the delete button at display:none until the row is hovered.
  // Clicking straight away would sit there waiting for visibility and then
  // time out -- a real failure mode worth feeling once.
  await expect(milkRow.getByLabel('Delete')).toBeHidden();

  await milkRow.hover();
  await expect(milkRow.getByLabel('Delete')).toBeVisible();
  await milkRow.getByLabel('Delete').click();

  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-title')).toHaveText('walk the dog');
});

test('dblclick to enter edit mode', async ({ page }) => {
  await seed(page, ['buy milk']);

  const row = page.getByTestId('todo-item').filter({ hasText: 'buy milk' });

  await row.getByTestId('todo-title').dblclick();

  const editBox = row.getByLabel('Edit');
  await expect(editBox).toBeVisible();
  await editBox.fill('buy oat milk');
  await editBox.press('Enter');

  await expect(page.getByTestId('todo-title')).toHaveText('buy oat milk');
});

test('navigation inside the app, and test.step for a readable report', async ({ page }) => {
  await seed(page, ['buy milk', 'walk the dog']);

  // test.step groups actions into a named, collapsible block in the HTML report
  // and the trace viewer. Worth it for any flow longer than a few lines.
  await test.step('complete one todo', async () => {
    await page.getByTestId('todo-item').filter({ hasText: 'buy milk' })
      .getByLabel('Toggle Todo').check();
  });

  await test.step('the Active filter hides completed todos', async () => {
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page).toHaveURL(/#\/active/);
    await expect(page.getByTestId('todo-title')).toHaveText(['walk the dog']);
  });

  await test.step('the Completed filter shows only the finished one', async () => {
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page).toHaveURL(/#\/completed/);
    await expect(page.getByTestId('todo-title')).toHaveText(['buy milk']);
  });

  await test.step('Clear completed removes it for good', async () => {
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['walk the dog']);
  });
});
