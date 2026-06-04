const { test, expect } = require('../../fixtures/test-fixtures');

const { email, password, newPassword } = require('../../utils/TestData.json').changeUserPassword;

test('User change password', async ({ poManager, page }) => {
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.validateLogin(email, password);

  const profile = poManager.getProfilePage();
  await profile.gotoProfile();
  await profile.changePassword(password, newPassword);
  await expect(page.getByText(/password updated/i)).toBeVisible();
});

test('Change email', async ({ page, poManager, users }) => {
  const { email: changeEmail, password: changePassword, newEmail } = users.changeUserEmail;
  const login = poManager.getLoginPage();
  await login.gotoLogin();
  await login.validateLogin(changeEmail, changePassword);

  const profile = poManager.getProfilePage();
  await profile.gotoProfile();
  await profile.changeUserEmail(newEmail);
  await expect(page.getByText(/verification link sent/i)).toBeVisible();
});
