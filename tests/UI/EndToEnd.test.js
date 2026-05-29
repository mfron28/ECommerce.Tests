const { test, expect } = require('../../fixtures/test-fixtures');

// --- Authentication ---
test('Register', async ({ poManager, users }) => {
  const registerPage = poManager.getRegisterPage();
  await registerPage.goToRegisterPage();
  await registerPage.createAccountValidation(users.newUser.email, users.newUser.password);
});

test('Invalid email or password', async ({ poManager, page, users }) => {
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.submitCredentials(users.invalidUser.email, users.invalidUser.password);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
});

test('Wrong password', async ({ poManager, page, users }) => {
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.submitCredentials(
    users.wrongPasswordUser.email,
    users.wrongPasswordUser.password,
  );
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/wrong password/i)).toBeVisible();
});

test('Email already registered', async ({ poManager, page, users }) => {
  const registerPage = poManager.getRegisterPage();
  await registerPage.goToRegisterPage();
  await registerPage.createAccountValidation(
    users.registeredUser.email,
    users.registeredUser.password,
  );
  await expect(page.getByText(/Email already registered/i)).toBeVisible();
});

test('Logout', async ({ loggedIn }) => {
  await loggedIn.getNavBar().logoutFromApp();
});


test.describe('Profile password', () => {
  test.describe.configure({ mode: 'serial' });

  const { email, password, newPassword } = require('../../utils/TestData.json').changeUserPassword;

  test.beforeEach(async ({ poManager, page }) => {
    const login = poManager.getLoginPage();
    await login.gotoLogin();
    await login.validateLogin(email, password); // ensures DB starts at Password123!
  });

  test.afterEach(async ({ poManager, page }) => {
    const login = poManager.getLoginPage();
    await login.gotoLogin();
    await login.submitCredentials(email, newPassword);
    if (!page.url().includes('/login')) {
      const profile = poManager.getProfilePage();
      await profile.gotoProfile();
      await profile.changePassword(newPassword, password);
    }
  });

  test('User change password', async ({ poManager, page }) => {
    const profile = poManager.getProfilePage();
    await profile.gotoProfile();
    await profile.changePassword(password, newPassword);
    await expect(page.getByText(/password updated/i)).toBeVisible();
  });
});

test('Change email', async ({ page, poManager, users }) => {
  const { email, password, newEmail } = users.changeUserEmail;
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.validateLogin(email, password);

  const profile = poManager.getProfilePage();
  await profile.gotoProfile();
  await profile.changeUserEmail(newEmail);
  await expect(page.getByText(/verification link sent/i)).toBeVisible();
});

test('Forgot Password',async({poManager,users})=>{
  const {email}=users.forgotPassword;
  const login=poManager.getLoginPage();
  await login.gotoLogin();
  await login.goToForgotPasswordPage();

  const forgotPassword=poManager.getForgotPasswordPage();
  await forgotPassword.sendResetLink(email);
});


// --- Products / catalog ---
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

//---Wishlist----
test('Add to Wishlist',async ({loggedIn, page})=>{
  const productsPage = loggedIn.getProductsPage();
  await productsPage.gotoProductsListing();
  await productsPage.openRandomProductFromListing();
  await productsPage.addProductToWishlist();
  await expect(page.getByRole('main')).toContainText(/in wishlist/i);
});

// --- Cart ---
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

// --- Full journey (login → shop → cart → checkout) ---
test('E2E Test for Ecommerce App', async ({ loggedIn, page, users }) => {
  await loggedIn.getCartPage().emptyCart();

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
