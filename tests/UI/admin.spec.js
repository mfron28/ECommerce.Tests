const { test, expect } = require('../../fixtures/test-fixtures');

test('Admin user adds a product', async ({ loggedInAdmin, page }) => {
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
