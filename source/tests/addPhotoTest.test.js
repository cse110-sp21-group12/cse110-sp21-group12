/* eslint-disable no-undef*/
const puppeteer = require('puppeteer');
// please read through some of the comments with NOTE: if this test fails
// This test is more for local testing since I am not sure what would happen to the test if it is run on github

describe('basic navigation for BJ', () => {
    it('Test1: Login, go to specified day, then add 2 photos, view both, delete one ', async (done) => {
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

        const url = await page.evaluate(() => location.href);
        // NOTE: use this link for when our changes are pushed to the master branch
        // expect(url).toMatch(
        //     'https://cse112-sp22-teamxrefactor.github.io/CSE112-SP22-TeamXRefactor/source/Login/Login.html'
        // );
        //go to current day daily overview
        await page.click('#today-button', { clickCount: 1 });

        // NOTE: Pre-testing before changes pushed to branch
        // NOTE: for local depending on what URL live server takes you, you will need to change this URL
        expect(url).toMatch('http://127.0.0.1:5500/source/Index/Index.html');

        // Try to Add a Photo and then Cancel
        await page.click('#addPhoto', { clickCount: 1 });
        await page.click('#cancel', { clickCount: 1 });
        await page.waitForTimeout(1000);

        // Add two photos and click left then right to switch between the photos
        await page.click('#addPhoto', { clickCount: 1 });
        await page.waitForTimeout(1000);
        // this lets us upload a photo as input to the input without choosing from the pop up menu
        // NOTE: this is taking a jpg photo from the images folder under the DailyOverview Folder
        const input = await page.$('#image-input');
        await input.uploadFile('source/DailyOverview/images/house.jpg');

        await page.click('#save', { clickCount: 1 });
        await page.waitForTimeout(2000);

        await page.click('#addPhoto', { clickCount: 1 });
        await page.waitForTimeout(1000);
        // this lets us upload a photo as input to the input without choosing from the pop up menu
        // NOTE: this image is currentDayTestDinos in the source\DailyOverview\images
        const input2 = await page.$('#image-input');
        await input2.uploadFile(
            'source/DailyOverview/images/currentDayTestDinos.jpg'
        );

        await page.click('#save', { clickCount: 1 });
        await page.waitForTimeout(2000);

        await page.click('#left', { clickCount: 1 });
        await page.waitForTimeout(1000);
        await page.click('#right', { clickCount: 1 });
        await page.waitForTimeout(1000);

        await page.click('#deletePhoto', { clickCount: 1 });
        await page.waitForTimeout(1000);

        // This code below doesn't actually test how many images are stored
        // Why? this test is from a user's perspective and to know how many images are stored would require getting a
        // variable from the DailyJS.js such as currentDay.photos since you clear the canvas every time you
        // add or click left/right.  But a user shouldn't have access to this data
        // const photoLength = await page.$eval('#myCanvas',  () => {
        //     console.log(window.Image)
        //     return window.Image.length;
        // });
        // expect(`${photoLength}`).toMatch('0');

        done();
        await page.waitForTimeout(3000);
        browser.close();
    });
});
