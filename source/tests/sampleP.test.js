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

    it('Test6: From index page go back, should be login page ', async () => {
        await page.goBack();
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Login/Login.html');
    });

    it('Test7: Login page should now be sign-in, not create account', async () => {
        const headerText = await page.$eval('#title', (header) => {
            return header.innerHTML;
        });
        expect(headerText).toBe('Welcome back!');
    });

    it('Test8: Input wrong password should give incorrect alert', async () => {
        jest.setTimeout(30000);
        let msg;

        await page.$eval('#pin', (passwordInput) => {
            passwordInput.value = '123';
        });
        await page.waitForTimeout(300);

        page.on('dialog', async (dialog) => {
            msg = dialog.message();
            // not sure why we can't dismiss it here tbh
            //await dialog.dismiss();
        });

        await page.$eval('#login-button', (button) => {
            button.click();
        });

        expect(msg).toMatch('Incorrect password!');
    });

    it('Test9: go to index screen, make sure highlighted day is the current day', async () => {
        await page.goto('http://127.0.0.1:5501/source/Index/index.html');
        await page.waitForTimeout(300);

        const currentDayHigh = await page.$eval('.today', (day) => {
            return day.innerHTML;
        });

        let currentDate = new Date();
        let date = currentDate.getDate();

        expect(currentDayHigh).toMatch(date.toString());
    });

    it('Test10: click on "Go to current day", should go to day with correct date heading', async () => {
        await page.$eval('#today-button', (btn) => {
            btn.click();
        });
        await page.waitForTimeout(300);

        const currentDateStr = await page.$eval('#date', (dateHeader) => {
            return dateHeader.innerHTML;
        });

        console.log(currentDateStr);
        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolDay = currentDateStr.indexOf(`${currentDate.getDate()}`) > -1;
        let boolMonth =
            currentDateStr.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear =
            currentDateStr.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolDay && boolMonth && boolYear}`).toMatch('true');
    });

    /*
    it('Test11: current date URL should be correct', async () => {
        await page.$eval('#today-button', (btn) => {
            btn.click()
        });
        await page.waitForTimeout(300);

        const currentDateStr = await page.$eval('#date', (dateHeader) => {
            return dateHeader.innerHTML;
        });

        let currentDate = new Date();
        //kinda too lazy to build the string
        let boolDay = currentDateStr.indexof(currentDate.getDate()) > -1;
        let boolMonth= currentDateStr.indexof(currentDate.getMonth()) > -1;
        let boolYear= currentDateStr.indexof(currentDate.getFullYear()) > -1;

        expect(boolDay && boolMonth && boolYear).toMatch('true');
    });
    */
});
