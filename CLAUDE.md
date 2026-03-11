# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (clears reports first)
npm test

# Run a single test file
npx playwright test tests/login.spec.ts

# Run a single test by name
npx playwright test -g "Login with invalid credentials"

# Run tests with UI mode
npx playwright test --ui

# Run tests headed (visible browser)
npx playwright test --headed

# View HTML report after test run
npx playwright show-report

# List all tests without running them
npx playwright test --list
```

## Architecture

This is a Playwright test suite for [SauceDemo](https://www.saucedemo.com/) using the **Page Object Model (POM)** pattern.

### Structure

- `pages/` — Page Object classes. Each class encapsulates locators and actions for a specific page/component. All public methods use `test.step()` for named steps in reports.
- `tests/` — Test specs that import and compose page objects.
- `fixtures/users.json` — Test data for user credentials, with `expectedResult` field indicating success/error.

### Page Objects

- `LoginPage` — Login form interactions and error validations
- `InventoryPage` — Product listing, sorting, and item visibility assertions
- `Navigation` — Wrapper around `page.goto()` for URL navigation

### Key conventions

- Locators use `data-test` attributes via `getByTestId()` (configured as `testIdAttribute: 'data-test'` in config)
- `baseURL` is `https://www.saucedemo.com/` — pass relative paths (e.g., `""` for root, `"inventory.html"` for inventory)
- Tests are split into `[WEB]` and `[MOBILE]` describe blocks; mobile tests create a custom browser context with `{ width: 375, height: 660 }`
- Test data is driven from `fixtures/users.json` using `Object.values(users).forEach()`

### Config highlights (`playwright.config.ts`)

- Active browser: Chromium only (Firefox/WebKit/mobile projects are commented out)
- 3 parallel workers locally, 1 on CI; retries only on CI
- Artifacts: HTML reporter, screenshots on failure, video always on, traces on first retry
