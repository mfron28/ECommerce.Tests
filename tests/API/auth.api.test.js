const { test, expect } = require('@playwright/test');
const testData = require('../../utils/TestData.json');
const { validUser, wrongPasswordUser, invalidUser } = testData;
const { test, expect } = require('../../fixtures/test-fixtures');

const apiBase =
  process.env.API_BASE_URL ||
  process.env.PLAYWRIGHT_API_BASE_URL ||
  'http://127.0.0.1:5050';

test.describe('Auth API', () => {
  test('GET /api/health returns ok', async ({ request }) => {
    const res = await request.get(`${apiBase}/api/health`);
    expect(res.ok()).toBeTruthy();
    await expect(res.json()).resolves.toEqual({ status: 'ok' });
  });

  test('POST /api/login with valid user returns token', async ({ request }) => {
    const res = await request.post(`${apiBase}/api/login`, {
      data: { email: validUser.email, password: validUser.password },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.token).toBeTruthy();
    expect(body.user?.email).toBe(validUser.email);
  });

  test('POST /api/login with unknown email returns 401', async ({ request }) => {
    const res = await request.post(`${apiBase}/api/login`, {
      data: { email: invalidUser.email, password: invalidUser.password },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toMatch(/invalid email or password/i);
  });

  test('POST /api/login with wrong password returns 401', async ({ request }) => {
    const res = await request.post(`${apiBase}/api/login`, {
      data: {
        email: wrongPasswordUser.email,
        password: wrongPasswordUser.password,
      },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toMatch(/wrong password/i);
  });
});
