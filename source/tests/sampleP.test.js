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
    });

    it('Test1: Initial Home Page - Shows create your login ', async () => {
        const headerText = await page.$eval('#title', (header) => {
            return header.innerHTML;
        });
        expect(headerText).toBe('Create your login!');
    });

    it('Test2: Try to access another page Daily - Shows create your login ', async () => {
        await page.goto(
            'http://127.0.0.1:5501/source/DailyOverview/DailyOverview.html'
        );
        await page.waitForTimeout(300);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Login/Login.html');
    });

    it('Test3: Try to access another page Monthly - Shows create your login ', async () => {
        await page.goto(
            'http://127.0.0.1:5501/source/MonthlyOverview/MonthlyOverview.html'
        );
        await page.waitForTimeout(300);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Login/Login.html');
    });

    it('Test4: Try to access another page Yearly - Shows create your login ', async () => {
        await page.goto(
            'http://127.0.0.1:5501/source/YearlyOverview/YearlyOverview.html'
        );
        await page.waitForTimeout(300);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Login/Login.html');
    });

    it('Test5: create an account and login - shows index page ', async () => {
        jest.setTimeout(30000);

        await page.$eval('#username', (usernameInput) => {
            usernameInput.value = 'SampleUsername';
        });
        await page.$eval('#pin', (passwordInput) => {
            passwordInput.value = '1234';
        });
        await page.waitForTimeout(300);

        page.on('dialog', async (dialog) => {
            await dialog.dismiss();
        });

        await page.$eval('#login-button', (button) => {
            button.click();
        });

        console.log(page);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Index/index.html');
    });
});
