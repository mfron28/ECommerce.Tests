class Checkout{
    constructor(page){
        this.page=page;
        this.placeOrderButton=page.getByRole('button', { name: 'Place order' });
    }

    async placeAnOrder(){
        await this.placeOrderButton.click();
    }
}
module.exports={Checkout};