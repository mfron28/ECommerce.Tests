class WishlistPage{
    constructor(page){
        this.page=page;
        this.removeBtn=page.getByRole('button', { name: 'Remove' });
    }

    async removeProductFromWishlist(){
        await expect(this.removeBtn).toBeEnabled({ timeout: 10_000 });
        await this.removeBtn.click();
    }
}

module.exports={WishlistPage};