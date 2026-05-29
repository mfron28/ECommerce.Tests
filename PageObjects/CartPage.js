const REMOVE_NAME = /^(Remove|Delete)$/i;
const { test, expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.checkout = page.getByRole('link', { name: 'Checkout' });
  }

  async emptyCart() {
    await this.page.goto('/cart');
    await this.page.getByRole('heading', { name: 'Cart' }).waitFor();
    
    const remove = this.page.getByRole('button', { name: REMOVE_NAME });
    while ((await remove.count()) > 0) {
      const before = await remove.count();
      await remove.first().click();
      await expect(remove).toHaveCount(before - 1, { timeout: 10_000 });
    }
  }
 
  async changeNumberOfProducts(productName, noOfProducts) {
    const line = this.page
      .getByRole('listitem')
      .filter({ hasText: productName })
      .first();
    await line.waitFor({ state: 'visible', timeout: 30_000 });
    const qty = line
      .getByRole('spinbutton')
      .or(line.locator('input[type="number"]'))
      .first();
    await qty.fill(String(noOfProducts));
    await qty.press('Enter');
  }

  async goToCheckoutFromCartPage() {
    await this.checkout.click();
  }
}

module.exports = { CartPage };
