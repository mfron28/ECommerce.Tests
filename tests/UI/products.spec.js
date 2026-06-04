const { test } = require('../../fixtures/test-fixtures');

test('Search product by price', async ({ loggedIn }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.searchProductByPrice(10, 55);
});

test('Search by category', async ({ loggedIn }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.selectCategory('Accessories');
});

test('Out of stock product', async ({ loggedIn }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.selectOutOfStockProduct('Mechanical Keyboard');
});

test('Add review', async ({ loggedIn }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.submitReviewOnUnreviewedProduct(
    5,
    `Automated review ${Date.now()}`,
  );
});
