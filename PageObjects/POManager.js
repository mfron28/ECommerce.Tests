const { CartPage } = require('./CartPage');
const { Checkout } = require('./CheckoutPage');
const { LoginPage } = require('./LoginPage');
const { NavBar } = require('./NavBar');
const { ProductsPage } = require('./ProductsPage');
const { RegisterPage } = require('./RegisterPage');
const {ProfilePage} = require('./ProfilePage');
const {ForgotPasswordPage}= require('./ForgotPasswordPage');
const {WishlistPage}= require('./WishlistPage');
const {AdminPage}=require('./AdminPage');
const {AdminProductsPage}=require('./AdminProductsPage');
const {AdminOrdersPage}=require('./AdminOrdersPage');
const {AdminCouponsPage}=require('./AdminCouponsPage');

class POManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.navBar = new NavBar(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new Checkout(this.page);
    this.profilePage = new ProfilePage(this.page);
    this.forgotPasswordPage=new ForgotPasswordPage(this.page);
    this.wishlistPage=new WishlistPage(this.page);
    this.adminPage=new AdminPage(this.page);
    this.adminProductsPage=new AdminProductsPage(this.page);
    this.adminOrdersPage=new AdminOrdersPage(this.page);
    this.adminCouponsPage=new AdminCouponsPage(this.page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getRegisterPage() {
    return this.registerPage;
  }

  getProductsPage() {
    return this.productsPage;
  }

  getNavBar() {
    return this.navBar;
  }

  getCartPage() {
    return this.cartPage;
  }

  getCheckoutPage() {
    return this.checkoutPage;
  }
  getProfilePage() {
    return this.profilePage;
  }
  getForgotPasswordPage(){
    return this.forgotPasswordPage;
  }

  getWishlistPage(){
    return this.wishlistPage;
  }
  getAdminPage(){
    return this.adminPage;
  }
  getAdminProductsPage(){
    return this.adminProductsPage;
  }
  getAdminOrdersPage(){
    return this.adminOrdersPage;
  }
  getAdminCouponsPage(){
    return this.adminCouponsPage;
  }
}

module.exports = { POManager };
