const testData = require('./TestData.json');

// The admin password is a secret: it comes from ADMIN_PASSWORD (.env locally, a repo secret in CI),
// never from the committed TestData.json.
module.exports = {
  ...testData,
  adminUser: {
    ...testData.adminUser,
    email: process.env.ADMIN_EMAIL || testData.adminUser.email,
    password: process.env.ADMIN_PASSWORD,
  },
};
