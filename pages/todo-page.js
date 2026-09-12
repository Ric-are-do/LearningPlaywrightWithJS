// @ts-check

/**
 * Page Object for the TodoMVC demo app.
 *
 * The idea: a test should read like a description of user behaviour
 * ("add a todo, then remove it"), not like a list of selectors. Locators live
 * here; intent lives in the spec. When the app's markup changes you fix this
 * one file instead of every test that touched that element.
 *
 * Note the locators are built ONCE in the constructor. A Locator is lazy -- it
 * does not look anything up until you act on it -- so building it early is free
 * and it stays correct even as the page re-renders.
 */
export class TodoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.counter = page.getByTestId('todo-count');
    this.toggleAll = page.getByRole('checkbox', { name: 'Mark all as complete' });
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  /** Empty string, not '/' -- see the baseURL note in playwright.config.js. */
  async goto() {
    await this.page.goto('');
  }

  /** @param {string} text */
  async addTodo(text) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  /**
   * Narrow the list down to the single row containing `text`.
   * Returns a Locator, so callers can keep chaining off it.
   * @param {string} text
   */
  itemByText(text) {
    return this.todoItems.filter({ hasText: text });
  }

  /** @param {string} text */
  async toggle(text) {
    await this.itemByText(text).getByLabel('Toggle Todo').check();
  }

  /**
   * TodoMVC keeps the delete button at `display: none` until the row is
   * hovered, so a bare click would time out waiting for visibility.
   * @param {string} text
   */
  async remove(text) {
    const item = this.itemByText(text);
    await item.hover();
    await item.getByLabel('Delete').click();
  }

  /** Used as fixture teardown -- leaves the app empty for the next test. */
  async removeAll() {
    while (await this.todoItems.count() > 0) {
      const first = this.todoItems.first();
      await first.hover();
      await first.getByLabel('Delete').click();
    }
  }
}
