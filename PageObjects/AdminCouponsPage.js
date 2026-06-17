class AdminCouponsPage {
  constructor(page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.couponForm = this.main.locator('form').filter({has: page.getByRole('heading', { name: /Add coupon|Edit coupon/ })});
    this.addCouponHeading = this.main.getByRole('heading', { name: 'Add coupon', level: 2 });
    this.editCouponHeading = this.main.getByRole('heading', { name: 'Edit coupon', level: 2 });
    this.codeInput = this.couponForm.getByPlaceholder('SAVE10');
    this.typeSelect = this.couponForm.locator('.form-group').filter({ hasText: 'Type' }).getByRole('combobox');
    this.valueInput = this.couponForm.locator('.form-group').filter({ hasText: 'Value' }).getByRole('spinbutton');
    this.minSubtotalInput = this.couponForm.locator('.form-group').filter({ hasText: 'Min subtotal' }).getByRole('spinbutton');
    this.expiresInput = this.couponForm.locator('input[type="date"]');
    this.activeSelect = this.couponForm.getByRole('combobox').nth(1);
    this.createBtn = this.couponForm.getByRole('button', { name: 'Create coupon' });
    this.updateBtn = this.couponForm.getByRole('button', { name: 'Update coupon' });
    this.cancelBtn = this.couponForm.getByRole('button', { name: 'Cancel' });
  }

  couponRow(code) {
    return this.main.locator('tbody').getByRole('row').filter({ hasText: code }).first();
  }

  couponRowByPrefix(prefix = 'TEST') {
    return this.main.locator('tbody').getByRole('row').filter({ hasText: new RegExp(`^${prefix}`) }).first();
  }

  expiryOneYearFromNow() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().slice(0, 10);
  }

  async fillCouponForm({ code, type, value, minSubtotal, expiresAt, active = true }) {
    await this.codeInput.fill(code);
    await this.typeSelect.selectOption(
      type === 'percent' ? { label: 'Percent off' } : { label: 'Fixed amount' },
    );
    await this.valueInput.fill(String(value));
    await this.minSubtotalInput.fill(String(minSubtotal));
    if (expiresAt) {
      await this.expiresInput.fill(expiresAt);
    }
    if (!active) {
      await this.activeSelect.selectOption('Inactive');
    }
  }

  async addCoupon(fields) {
    await this.addCouponHeading.waitFor({ state: 'visible' });
    await this.fillCouponForm(fields);
    await this.createBtn.click();
    await this.couponRow(fields.code).waitFor({ state: 'visible' });
  }

  async selectCouponForEdit(code) {
    await this.couponRow(code).getByRole('button', { name: 'Edit' }).click();
    await this.editCouponHeading.waitFor({ state: 'visible' });
  }

  async updateCoupon(fields) {
    await this.fillCouponForm(fields);
    await this.updateBtn.click();
  }

  async toggleCouponActive(code) {
    await this.couponRow(code).getByRole('checkbox').click();
  }

  async deleteCoupon(code) {
    this.page.once('dialog', (dialog) => dialog.accept());
    const row = code ? this.couponRow(code) : this.couponRowByPrefix();
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  async editCoupon(code,fields){
    await this.selectCouponForEdit(code);
    await this.fillCouponForm(fields);
    await this.updateBtn.click();
  }
}

module.exports = { AdminCouponsPage };
