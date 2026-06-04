class AdminProductsPage {
  constructor(page) {
    this.page = page;
    const main = page.getByRole('main');
    this.productForm = main.locator('form').filter({
      has: page.getByRole('heading', { name: /Add product|Edit product/ }),
    });
    this.addNewProduct = main.getByRole('heading', { name: 'Add product' });
    this.editProduct = main.getByRole('heading', { name: 'Edit product' });
    this.createBtn = this.productForm.getByRole('button', { name: 'Create' });
    this.updateBtn = this.productForm.getByRole('button', { name: 'Update' });
    this.cancelBtn = this.productForm.getByRole('button', { name: 'Cancel' });
    this.nameInput = this.productForm.getByRole('textbox').first();
    this.descriptionInput = this.productForm.getByRole('textbox').nth(1);
    this.priceInput = this.productForm.getByRole('spinbutton').nth(0);
    this.stockInput = this.productForm.getByRole('spinbutton').nth(1);
    this.lowStockInput = this.productForm.getByRole('spinbutton').nth(2);
    this.categoryInput = this.productForm.getByRole('textbox').nth(2);
    this.imageUrlsInput = this.productForm.getByPlaceholder('https://...');
  }

  async addProduct({ name, description, price, stock, category, imageUrls, lowStock = 5 }) {
    await this.addNewProduct.waitFor({ state: 'visible' });
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    await this.priceInput.fill(String(price));
    await this.stockInput.fill(String(stock));
    await this.lowStockInput.fill(String(lowStock));
    await this.categoryInput.fill(category);
    await this.imageUrlsInput.fill(imageUrls);
    await this.createBtn.click();
  }
}

module.exports = { AdminProductsPage };
