// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120_000,
  expect: { timeout: 15_000 },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  projects: [
    {
      name: 'ui',
      testDir: './tests/UI',
      use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
        browserName: 'chromium',
        headless: true,
        screenshot: 'on',
        trace: 'on',
      },
    },
    {
      name: 'api',
      testDir: './tests/API',
    },
  ],
});
