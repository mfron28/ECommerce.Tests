class AdminPage{
    constructor(page){
        this.page=page;
        const main = page.getByRole('main');
        this.overviewTab= main.getByRole('button', { name: 'overview' })
        this.productTab=main.getByRole('button', { name: 'products' })
        this.ordersTab=main.getByRole('button', { name: 'orders' })
        this.couponsTab=main.getByRole('button', { name: 'coupons' })
    }

    async goToAdminPage(){
        await this.page.goto('/admin');
    }
    async openOverviewTab(){
        await this.overviewTab.click();
    }
    async openProductsTab(){
        await this.productTab.click();
    }
    async openOrdersTab(){
        await this.ordersTab.click();
    }
    async openCouponsTab(){
        await this.couponsTab.click();
    }
}
module.exports={AdminPage};