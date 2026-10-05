# E-commerce App Tests

End-to-end UI and API tests for the E-commerce app, written with [Playwright](https://playwright.dev/).

The tests run against the hosted app:

| Part | URL |
|---|---|
| Frontend (Vercel) | https://e-commerce-sigma-five-58.vercel.app |
| API (Render) | https://ecommerce-api-gvba.onrender.com |

## Setup

Requires [Node.js](https://nodejs.org/) (LTS or newer).

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Open `.env` and set `ADMIN_PASSWORD` to the admin account's password. Ask the project owner for it. `.env` is git-ignored: never commit it or put the password anywhere else in the repo. Without it, the admin tests fail with `ADMIN_PASSWORD is not set` and every other test still runs.

## Running the tests

| Command | What it runs |
|---|---|
| `npm test` | All tests (UI + API) |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:ui-mode` | Playwright's interactive UI mode |

Run a single file or test:

```bash
npx playwright test tests/UI/cart.spec.js
npx playwright test -g "Admin adds a coupon"
```

Open the HTML report from the last run:

```bash
npx playwright show-report
```

Every UI test records a screenshot and a trace, which you can open from the report.

> **Note:** The API is on Render's free tier, which goes to sleep when idle. The first request can take up to a minute. If the first tests time out, open https://ecommerce-api-gvba.onrender.com/api/health and wait for `{"status":"ok"}`, then run the tests again.

## Project structure

```
├── tests/
│   ├── UI/              # Browser tests: auth, products, cart, checkout, wishlist, profile, admin
│   └── API/             # API tests: health check and login
├── PageObjects/         # Page Object Model, one class per page (+ POManager to access them)
├── fixtures/
│   └── test-fixtures.js # Custom fixtures: poManager, users, loggedIn, loggedInAdmin
├── utils/
│   ├── TestData.json    # Test users and form data (no admin password)
│   ├── testData.js      # TestData.json + admin credentials from the environment
│   └── testCleanup.js   # Resets test users' cart, wishlist and password before each test
├── playwright.config.js # Projects (ui, api), base URL, timeouts, retries
└── .github/workflows/   # CI pipeline
```

### Writing a test

Import `test` and `expect` from the custom fixtures, not straight from `@playwright/test`:

```js
const { test, expect } = require('../../fixtures/test-fixtures');

test('Example', async ({ loggedIn, page }) => {
  // loggedIn is a POManager with the default test user already logged in
  const products = loggedIn.getProductsPage();
  // ...
});
```

Available fixtures:

- `poManager`: access to all page objects
- `users`: the test data from `utils/testData.js`
- `loggedIn`: logs in as the regular test user and returns the `poManager`
- `loggedInAdmin`: logs in as the admin user and returns the `poManager`

Before every test, an automatic fixture resets the test users through the API: it clears their cart and wishlist and restores their original password. This keeps tests independent of each other.

## Configuration

The tests use the hosted URLs above by default. You can override them with environment variables:

| Variable | Default |
|---|---|
| `PLAYWRIGHT_BASE_URL` | https://e-commerce-sigma-five-58.vercel.app |
| `API_BASE_URL` | https://ecommerce-api-gvba.onrender.com |
| `PW_WORKERS` | `1` |
| `ADMIN_PASSWORD` | none, required for admin tests (secret) |
| `ADMIN_EMAIL` | `adminUser.email` from `TestData.json` |

Variables in `.env` are loaded automatically. Variables already set in your shell or in CI take priority.

Tests run on one worker by default, because they share the same test users and would interfere with each other's cart, wishlist and stock if run in parallel.

## CI

[GitHub Actions](.github/workflows/playwright.yml) runs the full suite:

- on every push and pull request to `main`
- every day at 06:00 UTC
- manually, from the **Run workflow** button in the Actions tab

Before testing, the pipeline wakes up the Render API. After each run (except on pull requests), it publishes the HTML report to GitHub Pages. The report is also saved as a `playwright-report` artifact for 30 days.

The URLs can be set as repository variables (`PLAYWRIGHT_BASE_URL`, `API_BASE_URL`) under **Settings → Secrets and variables → Actions → Variables**.

The admin password must be set as a repository **secret** named `ADMIN_PASSWORD`, under **Settings → Secrets and variables → Actions → Secrets**. GitHub hides secrets in logs, and pull requests from forks can't read them.
