class NavBar{
    constructor(page){
        this.page=page;
        this.productsLink=page.getByRole('link', { name: 'Products' });
        this.cartLink=page.getByRole('link', { name: 'Cart' });
        this.ordersLink=page.getByRole('link', { name: 'Orders' });
        this.logout=page.getByRole('button', { name: 'Log out' });
        this.shopPage=page.getByRole('link', { name: 'Shop' });
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
}
module.exports={NavBar};
