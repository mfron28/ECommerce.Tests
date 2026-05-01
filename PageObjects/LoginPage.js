class LoginPage {
  constructor(page) {
    this.page = page;
    const main = page.getByRole('main');
    this.email = main.locator('#login-email');
    this.password = main.locator('#login-password');
    this.signIn = main.getByRole('button', { name: 'Sign in' });
    this.createAccount = main.getByRole('link', { name: 'Create an account' });
  }

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async validateLogin(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await Promise.all([
      this.page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20_000 }),
      this.signIn.click(),
    ]);
  }

  async createAnAccount() {
    await this.createAccount.click();
  }
}

module.exports = { LoginPage };
