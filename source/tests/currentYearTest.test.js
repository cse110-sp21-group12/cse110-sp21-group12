/* eslint-disable no-undef*/
const puppeteer = require('puppeteer');
// please read through some of the comments with NOTE: if this test fails
// This test is more for local testing since I am not sure what would happen to the test if it is run on github
let date = new Date();
let currentYear = date.getFullYear();

describe('current year test', () => {
    it('Test1: Current year test ', async (done) => {
        jest.setTimeout(90000);
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
        });
        const page = await browser.newPage();
        // this lets us see console.logs in this format : await page.evaluate(() => console.log());
        // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        // NOTE: use this link for when our changes are pushed to the master branch
        // await page.goto(
        //     'https://cse112-sp22-teamxrefactor.github.io/CSE112-SP22-TeamXRefactor/source/Login/Login.html'
        // );
        // NOTE: for local testing depending on what URL live server takes you, you will need to change this
        await page.goto('http://127.0.0.1:5500/source/Login/Login.html');

        await page.waitForTimeout(500);

        // login page check
        const headerText = await page.$eval('#title', (header) => {
            return header.innerHTML;
        });
        expect(headerText).toBe('Create your login!');

        // login now
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

        let currYearString = currentYear.toString();
        await page.$eval('#year_' + currYearString + '_link', (anchor) => {
            anchor.click();
        });

        const year = await page.$eval('#currentYear', (header) => {
            return header.innerHTML;
        });
        expect(year).toBe(currentYear + ' Yearly Overview');
        done();
        await page.waitForTimeout(3000);
        browser.close();
    });
});
