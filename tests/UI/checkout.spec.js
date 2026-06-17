const { test, expect } = require('../../fixtures/test-fixtures');

test('User go to checkout page', async ({ loggedIn, page }) => {
  const productsPage = loggedIn.getProductsPage();
  const checkoutPage = loggedIn.getCheckoutPage();

  await productsPage.gotoProductsListing();
  await productsPage.searchProduct('Cotton T-Shirt');
  await productsPage.selectProduct('Cotton T-Shirt');
  await productsPage.addProductToCart();

  const cartPage = loggedIn.getCartPage();
  await productsPage.goToCartPage();
  await cartPage.changeNumberOfProducts('Cotton T-Shirt', '2');

  await cartPage.goToCheckoutFromCartPage();
  await expect(page.getByRole('heading', { name: 'Checkout', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shipping address' })).toBeVisible();

  await checkoutPage.fillCheckoutPage({
    fullName: 'Ion Ion',
    address1: 'Mihail Sadoveanu',
    cityPlace: 'Iasi',
    region: 'Iasi',
    code: '02101',
    country: 'Romania',
    shipping: 'EU',
    coupon: 'SAVE10',
  });

  await expect(page).toHaveURL(/\/orders\//);
});
