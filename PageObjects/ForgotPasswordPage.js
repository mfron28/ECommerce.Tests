class ForgotPasswordPage{
    constructor(page){
        this.page=page;
        const main = page.getByRole('main');
        this.email = main.locator('form').getByRole('textbox');
        this.sendResetLinkBtn=main.getByRole('button', { name: 'Send reset link' });
        this.backToLogin=main.getByRole('link', { name: 'Back to login' });
    }

    async goToForgotPassword(){
        await this.page.goto('/forgot-password');
    }
    async sendResetLink(userEmail){
        await this.email.fill(userEmail);
        await this.sendResetLinkBtn.click();
    }

    async goToLoginPage(){
        await this.backToLogin.click();
    }
}

module.exports={ForgotPasswordPage};