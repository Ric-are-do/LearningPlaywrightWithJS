# Notes for Ricardo

My working notebook for this project — todos, gotchas, and things to come back
to. Not documentation. Unpolished on purpose.

**How to use this:** add to it as you go. Tick things off, dump half-formed
questions in, write down anything that bit you so it doesn't bite twice.

---

## Where I'm at

**Last updated:** 2026-09-12

Project is set up and working. 26 tests, passing on all three browsers (78 runs
total). Pushed to GitHub as a private repo.

| | |
|---|---|
| Repo | https://github.com/Ric-are-do/LearningPlaywrightWithJS (private) |
| Playwright | 1.63.0 |
| Node / npm | v22.16.0 / 11.5.2 |
| Test status | 78/78 passing |

---

## To do

### Now

- [ ] **Run `npm run test:ui`** — never actually opened UI Mode yet. This is the
      single most useful thing in the toolbox; everything else can wait.
- [ ] Watch [Episode 1 of the official series](https://www.youtube.com/watch?v=4-LwodVujTg&list=PLQ6Buerc008ed-F9OksF7ek37wR3y916p&index=1)
- [ ] Read through `tests/01-locators.spec.js` and actually run it, don't just skim

### Soon

- [ ] Do the [TAU locator strategies course](https://testautomationu.applitools.com/web-element-locator-strategies/) (8 chapters, free)
- [ ] Break a test on purpose, then open the trace with `npm run report` — build
      the habit of reading traces instead of adding console.log
- [ ] Try `npm run codegen` and watch which locators it picks
- [ ] **Write a test from scratch, no copying.** Pick any site. This is the real
      test of whether it clicked.

### Someday / nice to have

- [ ] Add GitHub Actions CI (deliberately skipped at setup — `--gha` flag on the
      generator, or write the workflow by hand)
- [ ] Add ESLint + `eslint-plugin-playwright` — catches missing `await`
      automatically, which is the mistake I'm most likely to make
- [ ] Try a test against a local app instead of a public demo site (`webServer`
      option in the config)
- [ ] Look into `storageState` for skipping login in every test
- [ ] Exclude `node_modules` from OneDrive sync — saves upload bandwidth and
      avoids EPERM lockups during `npm install`

---

## Gotchas I've already hit

Things that cost time once. Don't repeat them.

- **"Repository not found" on push** did *not* mean broken auth. The repo simply
  didn't exist on GitHub yet — git can't create a remote by pushing to it. Fix:
  `gh repo create <name> --private`, then push. Next time, one shot:
  `gh repo create my-project --private --source=. --push`
- **`page.goto('/')` is wrong here.** The leading slash throws away the
  `/todomvc/` part of `baseURL`. Use `page.goto('')`.
- **The delete button in TodoMVC is `display:none` until hover.** A bare click
  just times out. Hover first.
- **`npm install` ≠ `npx playwright install`.** The first gets the library, the
  second gets the browsers. Cloning a repo needs both.

---

## Things to remember

- `await expect(locator).toHaveText(...)` retries. `expect(await locator.textContent())`
  does **not**. This is the #1 cause of flaky tests — if a test is flaky, check
  this first.
- Every line touching `page`, `locator`, `expect`, or `request` starts with `await`.
- Strict mode throwing on 2 matches is a *feature*. Don't slap `.first()` on it
  without understanding why two matched.
- `npm run test:chromium` while writing, full `npm test` before committing.

---

## Questions to answer

- [ ] When should I use a fixture vs `test.beforeEach`? (I have an example of
      each in the repo — compare `fixtures/test.js` with the `beforeEach` in
      `tests/01-locators.spec.js`)
- [ ] How does `storageState` actually work for auth?
- [ ] What's the right way to handle test data that needs cleaning up?
- [ ] Is Page Object still worth it on a small suite, or only at scale?

---

## Log

Append a dated line whenever something meaningful happens. Useful later for
remembering *why* something is the way it is.

**2026-09-12**
- Set up the project from an empty folder with `npm init playwright@latest`
- Wrote 5 topic-based spec files, a Page Object, and a custom fixture
- Chose public demo sites (TodoMVC, playwright.dev, jsonplaceholder) so there's
  no local app to maintain
- Kept `"type": "commonjs"` rather than switching to ESM — Playwright transpiles
  `import` either way, so switching would've been risk for no visible gain
- Added the `lessons-learned/` docs
- Created the GitHub repo and pushed (fixed the `WitJS` → `WithJS` typo in the
  remote URL while doing it)
