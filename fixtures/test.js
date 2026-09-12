// @ts-check
import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo-page.js';

/**
 * A custom fixture: `base.extend` produces a NEW `test` function that knows how
 * to build a `todoPage` for any test that asks for one.
 *
 * The shape of every fixture is the same three beats:
 *   1. set up before `use()`
 *   2. hand the value to the test with `await use(value)`
 *   3. clean up after `use()` returns
 *
 * Playwright only runs a fixture when a test actually names it in its arguments,
 * so unused fixtures cost nothing.
 *
 * Why this beats `test.beforeEach`: the setup and its matching teardown sit
 * together in one place, and the test receives a typed object instead of
 * reaching for shared mutable state.
 */
export const test = base.extend({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await use(todoPage);

    // Teardown. Each test already gets a fresh browser context (so TodoMVC's
    // localStorage starts empty anyway) -- this is here to show you where
    // cleanup belongs for apps with real, shared server state.
    await todoPage.removeAll();
  },
});

// Re-export `expect` so specs need only one import line.
export { expect } from '@playwright/test';
