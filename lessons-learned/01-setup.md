# 1. Setup — building this project from scratch

The goal of this page: you could delete this whole repo and rebuild it from an
empty folder, understanding every step. Nothing here is copy-paste-and-pray.

---

## What Playwright actually is

Playwright is two things bundled together, and confusing them causes most early
frustration:

1. **A browser automation library** — code that drives Chromium, Firefox and
   WebKit. It talks to real browsers over a debug protocol.
2. **A test runner** (`@playwright/test`) — it finds your spec files, runs them
   in parallel, retries, reports, and provides the `test` and `expect`
   functions.

You install one npm package, `@playwright/test`, and get both. The browsers
themselves are **separate binaries**, downloaded once and cached outside the
project — which is why `node_modules` stays small but the first install is slow.

---

## Prerequisites

| Tool | Why you need it | Where to get it |
|---|---|---|
| **Node.js** (v18+, LTS recommended) | Playwright is a Node library. Ships with `npm` and `npx`. | <https://nodejs.org> — download the **LTS** installer |
| **A terminal** | PowerShell on Windows, Terminal on macOS, any shell on Linux. | Built in |
| **VS Code** (optional, recommended) | The official extension adds run/debug buttons beside each test and a locator picker. | <https://code.visualstudio.com>, then install **Playwright Test for VSCode** |

Check what you already have:

```bash
node --version    # this project was built on v22.16.0
npm --version     # 11.5.2
```

If `node` is not recognised, Node is either not installed or not on your PATH.
Install it, then open a **new** terminal — PATH changes do not reach terminals
that are already open.

---

## Step 1 — create the folder

```bash
mkdir my-playwright-project
cd my-playwright-project
```

That is all the preparation needed. Do **not** run `npm init` first — the
Playwright generator writes `package.json` for you.

---

## Step 2 — run the official generator

```bash
npm init playwright@latest
```

`npm init <name>` is shorthand for "download the `create-<name>` package and run
it". Nothing is permanently installed just to run it, and `@latest` means you
always get the current generator.

It asks four questions:

| Question | Answer for a project like this | Why |
|---|---|---|
| TypeScript or JavaScript? | **JavaScript** | We are learning Playwright, not the type system. You can switch later. |
| Name of your tests folder | **tests** | The default. `playwright.config.js` points at it via `testDir`. |
| Add a GitHub Actions workflow? | **No** | No CI here. Say yes on a real project — it is a solid starting workflow. |
| Install Playwright browsers? | **Yes** | You need them. This is the slow part. |

### Skipping the prompts

Every answer has a flag. This is what the project actually used:

```bash
npm init playwright@latest -- --quiet --lang=js \
  --browser=chromium --browser=firefox --browser=webkit
```

The bare `--` matters: it separates npm's own arguments from the ones passed
through to the generator.

Other useful flags: `--lang=js|ts`, `--browser=`, `--gha` (add the GitHub
Actions workflow), `--no-examples`, `--quiet` (accept all defaults),
`--install-deps` (Linux system libraries).

---

## Step 3 — understand what just appeared

```
package.json           declares @playwright/test as a devDependency
package-lock.json      exact resolved versions — commit this file
playwright.config.js   all runner configuration
tests/example.spec.js  a starter test hitting playwright.dev
.gitignore             ignores node_modules and test output
node_modules/          the installed packages
```

Two things worth noticing:

- **`@playwright/test` is a `devDependency`.** Tests never ship to production,
  so they belong in `devDependencies`, not `dependencies`.
- **The browsers are not in `node_modules`.** They go to a shared cache:
  - Windows: `%LOCALAPPDATA%\ms-playwright`
  - macOS: `~/Library/Caches/ms-playwright`
  - Linux: `~/.cache/ms-playwright`

  Around 400 MB for all three engines, shared across every Playwright project on
  the machine — so your second project installs almost instantly.

### Installing browsers on their own

If you skipped that prompt, or you just cloned someone else's repo:

```bash
npx playwright install              # all three engines
npx playwright install chromium     # just one
npx playwright install --with-deps  # Linux/CI: also install system libraries
```

This is the step people forget after cloning. `npm install` gets the library;
`npx playwright install` gets the browsers. They are separate.

---

## Step 4 — add npm scripts

