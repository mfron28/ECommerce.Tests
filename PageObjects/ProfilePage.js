class ProfilePage {
  constructor(page) {
    this.page = page;
    const main = page.getByRole('main');
    const passwordForm = main.locator('section').filter({
      has: page.getByRole('heading', { name: 'Change password' }),
    });
    this.currentPassword = passwordForm.getByRole('textbox').first();
    this.newPassword = passwordForm.getByRole('textbox').nth(1);
    this.updatePasswordBtn = passwordForm.getByRole('button', { name: 'Update password' });
    const emailForm = main.locator('section').filter({
      has: page.getByRole('heading', { name: 'Change email' }),
    });
    this.newEmail = emailForm.getByRole('textbox');
    this.sendVerificationButton = main.getByRole('button', { name: 'Send verification' });
    this.forgotPassword = main.getByRole('link', { name: 'Forgot password?' });
  }

  async gotoProfile() {
    await this.page.goto('/profile');
    await this.page.waitForURL(/\/profile/, { timeout: 20_000 });
    await this.page.getByRole('heading', { name: 'Profile', level: 1 }).waitFor();
  }

  async changePassword(currentUserPass, newUserPass) {
    await this.currentPassword.fill(currentUserPass);
    await this.newPassword.fill(newUserPass);
    await this.updatePasswordBtn.click();
  }

  async changeUserEmail(newUserEmail) {
    await this.newEmail.fill(newUserEmail);
    await this.sendVerificationButton.click();
  }

  async userForgotPassword() {
    await this.forgotPassword.click();
    await this.page.waitForURL(/\/forgot-password/, { timeout: 20_000 });
    await this.page.getByRole('heading', { name: 'Forgot Password', level: 1 }).waitFor();
  }
}

module.exports = { ProfilePage };
