class RegisterPage {
  constructor(page) {
    this.page = page;
    const main = page.getByRole('main');
    this.registeredEmail = main.locator('#reg-email');
    this.registeredPassword = main.locator('#reg-password');
    this.createAccount = main.getByRole('button', { name: 'Create account' });
    this.loginButton = main.getByRole('link', { name: 'Log in' });
  }

  async createAccountValidation(registeredEmail, registeredPassword) {
    await this.registeredEmail.fill(registeredEmail);
    await this.registeredPassword.fill(registeredPassword);
    await this.createAccount.click();
  }

  async goToLoginViaRegisterFormLink() {
    await this.loginButton.click();
  }

  async goToRegisterPage() {
    await this.page.goto('/register');
  }
}

module.exports = { RegisterPage };
