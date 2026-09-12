# 3. JavaScript for Playwright

You do not need to be a JavaScript expert to write good Playwright tests. You do
need about ten language features, and you need to understand `async`/`await`
properly — because nearly every "flaky test" in a beginner's suite is really a
misunderstood promise.

This page covers exactly those features, each mapped to real lines in this repo.

---

## Video courses

**[Get started with end-to-end testing: Playwright](https://www.youtube.com/watch?v=4-LwodVujTg&list=PLQ6Buerc008ed-F9OksF7ek37wR3y916p&index=1)**
— the official multi-episode series, starting at "Episode 1 — Introduction".
Short episodes, each on one concept. The best first thing to watch.

**[Playwright TypeScript | Getting Started](https://www.youtube.com/watch?v=mF9hS9hvej8&t=406s)**
— a longer single-session walkthrough. Heads up: it is taught in **TypeScript**,
while this project is JavaScript. That matters less than it sounds — the
Playwright API is identical, and the only real difference is type annotations:

```ts
const name: string = 'buy milk';                 // TypeScript
async function addTodo(text: string) { }
```
```js
const name = 'buy milk';                         // the JavaScript you write here
async function addTodo(text) { }
```

Mentally delete the `: string` bits and the rest is the same code. (When you do
want types later, you get most of the benefit in plain JS via the `// @ts-check`
comment and JSDoc — both already used in this repo.)

---

## `const` and `let` — never `var`

```js
const API = 'https://jsonplaceholder.typicode.com';   // never reassigned
let api;                                              // assigned later, in beforeAll
```

Default to `const`. Reach for `let` only when you genuinely reassign.

`const` prevents **reassignment**, not mutation — this is fine and normal:

```js
const items = page.getByTestId('todo-item');
await items.first().click();     // using the object, not reassigning the binding
```

`var` is legacy, has confusing function-level scope, and has no place in new
code.

---

## Arrow functions

```js
test('add a todo', async ({ todoPage }) => {
  // ...
});
```

`(args) => { body }` is a compact function. Playwright's API takes callbacks
everywhere — every test, hook, fixture and `test.step` is one.

```js
async function seed(page, todos) { }           // classic declaration
const seed = async (page, todos) => { };       // arrow equivalent
```

Use whichever reads better. This repo uses arrows for inline callbacks and named
declarations for helpers.

---

## `async` / `await` — the one that matters

**Almost every Playwright call returns a Promise.** A promise is a placeholder
for a value that is not ready yet. `await` pauses until it resolves.

```js
await page.goto('');                       // wait for navigation
await input.fill('buy milk');              // wait for the element, then type
const text = await title.textContent();    // wait, then unwrap the value
```

`await` is only legal inside an `async` function — which is why every test
callback is written `async ({ page }) => { ... }`.

### What forgetting `await` actually does

```js
page.getByRole('button').click();     // BUG: no await
await expect(something).toBeVisible();
```

The click is *started* but not waited for. Execution races ahead to the next
line while the browser is still working. It might pass on your fast laptop and
fail on CI — the textbook flaky test. Worse, the error surfaces later, in an
unrelated place, because the rejected promise had nowhere to go.

**Rule: if a line touches `page`, `locator`, `expect` or `request`, it starts
with `await`.**

### Where `await` goes with `expect`

This distinction causes more flaky tests than anything else in Playwright:

```js
// WRONG — reads the text once, right now. No retry.
expect(await title.textContent()).toBe('buy milk');

// RIGHT — hands the locator to expect, which polls until it matches.
await expect(title).toHaveText('buy milk');
```

Both compile. Both often pass. Only the second one retries while the app
finishes rendering. The tell is **where `await` sits**: inside `expect(...)` is
the smell, in front of `expect(...)` is correct.

See [`tests/02-assertions.spec.js`](../tests/02-assertions.spec.js).

---

## Destructuring

Pulling properties out of an object by name:

```js
const { page } = fixtures;    // same as: const page = fixtures.page;
```

This is what the test signature is doing:

```js
test('add a todo', async ({ page }) => { });               // I need `page`
test('GET a post',  async ({ request }) => { });           // I need `request`
test('add a todo',  async ({ todoPage }) => { });          // I need our custom fixture
test('...',         async ({ page, request }) => { });     // both
```

It is not decoration — Playwright reads those names and **only builds the
fixtures you ask for**. Requesting `page` launches a browser context; a test that
asks only for `request` never opens a browser and runs far faster. That is why
`tests/05-api.spec.js` uses `async ({})` for tests needing neither.

Imports destructure too:

```js
import { test, expect } from '@playwright/test';
```

---

## Template literals

Backticks with `${...}` holes:

```js
const response = await request.get(`${API}/posts/1`);
await page.goto(`${baseURL}/users/${userId}`);
```

Cleaner than `API + '/posts/1'`, and they can span multiple lines.

---

## Modules: `import` / `export`

```js
// pages/todo-page.js
export class TodoPage { }                          // named export

// tests/04-page-object.spec.js
import { TodoPage } from '../pages/todo-page.js';  // matching named import
```

- **Named** exports use braces and must match the exported name.
- **Default** exports (`export default defineConfig({...})` in the config) are
  imported without braces, under any name you like.
- Relative paths need `./` or `../`. Include the `.js` extension.

Re-exporting is how `fixtures/test.js` lets specs use one import line:

```js
export { expect } from '@playwright/test';
```

---

## Classes

The Page Object pattern is just a class:

```js
export class TodoPage {
  constructor(page) {
    this.page = page;                                        // store the input
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
  }

  async addTodo(text) {                                      // a method
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }
}
```

- `constructor` runs on `new TodoPage(page)`.
- `this` refers to the instance — `this.newTodoInput` is stored in the
  constructor and reused by every method.
- Methods that `await` anything must be `async`, and callers must `await` them.

---

## Objects as named arguments

JavaScript has no named parameters, so libraries pass an options object:

```js
page.getByRole('button', { name: 'Submit', exact: true });
await expect(locator).toBeVisible({ timeout: 10_000 });
await api.get('/comments', { params: { postId: 1 } });
```

Whenever you see `{ ... }` as a final argument, it is optional settings. `10_000`
is just `10000` — underscores are legal digit separators.

---

## Spread: `...`

Copies properties from one object into another:

```js
{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }
```

That unpacks every property of the built-in Chrome device preset — viewport,
user agent, device scale — into `use`. Add your own keys afterwards to override:

```js
use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } }
```

---

## Looping — and the async trap

Use `for...of` for anything containing `await`:

```js
for (const todo of ['buy milk', 'walk the dog']) {
  await input.fill(todo);
  await input.press('Enter');
}
```

**Never use `forEach` with an async callback:**

```js
// BROKEN — forEach ignores returned promises
todos.forEach(async (todo) => {
  await input.fill(todo);     // all start at once, nothing is awaited
});
```

`forEach` throws away whatever the callback returns, so it fires all of them
simultaneously and moves on without waiting. `for...of` respects `await`. This
trap catches almost everyone once.

If you truly want parallel work, be explicit:

```js
const responses = await Promise.all([
  request.get(`${API}/posts/1`),
  request.get(`${API}/posts/2`),
]);
```

---

## Regular expressions

Anywhere Playwright accepts a string, it usually accepts a regex:

```js
await expect(page).toHaveTitle(/Playwright/);              // contains
await expect(page).toHaveURL(/.*intro/);
await expect(row).toHaveClass(/completed/);                // one class among many
page.getByRole('button', { name: /^submit$/i });           // exact, case-insensitive
```

The essentials: `/…/` delimits it, `^`/`$` anchor start and end, `.*` is
anything, `i` makes it case-insensitive. Reach for one when the string is partly
dynamic.

---

## Truthy / falsy

```js
expect(response.ok()).toBeTruthy();     // any 2xx status
expect(response.ok()).toBeFalsy();
```

Falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Everything else is
truthy. Prefer an exact assertion when you can be exact —
`expect(response.status()).toBe(404)` beats a truthiness check.

---

## `toBe` vs `toEqual`

```js
expect(1).toBe(1);                                   // primitives: identity
expect({ a: 1 }).toBe({ a: 1 });                     // FAILS — different objects
expect({ a: 1 }).toEqual({ a: 1 });                  // passes — deep comparison

expect(body).toEqual(expect.objectContaining({       // partial match
  id: 1,
  title: expect.any(String),
}));
```

`toBe` is reference identity; `toEqual` walks the structure. For API responses
you almost always want `toEqual`, usually with `objectContaining` so you assert
on the fields you care about and ignore the rest.

---

## Optional chaining and nullish coalescing

```js
const count = data?.items?.length ?? 0;
```

`?.` short-circuits to `undefined` instead of throwing on a missing property.
`??` supplies a fallback for `null`/`undefined` only — unlike `||`, it leaves `0`
and `''` alone.

---

## Cheat sheet

| Feature | Looks like | Where in this repo |
|---|---|---|
| `const` / `let` | `const API = '...'` | `tests/05-api.spec.js` |
| Arrow function | `async ({ page }) => { }` | every test |
| `async`/`await` | `await page.goto('')` | everywhere |
| Destructuring | `async ({ todoPage })` | `tests/04-page-object.spec.js` |
| Template literal | `` `${API}/posts/1` `` | `tests/05-api.spec.js` |
| Named import/export | `export class TodoPage` | `pages/todo-page.js` |
| Class | `constructor(page) { }` | `pages/todo-page.js` |
| Options object | `{ name: 'Submit', exact: true }` | `tests/01-locators.spec.js` |
| Spread | `{ ...devices['Desktop Chrome'] }` | `playwright.config.js` |
| `for...of` | `for (const t of todos)` | `tests/03-interactions.spec.js` |
| Regex | `/Playwright/` | `tests/02-assertions.spec.js` |
| `toEqual` + `objectContaining` | partial object match | `tests/05-api.spec.js` |

---

## The five mistakes to watch for

1. **Missing `await`** on a Playwright call.
2. **`expect(await locator.textContent())`** instead of
   `await expect(locator).toHaveText(...)`.
3. **`forEach` with an async callback** — use `for...of`.
4. **`toBe` on an object** — use `toEqual`.
5. **Reassigning a `const`** — that is what `let` is for. (Note that *mutating*
   a `const` object is fine.)

---

## Reference

- [MDN — JavaScript basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN — Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS)
- [javascript.info — Promises, async/await](https://javascript.info/async)

**Back to:** [Lessons index](./README.md)
