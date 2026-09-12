# 2. Locators — finding elements on the page

Locators are where beginners lose the most time, and where flaky tests are born.
This page covers the general strategies (CSS, XPath, and why they are a last
resort) and then goes deep on `getByRole`, which is the one Playwright pushes
you toward.

Working code for everything here: [`tests/01-locators.spec.js`](../tests/01-locators.spec.js).

---

## Recommended course

**[Web Element Locator Strategies](https://testautomationu.applitools.com/web-element-locator-strategies/)**
— Test Automation University, by Andy Knight ("Automation Panda"). Free, 8
chapters.

It covers the DOM, CSS selectors and XPath from the ground up. It is
tool-agnostic, which is exactly why it is worth your time: those fundamentals
apply to Playwright, Selenium, Cypress and whatever comes next. Do it, then come
back here for the Playwright-specific layer.

One framing note as you watch it: the course teaches CSS and XPath thoroughly,
and Playwright supports both — but in Playwright they are the **fallback**, not
the default. The next section explains why.

---

## What a locator actually is

A locator is a **lazy description** of how to find an element. Creating one
touches the page zero times:

```js
const button = page.getByRole('button', { name: 'Submit' });  // nothing happened yet
await button.click();                                          // NOW it searches
```

Two consequences worth internalising:

1. **Locators survive re-renders.** A React re-render replaces DOM nodes. An old
   captured element reference would be stale; a locator just looks again.
2. **Every action re-resolves the locator** and waits for *actionability* —
   attached, visible, stable, enabled, unobscured. That is why Playwright tests
   need no `sleep()`.

---

## The strategy ladder

Pick the highest one that works.

| Rank | Strategy | Why |
|---|---|---|
| 1 | `getByRole` | How assistive tech sees the page. Survives restyling and markup churn; tests accessibility for free. |
| 2 | `getByLabel`, `getByPlaceholder`, `getByText`, `getByAltText`, `getByTitle` | Anchored to what a user actually sees. |
| 3 | `getByTestId` | An explicit contract with developers. Stable, but invisible to users — so it cannot catch a broken label. |
| 4 | CSS / XPath | Coupled to markup structure. Breaks on refactors that change nothing a user would notice. |

The principle underneath: **locate elements the way a user describes them.**
Nobody says "click `div.mt-4 > button:nth-child(2)`". They say "click the Submit
button". `getByRole('button', { name: 'Submit' })` is that sentence in code.

---

## ARIA roles — the part Playwright cares about

A **role** answers "what kind of control is this?" — button, link, heading,
checkbox. Every meaningful HTML element has an *implicit* role; `role="..."`
sets one explicitly.

```js
await page.getByRole('button', { name: 'Sign in' }).click();
//                    ^role              ^accessible name
```

### Implicit roles for common HTML

You rarely need to write `role=` yourself — semantic HTML already has one.

| HTML | Implicit role |
|---|---|
| `<a href="...">` | `link` |
| `<button>`, `<input type="button">` / `"submit"` / `"reset"` | `button` |
| `<h1>`…`<h6>` | `heading` (with `level` 1–6) |
| `<input type="text">` / `"email"` / `"tel"` / `"url"`, `<textarea>` | `textbox` |
| `<input type="search">` | `searchbox` |
| `<input type="checkbox">` | `checkbox` |
| `<input type="radio">` | `radio` |
| `<input type="number">` | `spinbutton` |
| `<input type="range">` | `slider` |
| `<select>` | `combobox` (or `listbox` when `multiple`/`size > 1`) |
| `<option>` | `option` |
| `<img alt="...">` | `img` |
| `<ul>`, `<ol>` | `list` |
| `<li>` | `listitem` |
| `<table>` / `<tr>` / `<td>` / `<th>` | `table` / `row` / `cell` / `columnheader` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<header>` (page level) | `banner` |
| `<footer>` (page level) | `contentinfo` |
| `<aside>` | `complementary` |
| `<dialog>` | `dialog` |
| `<form>` (when it has a name) | `form` |
| `<section>` (when it has a name) | `region` |
| `<progress>` | `progressbar` |
| `<p>` | `paragraph` |
| `<hr>` | `separator` |

Note `<div>` and `<span>` are missing — they have **no role**. An app built out
of unlabelled divs cannot be located by role, which is itself a finding: it is
usually unusable with a screen reader too.

### The accessible name

The second half of `getByRole` is the *accessible name* — the label a screen
reader announces. It is computed from several sources, roughly in this order of
precedence:

1. `aria-labelledby` (points at another element's text)
2. `aria-label` (a string on the element itself)
3. A native label — `<label>` for form controls, `alt` for images, `<caption>`
   for tables, `<legend>` for fieldsets
4. `placeholder` (for inputs, when nothing above exists)
5. The element's own text content (buttons, links, headings)
6. `title`

A real example from this project. The TodoMVC delete button is:

```html
<button aria-label="Delete" class="destroy"></button>
```

It has no text at all — visually it is a CSS-drawn "×". But `aria-label` gives it
the name "Delete", so `getByLabel('Delete')` works, and reads far better than
`.locator('button.destroy')`.

### Name matching rules — the ones that surprise people

```js
page.getByRole('button', { name: 'submit' })                  // substring, case-insensitive
page.getByRole('button', { name: 'Submit', exact: true })     // whole string, case-sensitive
page.getByRole('button', { name: /^Submit$/i })               // regex for anything else
```

**By default the name match is a case-insensitive substring**, with whitespace
collapsed. So `{ name: 'Mark all as complete' }` still matches an element whose
real accessible name is `"❯Mark all as complete"` — which is exactly what
happens in `pages/todo-page.js`.

Pass `exact: true` when a shorter name would also match a longer one — "Save"
matching both "Save" and "Save and close".

### All `getByRole` options

| Option | Type | Use it for |
|---|---|---|
| `name` | string \| RegExp | The accessible name |
| `exact` | boolean | Whole-string, case-sensitive name match |
| `checked` | boolean | Checkbox/radio/switch state |
| `pressed` | boolean | Toggle buttons (`aria-pressed`) |
| `selected` | boolean | Tabs, options (`aria-selected`) |
| `expanded` | boolean | Accordions, menus, comboboxes (`aria-expanded`) |
| `disabled` | boolean | Disabled controls |
| `level` | number | Heading level — `getByRole('heading', { level: 2 })` |
| `description` | string \| RegExp | The accessible *description* (`aria-describedby`) |
| `includeHidden` | boolean | Also match elements hidden from assistive tech |

State options let you assert *and* find in one step:

```js
await expect(page.getByRole('checkbox', { name: 'Terms', checked: true })).toBeVisible();
await page.getByRole('button', { name: 'Menu', expanded: false }).click();
```

---

## The other `getBy*` locators

```js
page.getByText('Sign up')                      // visible text; substring by default
page.getByLabel('Password')                    // <label>, aria-label, aria-labelledby
page.getByPlaceholder('What needs to be done?')
page.getByAltText('Company logo')              // images
page.getByTitle('Close')                       // title attribute
page.getByTestId('todo-item')                  // data-testid by default
```

Change which attribute `getByTestId` reads in `playwright.config.js`:

```js
use: { testIdAttribute: 'data-qa' }
```

---

## Narrowing: filter, chain, and position

A locator can match many elements. Three tools cut it down.

**`filter()`** — keep only matching elements:

```js
const items = page.getByTestId('todo-item');

items.filter({ hasText: 'walk the dog' })                  // contains text
items.filter({ hasNotText: 'done' })                       // does not contain
items.filter({ has: page.getByRole('button', { name: 'Delete' }) })   // contains an element
items.filter({ hasNot: page.getByRole('img') })
```

**Chaining** — search *inside* a previous result. This is the one that removes
most ambiguity:

```js
const dogRow = items.filter({ hasText: 'walk the dog' });
await dogRow.getByLabel('Toggle Todo').check();   // only this row's checkbox
```

**Position** — `first()`, `last()`, `nth(i)` (zero-based). These work, but they
break the moment list order changes. Prefer `filter()` when you can.

---

## Strict mode — a feature, not an obstacle

If a locator matches more than one element, acting on it **throws**:

```
Error: strict mode violation: getByTestId('todo-item') resolved to 2 elements
```

Playwright refuses to guess. Selenium-style tools silently take the first match,
which is how you get a test that passes for six months and then quietly clicks
the wrong row.

Fix it by being more specific: `.filter()`, chaining, or an explicit `.first()`
when "any of them" genuinely is the intent.

Assertions about *quantity* are exempt — `toHaveCount(2)` is meant to match many.

---

## When you do need CSS or XPath

They exist, and sometimes nothing better is available:

```js
page.locator('button.destroy')
page.locator('//div[@class="content"]//button')
page.locator('css=.foo >> text=Bar')     // combine engines
```

Playwright also has **layout selectors** for "the element near this other one":

```js
page.getByRole('textbox').filter({ has: page.locator(':right-of(:text("Email"))') })
page.locator('button:near(.promo-card)')
```

Treat all of these as a code smell pointing at the application, not the test.
If you constantly need CSS, the app is missing labels and test ids — and that
same gap makes it hard to use with a screen reader. Filing that as a bug is
often the better fix.

---

## How to discover the right locator

Do not guess from source code. Use a tool:

| Tool | How |
|---|---|
| **UI Mode** | `npm run test:ui`, then the **Pick locator** button. Hover the page, get the suggested locator. |
| **Codegen** | `npm run codegen` — click around, watch the code write itself. |
| **Inspector** | `npm run test:debug` — step through with a locator explorer attached. |
| **Chrome DevTools** | Elements → **Accessibility** pane shows the computed role and name for the selected node. |
| **Trace viewer** | After a failure, `npm run report` → open the trace. Every step has a DOM snapshot you can inspect. |

---

## Common mistakes

| Mistake | Fix |
|---|---|
| `page.locator('#submit-btn-2')` | Ask for a role or test id. Generated ids change. |
| `nth(3)` all over the suite | Use `filter({ hasText })` so the test reads like intent. |
| Ignoring a strict-mode violation with `.first()` | Understand *why* two matched first. Sometimes it is a real duplicate-content bug. |
| `getByText('Save')` matching "Save and close" too | `{ exact: true }`, or switch to `getByRole`. |
| Long CSS chains mirroring the DOM tree | Every one of those is a future failure on an unrelated refactor. |

---

## Reference

- [Playwright — Locators](https://playwright.dev/docs/locators)
- [Playwright — Other locators (CSS, XPath, layout)](https://playwright.dev/docs/other-locators)
- [MDN — ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [W3C — Accessible Name computation](https://www.w3.org/TR/accname-1.2/)

**Next:** [3. JavaScript for Playwright](./03-javascript-for-playwright.md)
