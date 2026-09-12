# Lessons Learned

Written notes to go alongside the code in this repo. The specs in `tests/` show
you *what* the API does; these pages explain *why*, and give you enough to
rebuild the whole project yourself.

Read them in order — each one assumes the last.

| # | Page | What you get out of it |
|---|---|---|
| 1 | **[Setup](./01-setup.md)** | What Playwright actually is, what to install, what every generated file does, and how to configure it. Rebuild this project from an empty folder. |
| 2 | **[Locators](./02-locators.md)** | How to find elements reliably. CSS and XPath fundamentals via a free course, then a deep pass on ARIA roles and `getByRole`, which is what Playwright wants you using. |
| 3 | **[JavaScript for Playwright](./03-javascript-for-playwright.md)** | The ~10 JavaScript features test code actually uses, `async`/`await` in particular — where most "flaky test" problems really come from. |

---

## External resources, collected

**Courses and video**

- [Get started with end-to-end testing: Playwright](https://www.youtube.com/watch?v=4-LwodVujTg&list=PLQ6Buerc008ed-F9OksF7ek37wR3y916p&index=1)
  — official series, short episodes, one concept each. Best starting point.
- [Playwright TypeScript | Getting Started](https://www.youtube.com/watch?v=mF9hS9hvej8&t=406s)
  — longer single-session walkthrough. Taught in TypeScript; the Playwright API
  is identical, only type annotations differ. See the note in page 3.
- [Web Element Locator Strategies](https://testautomationu.applitools.com/web-element-locator-strategies/)
  — Test Automation University, Andy Knight. Free, 8 chapters, tool-agnostic
  CSS and XPath fundamentals.

**Documentation**

- [Playwright docs](https://playwright.dev/docs/intro) — genuinely good; skim the
  guides rather than only searching the API reference.
- [Locators](https://playwright.dev/docs/locators) ·
  [Assertions](https://playwright.dev/docs/test-assertions) ·
  [Fixtures](https://playwright.dev/docs/test-fixtures) ·
  [Page Objects](https://playwright.dev/docs/pom) ·
  [API testing](https://playwright.dev/docs/api-testing) ·
  [Trace viewer](https://playwright.dev/docs/trace-viewer)
- [MDN — ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [javascript.info — async/await](https://javascript.info/async)

---

## The short version

If you remember only five things:

1. **`npm install` gets the library; `npx playwright install` gets the
   browsers.** They are separate steps.
2. **Prefer `getByRole(role, { name })`.** Locate elements the way a user
   describes them, not the way the DOM is built.
3. **`await expect(locator)`, never `expect(await locator.textContent())`.**
   Only the first form retries.
4. **Every line touching `page`, `locator`, `expect` or `request` starts with
   `await`.**
5. **When something fails, open the trace** (`npm run report`) before you reach
   for `console.log`.
