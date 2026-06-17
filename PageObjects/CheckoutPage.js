class Checkout {
  constructor(page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
    this.fullName = this.main.locator('.form-group').filter({ hasText: 'Full name' }).getByRole('textbox');
    this.addressLine1 = this.main.locator('.form-group').filter({ hasText: 'Address line 1' }).getByRole('textbox');
    this.addressLine2 = this.main.locator('.form-group').filter({ hasText: 'Address line 2' }).getByRole('textbox');
    this.city = this.main.locator('.form-group').filter({ hasText: 'City' }).getByRole('textbox');
    this.state = this.main.locator('.form-group').filter({ hasText: 'State / region' }).getByRole('textbox');
    this.postalCode = this.main.locator('.form-group').filter({ hasText: 'Postal code' }).getByRole('textbox');
    this.countryInput = this.main.locator('.form-group').filter({ hasText: 'Country' }).getByRole('textbox');
    this.shippingZone = this.main.locator('.form-group').filter({ hasText: 'Shipping zone' }).getByRole('combobox');
    this.couponInput = page.getByPlaceholder('SAVE10, FLAT5…');
    this.applyBtn = page.getByRole('button', { name: 'Apply' });
  }

  async gotoCheckoutPage() {
    await this.page.goto('/checkout');
  }
  lineItem(productName) {
    return this.main.locator('li').filter({ hasText: productName });
  }

  async placeAnOrder() {
    await this.placeOrderButton.click();
  }

  async fillCheckoutPage({
    fullName,
    address1,
    address2 = '',
    cityPlace,
    region,
    code,
    country,
    shipping = 'EU',
    coupon,
  }) {
    await this.fullName.fill(fullName);
    await this.addressLine1.fill(address1);
    await this.addressLine2.fill(address2);
    await this.city.fill(cityPlace);
    await this.state.fill(region);
    await this.postalCode.fill(code);
    await this.countryInput.fill(country);
    await this.shippingZone.selectOption(shipping);
    if (coupon) {
      await this.couponInput.fill(coupon);
      await this.applyBtn.click();
    }
    await this.placeAnOrder();
  }
}

module.exports = { Checkout };