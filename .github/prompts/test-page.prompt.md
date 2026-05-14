---
name: test-page
description: "Discover all interactive elements and behaviors of an application page using playwright-cli, then generate Playwright e2e tests. Navigating to a sub-page (e.g. a detail view) is allowed but ends that flow's exploration boundary. Accepts optional test-case scenarios (skip discovery, implement directly) and optional input values to use during interaction. Use when: writing tests for a page, exploring what a page does, generating e2e specs from a live URL."
argument-hint: "URL of the page to test, optional test-case scenarios, optional input values"
agent: agent
tools: [execute/getTerminalOutput, execute/killTerminal, execute/runInTerminal, read/readFile, edit/createDirectory, edit/createFile]
---

# Discover and Generate Playwright E2E Tests for a Page

You are an expert Playwright test engineer. Your task is to **discover the functionality of a page** using `npx playwright-cli` and then **generate a complete Playwright TypeScript test file** covering what you found.

> **All browser interactions must go through `npx playwright-cli` terminal commands. Never use any integrated browser tool, browser MCP, or built-in browser capability.**

## Inputs

- **Page URL** *(required)*: The starting URL to test. Ask the user for it if not provided.
- **Test-case scenarios** *(optional)*: Explicit descriptions of what should be tested (e.g. "user can log in with valid credentials", "sorting the table by name works"). When provided, **skip Phase 2 discovery entirely** and go directly to Phase 3, implementing exactly the described scenarios.
- **Input values** *(optional)*: Specific values to use for particular fields (e.g. `username: admin`, `date: 2026-01-15`). Use these values when interacting with those fields during discovery or test implementation.
- **Test file output path** *(optional)*: Default is `tests/<page-name>.spec.ts` derived from the page path.

## Phase 1 — Open & Initial Snapshot

1. Open the page in **headed mode** (so the browser window is visible during exploration):
   ```
   npx playwright-cli open --headed --browser=chromium <pageUrl>
   ```
2. Take an initial snapshot and record the **page title** and **current URL**:
   ```
   playwright-cli snapshot
   ```
3. **Wait for the page to fully load** — SPAs often render an empty shell first. After the snapshot, check whether any interactive elements (buttons, inputs, links, etc.) are present in the snapshot:
   - If **no interactive elements** are found, wait a moment and take another snapshot. Repeat until interactive elements appear or until 5 retries are exhausted.
   - If after 5 retries there are still no interactive elements, report to the user that the page may not have loaded correctly and stop.
4. **Check for a login redirect**: if the current URL differs from `<pageUrl>` and the page contains a login form (username/password fields or a "sign in" heading), proceed to the **Login Handling** step below before continuing.
5. Note the starting URL after any login as the **origin page**. Any navigation away from it (e.g. clicking into a detail view) is allowed as part of a flow but marks the **end of that flow's exploration** — do not continue interacting with the destination page.

### Login Handling

When a login redirect is detected:

1. **Read credentials** from `.playwright/.credentials` in the repository root. The file uses `key: value` format:
   ```
   login: myuser
   password: mypassword
   ```
   Read it using:
   ```
   playwright-cli eval "undefined" # then use filesystem tools to read .playwright/.credentials
   ```
   Use the `read_file` tool (or equivalent) to load `.playwright/.credentials`.

2. **If the file does not exist or is missing required keys**: ask the user for the login and password using the `vscode_askQuestions` tool (or prompt the user directly). Then **create the file** at `.playwright/.credentials` with the provided values in `key: value` format before proceeding. The file is already listed in `.gitignore` and will not be committed.

3. **Perform the login**:
   - Fill the username/login field with the `login` value
   - Fill the password field with the `password` value
   - Submit the form (click the submit button or press Enter)
   - Take a snapshot and confirm the redirect back to (or near) `<pageUrl>` succeeded
   - If login fails, stop and report the error to the user

4. After successful login, navigate to `<pageUrl>` if not already there:
   ```
   playwright-cli goto <pageUrl>
   ```

> **Skip to Phase 3** if the user provided explicit test-case scenarios.

## Phase 2 — Systematic Discovery

