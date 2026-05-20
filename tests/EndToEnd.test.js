const { test, expect } = require('@playwright/test');
const { POManager } = require('../PageObjects/POManager');
const testData = require('../utils/TestData.json');
const { validUser, wrongPasswordUser,registeredUser,newUser, invalidUser } = testData;


test('Register',async ({page})=>{
  const poManager = new POManager(page);
  const registerPage = poManager.getRegisterPage();
  await registerPage.goToRegisterPage();
  await registerPage.createAccountValidation(newUser.email,newUser.password);
});

test('E2E Test for Ecommerce App', async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin(validUser.email, validUser.password);

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
    await loginPage.validateLogin(validUser.email, validUser.password);
    await productsPage.goToCartPage();
  }

  const cartPage = poManager.getCartPage();
  await cartPage.changeNumberOfProducts('Leather Wallet');
  await cartPage.goToCheckoutFromCartPage();

  const checkoutPage = poManager.getCheckoutPage();
  await checkoutPage.placeAnOrder();
});

test('Invalid email or password', async ({ page }) => {
  const poManager = new POManager(page);
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.submitCredentials(invalidUser.email, invalidUser.password);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
});

test('Wrong password', async ({ page }) => {
  const poManager = new POManager(page);
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.submitCredentials(wrongPasswordUser.email, wrongPasswordUser.password);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/wrong password/i)).toBeVisible();
});

test('Email already registered', async({page})=>{
  const poManager=new POManager(page);
  const registerPage=poManager.getRegisterPage();
  await registerPage.goToRegisterPage();
  await registerPage.createAccountValidation(registeredUser.email, registeredUser.password);
  await expect(page.getByText(/Email already registered/i)).toBeVisible();
});

test('Logout',async({page})=>{
  const poManager=new POManager(page);
  const login=poManager.getLoginPage();
  await login.gotoLogin();
  await login.validateLogin(validUser.email, validUser.password);

  const logout=poManager.getNavBar();
  await logout.logoutFromApp();
});

test('Search product by price', async({page})=>{
  const poManager=new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin(validUser.email, validUser.password);

  const productsPage = poManager.getProductsPage();
  await productsPage.searchProductByPrice(10,55);
});

test('Search by category', async({page})=>{
  const poManager=new POManager(page);
  const loginPage=poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin(validUser.email, validUser.password);

  const productsPage=poManager.getProductsPage();
  await productsPage.selectCategory('Accessories');
});

test('Out of stock product', async({page})=>{
  const poManager=new POManager(page);
  const loginPage=poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin(validUser.email, validUser.password);

  const productsPage=poManager.getProductsPage();
  await productsPage.selectOutOfStockProduct('Mechanical Keyboard');

});

test('Empty cart', async({page})=>{
  const poManager=new POManager(page);
  const loginPage=poManager.getLoginPage();
  await loginPage.gotoLogin();
  await loginPage.validateLogin(validUser.email, validUser.password);
 
  const productsPage=poManager.getProductsPage();
  await productsPage.gotoProductsListing();
  await page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });

  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToCart();

  const cartPage=poManager.getCartPage();
  await cartPage.emptyCart();
  await expect(page.getByRole('main')).toContainText(/cart is empty/i);
  await page.getByRole('link', { name: 'Browse products' }).click();
});