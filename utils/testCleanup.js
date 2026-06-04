const testData = require('./TestData.json');

const apiBase =
  process.env.API_BASE_URL ||
  process.env.PLAYWRIGHT_API_BASE_URL ||
  'http://127.0.0.1:5050';

async function loginAndGetHeaders(request, email, password) {
  const loginRes = await request.post(`${apiBase}/api/login`, {
    data: { email, password },
  });
  if (!loginRes.ok()) {
    return null;
  }
  const { token } = await loginRes.json();
  return { Authorization: `Bearer ${token}` };
}

async function resetUserCartAndWishlist(request, email, password) {
  const headers = await loginAndGetHeaders(request, email, password);
  if (!headers) {
    return false;
  }

  const cartRes = await request.get(`${apiBase}/api/cart`, { headers });
  if (cartRes.ok()) {
    const cart = await cartRes.json();
    for (const item of cart.items || []) {
      await request.delete(`${apiBase}/api/cart/${item.productId}`, { headers });
    }
  }

  const wishRes = await request.get(`${apiBase}/api/wishlist`, { headers });
  if (wishRes.ok()) {
    const wish = await wishRes.json();
    for (const product of wish.products || []) {
      await request.delete(`${apiBase}/api/wishlist/${product.id}`, { headers });
    }
  }

  return true;
}

/** Ensures profile test user password is the expected original (not left on newPassword). */
async function ensureUserPassword(request, email, originalPassword, alternatePassword) {
  if (await loginAndGetHeaders(request, email, originalPassword)) {
    return;
  }
  const headers = await loginAndGetHeaders(request, email, alternatePassword);
  if (!headers) {
    return;
  }
  await request.patch(`${apiBase}/api/profile/password`, {
    headers,
    data: { currentPassword: alternatePassword, newPassword: originalPassword },
  });
}

function getUsersToReset() {
  const entries = [
    testData.validUser,
    testData.adminUser,
    testData.changeUserPassword,
    testData.changeUserEmail,
    testData.forgotPassword,
  ];

  const seen = new Set();
  const users = [];

  for (const entry of entries) {
    if (!entry?.email || !entry?.password || seen.has(entry.email)) {
      continue;
    }
    seen.add(entry.email);
    users.push({
      email: entry.email,
      password: entry.password,
      alternatePassword: entry.newPassword,
    });
  }

  return users;
}

/** Full reset for all shared test accounts (cart, wishlist, password). */
async function resetAllTestUsers(request) {
  const health = await request.get(`${apiBase}/api/health`);
  if (!health.ok()) {
    throw new Error(
      `API not reachable at ${apiBase}. Start backend (npm run dev) and MongoDB before tests.`,
    );
  }

  for (const user of getUsersToReset()) {
    if (user.alternatePassword) {
      await ensureUserPassword(
        request,
        user.email,
        user.password,
        user.alternatePassword,
      );
    }
    await resetUserCartAndWishlist(request, user.email, user.password);
  }
}

module.exports = { resetAllTestUsers };