Explore the page thoroughly. After each interaction take a snapshot to observe the result.

### 2a. Inventory all interactive elements

Use snapshot refs to identify and record:
- Buttons (including toggles, icon buttons, FABs)
- Input fields, textareas, checkboxes, radio groups, selects, date pickers
- Links and actions that stay on the origin page (tabs, accordions, in-page anchors)
- Links and actions that navigate away (detail pages, sub-pages) — record them as **flow endpoints**, interact once to confirm destination, then use `go-back` to return
- Menus, dropdowns, dialogs that open on interaction
- Tables or lists with sortable columns, pagination, or row actions

For each element note: ref, role/type, label/placeholder, and expected behavior.  
When an **input value** was provided by the user for a field, use that value when interacting with it.

### 2b. Interact with each element in isolation

For each discovered interactive element:
- Perform the primary action (click, fill, select, check/uncheck)
- Use the user-supplied value if one was provided for this field; otherwise use a sensible placeholder
- Take a snapshot immediately after
- Record what changed (new elements appeared, values updated, validation triggered, navigation occurred)
- If a **dialog/modal** opens: inspect its contents, record them, then close it before continuing
- If an action **navigates away from the origin page**: take a snapshot of the destination to confirm it loaded correctly, then use `go-back` to return — this navigation is the end of that flow's boundary, do not interact further with the destination

### 2c. Identify key user flows

Based on 2a and 2b, identify 2–5 meaningful end-to-end flows (e.g. "fill and submit a form", "sort a table column", "open detail and verify it loads", "open and close a dialog").

### 2d. Check for error / validation states

For form inputs, test at least one invalid or empty submission to observe validation feedback.

## Phase 3 — Generate the Test File

Write a **single Playwright TypeScript test file**. Do not read any local project files — derive all knowledge about the page exclusively from what was observed during Phase 1 and Phase 2.

### Mode A — Scenario-based (user provided scenarios)

Implement exactly the described test-case scenarios. Do not add extra tests beyond what was asked. Use user-supplied input values where relevant.

### Mode B — Discovery-based (no scenarios provided)

Use everything found in Phase 2. Include the mandatory test cases listed below when applicable.

### Test file rules

- `import { test, expect } from '@playwright/test';`
- Declare a `BASE_URL` constant at the top of the file, before anything else, reading from the `REQUEST_HOST_URL` environment variable with a default of `http://localhost:8888`:
  ```ts
  const BASE_URL = process.env['REQUEST_HOST_URL'] ?? 'http://localhost:8888';
  ```
- Use `BASE_URL` as the protocol/host/port prefix for every URL in the file — never hardcode a host or port
- Run tests in **headless mode** — add `test.use({ headless: true });` at the top of the file, before any `test.describe` blocks
- Credentials must **never be hardcoded** in the test file. Resolve them at runtime using a `getCredentials()` helper:
  1. If `TESTS_CREDENTIALS_LOGIN` and `TESTS_CREDENTIALS_PASSWORD` env vars are both set, use them
  2. Otherwise read `.playwright/.credentials` (key: value format) from the repository root
  3. If neither source provides both values, throw an error with a clear message
