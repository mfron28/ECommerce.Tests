const { test, expect } = require('../../fixtures/test-fixtures');

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

test('Forgot Password', async ({ poManager, users }) => {
  const { email } = users.forgotPassword;
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.goToForgotPasswordPage();

  const forgotPassword = poManager.getForgotPasswordPage();
  await forgotPassword.sendResetLink(email);
});
