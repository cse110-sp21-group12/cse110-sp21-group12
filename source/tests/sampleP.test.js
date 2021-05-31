/* eslint-disable no-undef*/

const { loadPartialConfigAsync } = require('@babel/core');

/*//sample puppeteer test
describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com');
    });

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google');
    });
});*/
//npm test source/tests/sampleP.test.js

describe('basic navigation for BJ', () => {
  beforeAll(async () => {                                
    await page.goto('http://127.0.0.1:5501/source/Login/Login.html');
    await page.waitForTimeout(500);

//does it work????

  it('Test1: Initial Home Page - Shows create your login ', async () => {
    const headerText = await page.$eval('header', (header) => {
      return header.innerHTML;
    });
    expect(headerText).toBe('Create your login!');
  }); 

});