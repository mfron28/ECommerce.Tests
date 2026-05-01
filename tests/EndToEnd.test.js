const { test } = require('@playwright/test');
const { POManager } = require('../PageObjects/POManager');


test('Register',async ({page})=>{
  const poManager = new POManager(page);
  const registerPage = poManager.getRegisterPage();
  await registerPage.goToRegisterPage();
  await registerPage.createAccountValidation('fronmadalina@gmail.com', 'Madalina9!');
});

test('Ecommerce App', async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin('fronmadalina@gmail.com', 'Madalina9!');

  await poManager.getCartPage().emptyCart();

  const productsPage = poManager.getProductsPage();

  await productsPage.gotoProductsListing();
  await productsPage.searchProduct('Wallet');
  await productsPage.selectProduct();
  await productsPage.addProductToCart();

  await productsPage.gotoProductsListing();
  await productsPage.clearSearch();
  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToCart();

  await productsPage.goToCartPage();
  if (new URL(page.url()).pathname.includes('/login')) {
    await loginPage.validateLogin('fronmadalina@gmail.com', 'Madalina9!');
    await productsPage.goToCartPage();
  }

  const cartPage = poManager.getCartPage();
  await cartPage.changeNumberOfProducts();
  await cartPage.goToCheckoutFromCartPage();

  const checkoutPage = poManager.getCheckoutPage();
  await checkoutPage.placeAnOrder();
});
