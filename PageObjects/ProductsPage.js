const { expect } = require('@playwright/test');

class ProductsPage {
    constructor(page) {
      this.page = page;
      this.productsPage = page.getByRole('link', { name: 'Products' });
      this.searchButton = page.getByRole('textbox', { name: 'Search' });
      this.category = page.getByRole('combobox', { name: 'Category' });
      this.maxPrice = page.getByRole('spinbutton', { name: 'Max price' });
      this.minPrice = page.getByRole('spinbutton', { name: 'Min price' });
      this.addToCart = page.getByRole('button', { name: 'Add to cart' });
      this.products = page.getByRole('main').getByRole('article');
      this.reviewsSection = page.getByRole('main').locator('section').filter({
        has: page.getByRole('heading', { name: 'Reviews' }),
      });
      this.reviewRating = this.reviewsSection.getByRole('combobox');       
      this.reviewComment = this.reviewsSection.locator('textarea');        
      this.submitReviewBtn = this.reviewsSection.getByRole('button', { name: 'Submit review' });
      this.reviewSuccessMsg = this.reviewsSection.getByText(/review submitted/i);
    }
  
    async gotoProductsListing() {
      await this.page.goto('/');
    }
  
    async searchProduct(productName) {
      await this.searchButton.fill(productName);
      await this.searchButton.press('Enter');
      await this.page.getByRole('main').getByText(new RegExp(productName, 'i')).first().waitFor();
    }

    async searchProductByPrice(minPrice, maxPrice) {
      const min = String(minPrice);
      const max = String(maxPrice);
      await this.minPrice.fill(min);
      await this.maxPrice.fill(max);
      await this.maxPrice.press('Enter');
      await this.page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });
    }
  
    async clearSearch() {
      await this.searchButton.fill('');
      await this.searchButton.press('Enter');
      await this.page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });
    }
  
   
    async selectCategory(categoryName) {
      await this.category.selectOption({ label: categoryName });
      await this.page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });
    }
  
   
    async selectProduct(productName) {
      await this.page.getByRole('main').getByRole('link', { name: productName }).click();
      await this.addToCart.waitFor({ state: 'visible' });
    }
  
    async selectOutOfStockProduct(productName) {
      await this.page.getByRole('main').getByRole('link', { name: productName }).click();
      await this.addToCart.waitFor({ state: 'visible' });
      await expect(this.addToCart).toBeDisabled();
      await expect(this.page.getByRole('main').getByText(/out of stock/i)).toBeVisible();
    }

    async openProductFromListingByIndex(index) {
      const card = this.page.getByRole('main').getByRole('article').nth(index);
      await card.getByRole('heading', { level: 2 }).click();
      await this.addToCart.waitFor({ state: 'visible' });
    }
  
   
    async openRandomProductFromListing() {
      const n = await this.page.getByRole('main').getByRole('article').count();
      if (n === 0) throw new Error('No product cards found on the listing');
  
      const start = Math.floor(Math.random() * n);
      for (let step = 0; step < n; step++) {
        await this.openProductFromListingByIndex((start + step) % n);
        if (!(await this.addToCart.isDisabled())) return;
        await this.page.goBack();
        await this.page.getByRole('main').getByRole('article').first().waitFor({ state: 'visible' });
      }
      throw new Error('No in-stock product found on the listing');
    }
  
    async addProductToCart() {
      await expect(this.addToCart).toBeEnabled({ timeout: 10_000 });
      await this.addToCart.click();
    }
  
    async goToCartPage() {
      await this.page.getByRole('navigation').getByRole('link', { name: 'Cart', exact: true }).click();
      await this.page.waitForURL('**/cart', { timeout: 15000 });
    }

    async addProductToWishlist() {
      const inWishlistBtn = this.page.getByRole('button', { name: /in wishlist/i });
      if (await inWishlistBtn.isVisible()) {
        return;
      }
      const addBtn = this.page.getByRole('button', { name: /add to wishlist/i });
      await expect(addBtn).toBeEnabled({ timeout: 10_000 });
      await addBtn.click();
    }

    async addReviewToProduct(rating, comment) {
      const stars = Number(rating);
      if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        throw new Error('Rating must be an integer from 1 to 5');
      }
      await this.reviewRating.selectOption({ label: `${stars} stars` });
      await this.reviewComment.fill(comment);
      await this.submitReviewBtn.click();
      await expect(this.reviewSuccessMsg).toBeVisible();
    }

    /** Picks the first listing product the logged-in user has not reviewed yet. */
    async submitReviewOnUnreviewedProduct(rating, comment) {
      const count = await this.products.count();
      for (let i = 0; i < count; i++) {
        await this.gotoProductsListing();
        await this.openProductFromListingByIndex(i);
        if (await this.reviewsSection.getByText(/already reviewed/i).isVisible()) {
          continue;
        }
        await this.addReviewToProduct(rating, comment);
        return;
      }
      throw new Error('No unreviewed in-stock product found on the listing');
    }
  }
  
  module.exports = { ProductsPage };
  