- Each test is independent — use a shared `navigate` helper (see structure below) that calls `page.goto()` followed by `await page.waitForLoadState('networkidle')` to ensure the SPA is fully settled before interacting
- Use **role-based locators** (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`) over CSS selectors
- Group related tests with `test.describe`
- Prefer `toBeVisible()`, `toHaveValue()`, `toContainText()`, `toHaveURL()` assertions
- Tests that navigate away must assert the destination loaded (`toHaveURL`, visible heading) and do not need to navigate back
- Keep tests deterministic — no `page.waitForTimeout`; use proper Playwright waiting
- Add `test.afterEach(async ({ page }) => { await page.close(); });` inside every `test.describe` block to close the browser window after each test case
- Add a JSDoc comment above each `test.describe` block describing the feature
- Name tests in plain English: `<user action> <expected outcome>`

### Structure

```ts
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env['REQUEST_HOST_URL'] ?? 'http://localhost:8888';
const PAGE_PATH = '<path>'; // e.g. /administracia/davky

test.use({ headless: true });

interface Credentials
{
    login: string;
    password: string;
}

function getCredentials(): Credentials
{
    const login = process.env['TESTS_CREDENTIALS_LOGIN'];
    const password = process.env['TESTS_CREDENTIALS_PASSWORD'];

    if(login && password)
    {
        return {login, password};
    }

    const credFile = path.resolve('.playwright/.credentials');

    if(fs.existsSync(credFile))
    {
        const lines = fs.readFileSync(credFile, 'utf-8').split('\n');
        const map: Record<string, string> = {};

        for(const line of lines)
        {
            const [key, ...rest] = line.split(':');

            if(key)
            {
                map[key.trim()] = rest.join(':').trim();
            }
        }

        if(map['login'] && map['password'])
        {
            return {login: map['login'], password: map['password']};
        }
    }

    throw new Error(
        'Credentials not found. Set TESTS_CREDENTIALS_LOGIN and TESTS_CREDENTIALS_PASSWORD env vars, ' +
        'or create .playwright/.credentials with login: and password: entries.'
    );
}

async function navigate(page: Page): Promise<void>
{
    await page.goto(`${BASE_URL}${PAGE_PATH}`);
    await page.waitForLoadState('networkidle');

    if(page.url().includes('/login'))
    {
        const {login, password} = getCredentials();
        await page.getByRole('textbox', { name: /login|username|meno/i }).fill(login);
        await page.getByRole('textbox', { name: /password|heslo/i }).fill(password);
        await page.getByRole('button', { name: /sign in|login|prihlásiť/i }).click();
        await page.waitForURL(new RegExp(PAGE_PATH.replace('/', '\\/')));
        await page.waitForLoadState('networkidle');
    }
}

/** <Feature description> */
test.describe('<Page Name> — <Feature>', () =>
{
    test.afterEach(async ({ page }) =>
    {
        await page.close();
    });

    test('<action> <expected outcome>', async ({ page }) =>
    {
        await navigate(page);
        // ...
    });
});
```

### Mandatory test cases (Mode B, when applicable)

1. **Page loads** — correct title and key heading/content is visible
2. **Form submission** — valid data submits successfully; invalid data shows validation errors
3. **Interactive controls** — each significant button/toggle/select produces the expected UI change
4. **Dialog/modal lifecycle** — opens, shows correct content, closes
5. **Navigation to sub-page** — clicking a link/row opens the destination page at the expected URL
6. **Table/list interactions** — sorting, filtering, pagination (one test per feature)

## Phase 4 — Output

1. Print the **complete test file** in a fenced TypeScript code block
2. Save the file to the output path (create if it does not exist)
3. Provide a brief summary table:

| Test | What it covers |
|------|----------------|
| ... | ... |

4. List any **skipped interactions** (e.g. external links, actions requiring authentication not available)

## Phase 5 — Run Tests

After saving the test file:

1. Close the browser opened during discovery:
   ```
   npx playwright-cli close
   ```
2. Run the test file once using the locally installed Playwright, passing the origin URL (protocol + host + port only, no path) as `REQUEST_HOST_URL`:
   ```
   $env:REQUEST_HOST_URL='<protocol://host:port>'; npx playwright test <outputPath> --reporter=list
   ```
   Derive `<protocol://host:port>` from the `<pageUrl>` used in Phase 1 (strip the path).
3. Show the full output to the user — pass/fail counts and any error messages.
4. **Stop immediately.** Do not analyse failures, do not edit the test file, do not rerun tests.

## Constraints

- **Always** run `npx playwright-cli` — never use a globally installed `playwright-cli`, an integrated browser tool, browser MCP, or any built-in browser capability
- **Always** run Playwright tests with `npx playwright test` — never use a global install
- **Never** use `page.waitForTimeout` — use proper Playwright waiting strategies
- Do not screenshot unless explicitly requested
- Do not open additional browser tabs
- When navigating away during discovery, always `go-back` before continuing the inventory
- A destination page reached by navigation is a **flow endpoint** — snapshot it once to verify, do not explore it further

