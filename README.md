# Playwright + JavaScript — Learning Sandbox

A hands-on playground for learning [Playwright](https://playwright.dev) with JavaScript.
Every test runs against public demo sites, so there is no app to build or server
to start — clone, `npm install`, and run.

## Quick start

```bash
npm install                 # once
npx playwright install      # once — downloads the browser binaries
npm test                    # run everything, all three browsers
```

## 📚 Lessons Learned

Written notes that explain the *why* behind the code, plus recommended courses
and videos. **New here? Start with these.**

| # | Page | Covers |
|---|---|---|
| 1 | [Setup](./lessons-learned/01-setup.md) | What Playwright is, what to install, every generated file explained — enough to rebuild this project from an empty folder |
| 2 | [Locators](./lessons-learned/02-locators.md) | Finding elements reliably: CSS/XPath fundamentals, then a deep pass on ARIA roles and `getByRole` |
| 3 | [JavaScript for Playwright](./lessons-learned/03-javascript-for-playwright.md) | The JavaScript you actually need — especially `async`/`await`, the source of most flaky tests |

→ [Full index with all external resources](./lessons-learned/README.md)

## The two commands that teach you the most

| Command | Why it matters |
|---|---|
| `npm run test:ui` | **Start here.** UI Mode: a live test explorer with a time-travel DOM viewer, watch mode, and pick-locator. You see the page at every step of every test. |
| `npm run codegen` | Opens a browser and writes test code as you click. The fastest way to learn what a good locator looks like — it prefers `getByRole` for the same reasons you should. |

## All scripts

| Command | What it does |
|---|---|
| `npm test` | Run every test on chromium, firefox and webkit |
| `npm run test:chromium` | One browser only — your fast feedback loop while writing |
| `npm run test:headed` | Watch a real browser window do the work |
| `npm run test:debug` | Step through a test with the Playwright Inspector |
| `npm run test:ui` | Interactive UI Mode (see above) |
| `npm run report` | Open the HTML report from the last run |
| `npm run codegen` | Record a test by clicking through the app |
| `npm run trace` | Open a `trace.zip` by path |

Narrow any run down with a filename or `-g`:

```bash
npx playwright test 01-locators            # one file
npx playwright test -g "strict mode"       # tests matching a title
npx playwright test --project=chromium --headed 03-interactions
```

## Layout

```
playwright.config.js    baseURL, browsers, reporters, failure artifacts — read the comments
tests/                  the lessons, in order
pages/todo-page.js      Page Object for the TodoMVC app
fixtures/test.js        a custom `test` with a ready-made `todoPage`
```

## Suggested order

Read each file top to bottom — they are written as commented lessons, not just
assertions. Run the file, then break something on purpose and watch it fail.

| File | What it covers |
|---|---|
| `tests/01-locators.spec.js` | `getByRole` and friends, `filter()`, chaining, strict mode, when to fall back to CSS — [docs](https://playwright.dev/docs/locators) |
| `tests/02-assertions.spec.js` | Web-first (auto-retrying) assertions, the `expect(await …)` trap, soft assertions — [docs](https://playwright.dev/docs/test-assertions) |
| `tests/03-interactions.spec.js` | `fill`, `press`, `check`, `hover`, `dblclick`, actionability, `test.step()` — [docs](https://playwright.dev/docs/input) |
| `tests/04-page-object.spec.js` | The same flows as 03, rewritten through a page object + fixture — [POM](https://playwright.dev/docs/pom), [fixtures](https://playwright.dev/docs/test-fixtures) |
| `tests/05-api.spec.js` | The `request` fixture, custom request contexts, status codes — [docs](https://playwright.dev/docs/api-testing) |

## When a test fails, read the trace

This is the habit worth building. The config keeps a trace, screenshot and video
for every failure:

```bash
npm test          # something fails
npm run report    # opens the HTML report — click the failed test, then the trace
```

The trace viewer gives you a DOM snapshot **before and after every single
action**, plus the network log, console output and the exact source line. You can
hover elements in those snapshots to see what a locator would have matched. It
beats adding `console.log` almost every time.

## What these tests run against

| Target | Used for |
|---|---|
| [demo.playwright.dev/todomvc](https://demo.playwright.dev/todomvc/) | Most UI tests. Set as `baseURL`, so `page.goto('')` lands here. |
| [playwright.dev](https://playwright.dev) | Page-level assertions and navigation. |
| [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) | API tests. Free fake REST API; writes are echoed back, not stored. |

Because these are live public sites, a failure can mean the network is down or
the site changed — not that your test is wrong. Check the trace before assuming.

## Gotchas already baked into this repo

- **`page.goto('')`, not `page.goto('/')`.** A leading slash throws away the
  `/todomvc/` part of `baseURL`. See the comment in `playwright.config.js`.
- **`await expect(locator)`, never `expect(await locator.textContent())`.** Only
  the first form retries. This is the number one cause of flaky tests.
- **Hover before clicking a hover-revealed control.** TodoMVC's delete button is
  `display: none` until its row is hovered.
- **Strict mode is on by default.** A locator matching two elements throws
  instead of guessing. Narrow it with `.filter()` or `.first()`.
