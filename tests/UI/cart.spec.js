const { test, expect } = require('../../fixtures/test-fixtures');

test('Empty cart', async ({ loggedIn, page }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });

  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToCart();

  await loggedIn.getCartPage().emptyCart();
  await expect(page.getByRole('main')).toContainText(/cart is empty/i);
  await page.getByRole('link', { name: 'Browse products' }).click();
});

test('Change number of products from Cart Page', async ({ loggedIn, page }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });
  await productsPage.searchProduct('Running Shoes');
  await productsPage.selectProduct('Running Shoes');
  await productsPage.addProductToCart();

  const cartPage = loggedIn.getCartPage();
  await productsPage.goToCartPage();
  await expect(page.getByRole('main')).not.toContainText(/cart is empty/i);
  await expect(page.getByRole('main').getByText('Running Shoes')).toBeVisible();
  await cartPage.changeNumberOfProducts('Running Shoes', '2');
});

test('E2E Test for Ecommerce App', async ({ loggedIn, page, users }) => {
  const productsPage = loggedIn.getProductsPage();
  const loginPage = loggedIn.getLoginPage();

  await productsPage.gotoProductsListing();
  await productsPage.searchProduct('Cotton');
  await productsPage.selectProduct('Cotton T-Shirt');
  await productsPage.addProductToCart();

  await productsPage.gotoProductsListing();
  await productsPage.clearSearch();
  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToCart();

  await productsPage.goToCartPage();
  if (new URL(page.url()).pathname.includes('/login')) {
    await loginPage.validateLogin(users.validUser.email, users.validUser.password);
    await productsPage.goToCartPage();
  }

  const cartPage = loggedIn.getCartPage();
  await cartPage.changeNumberOfProducts('Cotton T-Shirt', '2');
  await cartPage.goToCheckoutFromCartPage();

  await loggedIn.getCheckoutPage().placeAnOrder();
});
