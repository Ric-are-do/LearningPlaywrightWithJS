// @ts-check
// Note the import: `test` and `expect` come from OUR fixture file, not straight
// from @playwright/test. That is what makes the `todoPage` argument available.
import { test, expect } from '../fixtures/test.js';

/**
 * 04 -- PAGE OBJECTS + FIXTURES.
 *
 * Compare this file with 03-interactions.spec.js: the same flows, but the
 * selectors have moved into pages/todo-page.js and the navigation into
 * fixtures/test.js. What is left reads like a description of behaviour.
 *
 * The `todoPage` argument is a fixture. Playwright builds it before the test,
 * hands it over, and tears it down afterwards -- and only for tests that ask
 * for it by name.
 *
 * Docs: https://playwright.dev/docs/pom
 *       https://playwright.dev/docs/test-fixtures
 */

test('add a todo', async ({ todoPage }) => {
  await todoPage.addTodo('buy milk');

  await expect(todoPage.todoItems).toHaveCount(1);
  await expect(todoPage.todoTitles).toHaveText(['buy milk']);
  await expect(todoPage.counter).toContainText('1 item left');
});

test('complete a todo', async ({ todoPage }) => {
  await todoPage.addTodo('buy milk');
  await todoPage.addTodo('walk the dog');

  await todoPage.toggle('buy milk');

  await expect(todoPage.counter).toContainText('1 item left');
  await expect(todoPage.itemByText('buy milk')).toHaveClass(/completed/);
});

test('remove a todo', async ({ todoPage }) => {
  await todoPage.addTodo('buy milk');
  await todoPage.addTodo('walk the dog');

  // The hover-then-click dance is hidden inside the page object. The test does
  // not need to know the delete button starts out invisible.
  await todoPage.remove('buy milk');

  await expect(todoPage.todoTitles).toHaveText(['walk the dog']);
});

test('clear all completed todos', async ({ todoPage }) => {
  await todoPage.addTodo('buy milk');
  await todoPage.addTodo('walk the dog');

  await todoPage.toggleAll.check();
  await expect(todoPage.counter).toContainText('0 items left');

  await todoPage.clearCompleted.click();
  await expect(todoPage.todoItems).toHaveCount(0);
});

test('the page object exposes locators, so tests can still drill in', async ({ todoPage }) => {
  await todoPage.addTodo('buy milk');

  // Methods cover the common flows; the raw locators stay public so a test with
  // an unusual need is not forced to add a method to the page object. A page
  // object that only exposes methods tends to grow a long tail of one-off ones.
  await expect(todoPage.itemByText('buy milk').getByLabel('Toggle Todo')).not.toBeChecked();
});
