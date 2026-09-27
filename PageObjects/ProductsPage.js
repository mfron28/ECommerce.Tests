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
      await this.products.first().waitFor({ state: 'visible' });
      const n = await this.products.count();
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
      // Wait for the API to save the item, so the cart page doesn't load before it exists.
      const added = this.page.waitForResponse(
        (res) => res.url().endsWith('/api/cart') && res.request().method() === 'POST',
      );
      await this.addToCart.click();
      expect((await added).ok()).toBeTruthy();
    }
  
    async goToCartPage() {
      await this.page.getByRole('navigation').getByRole('link', { name: 'Cart', exact: true }).click();
      await this.page.waitForURL('**/cart', { timeout: 15000 });
    }

    async addProductToWishlist() {
      const inWishlistBtn = this.page.getByRole('button', { name: /in wishlist/i });
      const addBtn = this.page.getByRole('button', { name: /add to wishlist/i });
      // Wait until the wishlist state has loaded before deciding which button is shown.
      await expect(inWishlistBtn.or(addBtn)).toBeVisible();
      if (await inWishlistBtn.isVisible()) {
        return;
      }
      await expect(addBtn).toBeEnabled({ timeout: 10_000 });
      // Wait for the API to save it, so the wishlist page doesn't load before it exists.
      const added = this.page.waitForResponse(
        (res) => /\/api\/wishlist\/[^/]+$/.test(res.url()) && res.request().method() === 'POST',
      );
      await addBtn.click();
      expect((await added).ok()).toBeTruthy();
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

    /**
     * Reviews the first listing product the logged-in user has not reviewed yet.
     * The page only reports "already reviewed" after a submit, so try products until one succeeds.
     */
    async submitReviewOnUnreviewedProduct(rating, comment) {
      // count() doesn't wait, so let the listing load first (slow on the hosted API).
      await this.products.first().waitFor({ state: 'visible' });
      const count = await this.products.count();
      const alreadyReviewed = this.reviewsSection.getByText(/already reviewed/i);
      for (let i = 0; i < count; i++) {
        await this.gotoProductsListing();
        await this.openProductFromListingByIndex(i);
        await this.reviewRating.selectOption({ label: `${Number(rating)} stars` });
        await this.reviewComment.fill(comment);
        await this.submitReviewBtn.click();
        await expect(this.reviewSuccessMsg.or(alreadyReviewed)).toBeVisible();
        if (await this.reviewSuccessMsg.isVisible()) {
          return;
        }
      }
      throw new Error('No unreviewed product found on the listing');
    }
  }
  
  module.exports = { ProductsPage };
  