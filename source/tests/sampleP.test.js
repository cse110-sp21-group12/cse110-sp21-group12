/* eslint-disable no-undef*/

const { loadPartialConfigAsync } = require("@babel/core");

//sample puppeteer test
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com');
    });

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google');
    });
});
