class NavBar{
    constructor(page){
        this.page=page;
        this.productsLink=page.getByRole('link', { name: 'Products' });
        this.cartLink=page.getByRole('link', { name: 'Cart' });
        this.ordersLink=page.getByRole('link', { name: 'Orders' });
        this.logout=page.getByRole('button', { name: 'Log out' });
        this.shopPage=page.getByRole('link', { name: 'Shop' });
        this.wishlistPage=page.getByRole('link', { name: 'Wishlist' });
        this.adminPage=page.getByRole('link', { name: 'Admin' });
    }

    async goToProductPageFromNavbar(){
        await this.productsLink.click();
    }

    async goToCartPageFromNavbar(){
        await this.cartLink.click();
    }
    async goToOrderHistoryPageFromNavbar(){
        await this.ordersLink.click();
    }
    async logoutFromApp(){
        await this.logout.click();
    }
    async goToShopPage(){
        await this.shopPage.click();
    }

    async goToWishlistPage(){
        await this.wishlistPage.click();
    }
    async goToAdminPage(){
        await this.adminPage.click();
    }
}
module.exports={NavBar};
