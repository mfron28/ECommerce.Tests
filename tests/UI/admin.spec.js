const { test, expect } = require('../../fixtures/test-fixtures');

test('Admin adds a product', async ({ loggedInAdmin, page }) => {
  const adminPage = loggedInAdmin.getAdminPage();
  const adminProducts = loggedInAdmin.getAdminProductsPage();

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openProductsTab();
  await expect(page.getByRole('heading', { name: 'Add product' })).toBeVisible();

  const productName = `Test Product ${Date.now()}`;
  await adminProducts.addProduct({
    name: productName,
    description: 'Automated test product',
    price: 29.99,
    stock: 10,
    category: 'Electronics',
    imageUrls: 'https://picsum.photos/400/300',
    lowStock: 5,
  });

  await expect(page.getByRole('row', { name: new RegExp(productName) })).toBeVisible();
});

test('Admin edits a product',async({loggedInAdmin,page})=>{
  const adminPage=loggedInAdmin.getAdminPage();
  const adminProducts=loggedInAdmin.getAdminProductsPage();

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openProductsTab();
  await expect(page.getByRole('heading', { name: 'Add product' })).toBeVisible();

  await adminProducts.selectProductForEdit('Canvas Sneakers');
  await adminProducts.updateProduct();

  await expect(adminProducts.productRow('Canvas Sneakers').getByRole('cell').nth(2),).toHaveText('50');

});

test('Admin edits order status', async ({ loggedInAdmin, page, users }) => {
  const adminPage = loggedInAdmin.getAdminPage();
  const adminOrdersPage = loggedInAdmin.getAdminOrdersPage();
  const customerEmail = users.validUser.email;

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openOrdersTab();
  await expect(page.getByRole('columnheader', { name: 'Order' })).toBeVisible();

  await adminOrdersPage.updateOrderStatus(customerEmail, 'delivered', 'pending');
  await expect(adminOrdersPage.statusBadge(customerEmail, 'delivered')).toHaveText('delivered');
});

test('Admin adds a coupon', async ({ loggedInAdmin, page }) => {
  const adminPage = loggedInAdmin.getAdminPage();
  const adminCouponsPage = loggedInAdmin.getAdminCouponsPage();

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openCouponsTab();
  await expect(page.getByRole('heading', { name: 'Add coupon', level: 2 })).toBeVisible();

  const couponCode = `TEST${Date.now()}`;
  await adminCouponsPage.addCoupon({
    code: couponCode,
    type: 'percent',
    value: 15,
    minSubtotal: 25,
    expiresAt: adminCouponsPage.expiryOneYearFromNow(),
    active: true,
  });

  await expect(adminCouponsPage.couponRow(couponCode)).toBeVisible();
  await expect(adminCouponsPage.couponRow(couponCode).getByRole('cell').nth(2)).toHaveText('15%');
});

test('Admin deletes a coupon', async ({ loggedInAdmin, page }) => {
  const adminPage = loggedInAdmin.getAdminPage();
  const adminCouponsPage = loggedInAdmin.getAdminCouponsPage();

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openCouponsTab();
  await expect(page.getByRole('heading', { name: 'Add coupon', level: 2 })).toBeVisible();

  await adminCouponsPage.deleteCoupon();
});

test('Admin edits a coupon', async ({ loggedInAdmin, page }) => {
  const adminPage = loggedInAdmin.getAdminPage();
  const adminCouponsPage = loggedInAdmin.getAdminCouponsPage();

  await adminPage.goToAdminPage();
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();

  await adminPage.openCouponsTab();
  await expect(page.getByRole('heading', { name: 'Add coupon', level: 2 })).toBeVisible();

  await adminCouponsPage.editCoupon('SAVE10', {
    code: 'SAVE10',
    type: 'percent',
    value: 20,
    minSubtotal: 30,
    expiresAt: '2027-06-11',
    active: true,
  });

  await expect(adminCouponsPage.couponRow('SAVE10').getByRole('cell').nth(2)).toHaveText('20%');
});