The generator leaves `"scripts"` empty. Typing
`npx playwright test --project=chromium --headed` fifty times a day gets old, so
name the commands you actually use:

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "test:debug": "playwright test --debug",
  "test:chromium": "playwright test --project=chromium",
  "report": "playwright show-report",
  "codegen": "playwright codegen https://demo.playwright.dev/todomvc/",
  "trace": "playwright show-trace"
}
```

Inside a script you write `playwright`, not `npx playwright` — npm already puts
`node_modules/.bin` on the PATH.

Run them with `npm run <name>`. (`npm test` works without `run`, because `test`
is a built-in npm lifecycle script — a small quirk worth knowing.)

---

## Step 5 — configure `playwright.config.js`

The generated config is heavily commented. Here are the options that matter
early, as set in this project:

```js
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://demo.playwright.dev/todomvc/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

| Option | What it does |
|---|---|
| `testDir` | Where spec files live. Anything matching `*.spec.js` beneath it gets collected. |
| `fullyParallel` | Run tests *within* a file in parallel too, not just across files. Safe when tests share no state. |
| `reporter` | `list` prints live progress; `html` writes a browsable report. `open: 'never'` stops a browser tab launching after every single run. |
| `baseURL` | Lets you write `page.goto('')` instead of a full URL. **See the gotcha below.** |
| `trace` / `screenshot` / `video` | Artifacts captured on failure. The trace is why you rarely need `console.log`. |
| `projects` | Each project is a full run of the suite under different settings — here, three browser engines. Also used for mobile viewports or a login setup step. |

### The `baseURL` gotcha

Relative paths resolve through `new URL(path, baseURL)`, which follows normal URL
rules — and **a leading slash throws the path away**:

```js
// baseURL = 'https://demo.playwright.dev/todomvc/'
page.goto('')             // -> https://demo.playwright.dev/todomvc/        correct
page.goto('./#/active')   // -> https://demo.playwright.dev/todomvc/#/active
page.goto('/')            // -> https://demo.playwright.dev/                wrong!
```

An absolute URL (`https://playwright.dev/`) ignores `baseURL` entirely — which
is how this project mixes two different sites in one suite.

---

## Step 6 — the folder layout this project uses

The generator gives you `tests/`. Everything else is a convention you pick:

```
tests/          spec files — one topic per file, numbered so the order is obvious
pages/          Page Objects: one class per screen, holding that screen's locators
fixtures/       a custom `test` function carrying project-specific fixtures
```

`pages/` and `fixtures/` sit **outside** `testDir` deliberately — they are not
tests, and you do not want the runner trying to execute them.

---

## Step 7 — run it

```bash
npm test                  # everything, all three browsers
npm run test:chromium     # fast loop while writing
npm run test:ui           # start here — see below
npm run report            # open the HTML report from the last run
```

### Where to actually spend your time

**`npm run test:ui`** launches UI Mode: a test explorer with a time-travel DOM
viewer. Click any step of any test and see exactly what the page looked like at
that moment, with the matching element highlighted. It also watches your files
and re-runs on save. For learning, it is worth more than every other command put
together.

**`npm run codegen`** opens a browser and writes test code as you click. Its real
value is not the generated code — it is watching *which locators it picks*,
because it prefers `getByRole` for the same reasons you should.

---

## Troubleshooting

**`'playwright' is not recognized`**
You are outside the project folder, or `npm install` has not run. Use
`npx playwright ...` or an npm script — never a bare `playwright`.

**`browserType.launch: Executable doesn't exist at ...`**
Browser binaries are missing. Run `npx playwright install`. Common after cloning
a repo, or after a Playwright upgrade that needs newer binaries.

**Tests pass locally, fail on CI**
Nearly always a missing `await`, or `expect(await locator.textContent())` where
`await expect(locator).toHaveText(...)` was meant. See
[JavaScript for Playwright](./03-javascript-for-playwright.md).

**The suite feels slow**
You are running three engines. Use `npm run test:chromium` while writing and
save the full run for before you commit.

**A corporate proxy blocks the browser download**
Set the proxy before installing:

```bash
$env:HTTPS_PROXY="http://proxy.company.com:8080"   # PowerShell
npx playwright install
```

**Working inside OneDrive / Dropbox** (this project is)
Sync clients sometimes lock files mid-write, giving `EPERM` or `EBUSY` during
`npm install`. Pause syncing, re-run, resume. Excluding `node_modules` from sync
avoids it entirely and saves a lot of upload bandwidth.

---

## Recap — the whole thing

```bash
mkdir my-project && cd my-project
npm init playwright@latest      # scaffold + install browsers
# add scripts to package.json, set baseURL in playwright.config.js
npm run test:ui                 # explore
npm test                        # run everything
```

**Next:** [2. Locators](./02-locators.md)
