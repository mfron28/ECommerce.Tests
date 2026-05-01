const REMOVE_NAME = /^(Remove|Delete)$/i;

class CartPage {
  constructor(page) {
    this.page = page;
    this.checkout = page.getByRole('link', { name: 'Checkout' });
  }

  async emptyCart() {
    await this.page.goto('/cart');
    const remove = this.page.getByRole('button', { name: REMOVE_NAME });
    for (let i = 0; i < 100; i++) {
      if ((await remove.count()) === 0) break;
      await remove.first().click();
    }
  }

  async changeNumberOfProducts() {
    const line = this.page
      .getByRole('main')
      .locator('article, li, tr')
      .filter({ hasText: /Leather Wallet/i })
      .first();
    await line.waitFor({ state: 'visible', timeout: 30000 });
    const qty = line
      .getByRole('spinbutton')
      .or(line.locator('input[type="number"]'))
      .first();
    await qty.fill('2');
    await qty.press('Enter');
  }

  async goToCheckoutFromCartPage() {
    await this.checkout.click();
  }
}

module.exports = { CartPage };
