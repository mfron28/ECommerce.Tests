const { test, expect } = require('../../fixtures/test-fixtures');

test('Add to Wishlist', async ({ loggedIn, page }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToWishlist();
  await expect(page.getByRole('main')).toContainText(/in wishlist/i);
});

test('Remove from wishlist', async ({ page, loggedIn }) => {
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.selectProduct('Denim Jeans');
  await productsPage.addProductToWishlist();

  await loggedIn.getNavBar().goToWishlistPage();
  await expect(page).toHaveURL(/\/wishlist/);

  const wishlistPage = loggedIn.getWishlistPage();
  await wishlistPage.removeProductFromWishlist('Denim Jeans');
});
