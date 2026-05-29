const { expect } = require('@playwright/test');

class ApiUtils {
    constructor(apiContext, loginPayLoad, orderPayload) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
        this.orderPayload = orderPayload;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            { data: this.loginPayLoad }
        );
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }

    async createOrder() {
        const token = await this.getToken();
        const orderResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: this.orderPayload,
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(orderResponse.ok()).toBeTruthy();
        const orderResponseJson = await orderResponse.json();
        const orderId = orderResponseJson.orders[0];
        return { token, orderId };
    }
}

module.exports = { ApiUtils };