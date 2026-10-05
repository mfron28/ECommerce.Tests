// @ts-check
import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

// Secrets such as ADMIN_PASSWORD live in a git-ignored .env locally; CI sets them as repo secrets.
if (fs.existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  timeout: 120_000,
  expect: { timeout: 15_000 },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One worker avoids cart/wishlist/stock clashes when tests share the same DB user.
  workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : 1,
  reporter: 'html',
  projects: [
    {
      name: 'ui',
      testDir: './tests/UI',
      use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://e-commerce-sigma-five-58.vercel.app',
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
