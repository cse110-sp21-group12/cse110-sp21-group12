/* eslint-disable no-undef*/
const puppeteer = require('puppeteer');

/* To test just this file, run `npm test source/tests/arbitraryURLsTest.test.js` */

describe('Testing Access to Arbitrary URLs', () => {
    const PAGE_404 = 'http://127.0.0.1:5500/source/404/404.html';
    var browser = null;
    var page = null;

    beforeAll(async () => {
        /* create browser and page for tests to run */
        jest.setTimeout(90000);
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 50,
        });
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:5500/source/Login/Login.html');
        await page.waitForTimeout(1000);

        /* login */
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
    });

    it('Test Access DailyOverview with Invalid Date Format', async () => {
        // format here is D/MM/YYYY but we expect DD/MM/YYYY
        await page.goto(
            'http://127.0.0.1:5500/source/DailyOverview/DailyOverview.html#6/04/2022'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access DailyOverview with Day Out of Range', async () => {
        /* access the 32nd of June */
        await page.goto(
            'http://127.0.0.1:5500/source/DailyOverview/DailyOverview.html#06/32/2022'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access DailyOverview with Month Out of Range', async () => {
        /* access 13th month of year */
        await page.goto(
            'http://127.0.0.1:5500/source/DailyOverview/DailyOverview.html#13/04/2022'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access DailyOverview with Year Out of Range', async () => {
        /* access super far in the future */
        await page.goto(
            'http://127.0.0.1:5500/source/DailyOverview/DailyOverview.html#13/04/2075'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access MonthlyOverview with Invalid Date Format', async () => {
        /* format here is MM/YY but we want MM/YYYY */
        await page.goto(
            'http://127.0.0.1:5500/source/MonthlyOverview/MonthlyOverview.html#06/22'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access MonthlyOverview with Month Out of Range', async () => {
        /* access 13month of the year */
        await page.goto(
            'http://127.0.0.1:5500/source/MonthlyOverview/MonthlyOverview.html#13/2022'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access MonthlyOverview with Year Out of Range', async () => {
        /* access super far in past */
        await page.goto(
            'http://127.0.0.1:5500/source/MonthlyOverview/MonthlyOverview.html#13/2002'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access YearlyOverview with Invalid Year Format', async () => {
        /* format here is YY but we want YYYY */
        await page.goto(
            'http://127.0.0.1:5500/source/YearlyOverview/YearlyOverview.html#22'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('Test Access YearlyOverview with Year Out of Range', async () => {
        /* access super far in future */
        await page.goto(
            'http://127.0.0.1:5500/source/YearlyOverview/YearlyOverview.html#2092'
        );
        await page.waitForTimeout(250);
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch(PAGE_404);
    });

    it('URL Tests Done, Close Browser', async () => {
        browser.close();
    });
});
