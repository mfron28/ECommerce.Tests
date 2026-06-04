const base = require('@playwright/test');
const { POManager } = require('../PageObjects/POManager');
const testData = require('../utils/TestData.json');
const { resetAllTestUsers } = require('../utils/testCleanup');

const test = base.test.extend({
  _cleanState: [
    async ({ request }, use) => {
      await resetAllTestUsers(request);
      await use();
    },
    { auto: true },
  ],

  poManager: async ({ page }, use) => {
    await use(new POManager(page));
  },

  users: async ({}, use) => {
    await use(testData);
  },

  loggedIn: async ({ page, poManager }, use) => {
    const login = poManager.getLoginPage();
    await login.gotoLogin();
    await login.validateLogin(testData.validUser.email, testData.validUser.password);
    await use(poManager);
  },

  loggedInAdmin: async ({ page, poManager }, use) => {
    const login = poManager.getLoginPage();
    await login.gotoLogin();
    await login.validateLogin(testData.adminUser.email, testData.adminUser.password);
    await use(poManager);
  },
});

module.exports = { test, expect: base.expect };
