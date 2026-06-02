class WishlistPage {
  constructor(page) {
    this.page = page;
  }

  async removeProductFromWishlist(productName) {
    const item = this.page
      .getByRole('main')
      .getByRole('article')
      .filter({ has: this.page.getByRole('heading', { name: productName }) });

    const removeBtn = item.getByRole('button', { name: 'Remove' });
    await removeBtn.waitFor({ state: 'visible' });
    await removeBtn.click();
  }
}

module.exports = { WishlistPage };
