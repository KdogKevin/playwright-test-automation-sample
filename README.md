# Playwright Test Automation Sample

[![Tests](https://github.com/KdogKevin/playwright-test-automation-sample/actions/workflows/tests.yml/badge.svg)](https://github.com/KdogKevin/playwright-test-automation-sample/actions/workflows/tests.yml)

A sample test suite showing how I set up test automation for a client: UI tests, API tests, and a CI pipeline that runs them on every pull request.

It runs against two public practice targets built for testing, not client systems:

- **UI:** [Sauce Demo](https://www.saucedemo.com), a demo online shop
- **API:** [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html), a demo hotel-booking API

By Kevin Nguyen, test automation and QA consulting · hello@kcnguyen.com

## What's covered

| Area | Tests |
| --- | --- |
| Login | Valid login, wrong password, locked-out account, protected pages need a login |
| Cart | Badge count as items are added and removed, cart survives a reload, sorting by price and by name |
| Checkout | Full purchase of two items, subtotal matches item prices, required-field validation |
| Booking API | Create and read, update with a token, update refused without one, delete, bad credentials |
| Known defect | A missing required field returns 500 instead of 400, kept as a living bug report |

## How it's built

```
src/
  pages/        Page objects: one class per screen, so selectors live in one place
  api/          A small typed client for the booking API
  data/         Test data and the practice sites' published demo accounts
  fixtures.ts   Shared setup, such as a shopper who is already logged in
tests/
  ui/           Browser tests (Chromium)
  api/          API tests (no browser needed)
.github/workflows/tests.yml   CI: type check, then UI and API suites in parallel
```

Choices worth noting:

- **Stable selectors.** Tests find elements by `data-test` attributes, not CSS classes or text that designers change.
- **Independent tests.** Each test sets up its own data, so they run in parallel and in any order.
- **Failures you can debug.** Failed tests keep a trace, screenshot, and video, uploaded with the HTML report.
- **Known bugs stay visible.** The API defect uses `test.fail()`. CI stays green while the bug exists and turns red when it's fixed, so the test gets updated.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm test            # everything
npm run test:ui     # browser tests only
npm run test:api    # API tests only
npm run report      # open the HTML report
```

To point the suites at another environment, set `UI_BASE_URL` or `API_BASE_URL`.

## In your project

The same structure drops into an existing repo: the page objects and fixtures map to your screens, the API client to your endpoints, and the workflow to GitHub Actions, GitLab CI, or Jenkins. Want this for your product? Email hello@kcnguyen.com.
