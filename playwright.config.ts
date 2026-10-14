import { defineConfig, devices, type Project } from '@playwright/test';

const isCI = !!process.env.CI;

/** The same UI suite, run once per browser or device. */
function uiProject(name: string, device: (typeof devices)[string]): Project {
  return {
    name,
    testDir: './tests/ui',
    use: {
      ...device,
      baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
      testIdAttribute: 'data-test',
    },
  };
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    uiProject('chromium', devices['Desktop Chrome']),
    uiProject('firefox', devices['Desktop Firefox']),
    uiProject('webkit', devices['Desktop Safari']),
    uiProject('mobile', devices['Pixel 7']),
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
