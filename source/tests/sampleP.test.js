/* eslint-disable no-undef*/

//const { loadPartialConfigAsync } = require('@babel/core');

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

    /*

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
    */

    it('Test2: create an account and login - shows index page ', async () => {
        jest.setTimeout(30000);
        //await page.goto('http://127.0.0.1:5501/source/Login/Login.html');
        //await page.waitForTimeout(500);

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
        expect(url).toMatch('http://127.0.0.1:5501/source/Index/index.html');
    });

    it('Test3: From index page go back, should be login page ', async () => {
        await page.goBack();
        const url = await page.evaluate(() => location.href);
        expect(url).toMatch('http://127.0.0.1:5501/source/Login/Login.html');
    });

    it('Test4: Login page should now be sign-in, not create account', async () => {
        const headerText = await page.$eval('#title', (header) => {
            return header.innerHTML;
        });
        expect(headerText).toBe('Welcome back!');
    });

    it('Test5: Input wrong password should give incorrect alert', async () => {
        jest.setTimeout(30000);
        let msg;

        await page.$eval('#pin', (passwordInput) => {
            passwordInput.value = '123';
        });
        await page.waitForTimeout(300);

        page.on('dialog', async (dialog) => {
            msg = dialog.message();
            // not sure why we can't dismiss it here tbh
            /** ANSWER
             * .on adds an event listener to the 'dialog' event,
             * since there are other functions that get called previously
             * the one defined in test 2 is dismissing it for us
             * this is behavior that we want to try to avoid
             * since we kinda want each test case to be by itself
             * you can remove all the event listener functions for a
             * specific event by doing
             * 'page.removeAllEventListeners('dialog');
             * to clear all the event listeners defined by previous test cases
             */
        });

        await page.$eval('#login-button', (button) => {
            button.click();
        });

        expect(msg).toMatch('Incorrect password!');
    });

    it('Test6: go to index screen, make sure highlighted day is the current day', async () => {
        await page.goto('http://127.0.0.1:5501/source/Index/index.html');
        await page.waitForTimeout(300);

        const currentDayHigh = await page.$eval('.today', (day) => {
            return day.innerHTML;
        });

        let currentDate = new Date();
        let date = currentDate.getDate();

        expect(currentDayHigh).toMatch(date.toString());
    });

    it('Test7: click on "Go to current day", should go to day with correct date heading', async () => {
        await page.$eval('#today-button', (btn) => {
            btn.click();
        });
        await page.waitForTimeout(300);

        const currentDateStr = await page.$eval('#date', (dateHeader) => {
            return dateHeader.innerHTML;
        });

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolDay = currentDateStr.indexOf(`${currentDate.getDate()}`) > -1;
        let boolMonth =
            currentDateStr.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear =
            currentDateStr.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolDay && boolMonth && boolYear}`).toMatch('true');
    });

    it('Test8: current date URL should be correct', async () => {
        const url = await page.evaluate(() => location.href);

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolDay = url.indexOf(`${currentDate.getDate()}`) > -1;
        let boolMonth = url.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear = url.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolDay && boolMonth && boolYear}`).toMatch('true');
    });

    it('Test9: TODOs should be empty ', async () => {
        const bulletLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${bulletLength}`).toMatch('0');
    });

    it('Test10: Notes should be empty ', async () => {
        const noteText = await page.$eval('note-box', (outerNote) => {
            // a lot of nesting inside the shadowDOM to get to the actual notes text box
            return outerNote.shadowRoot.lastElementChild.lastElementChild
                .innerHTML;
        });

        expect(noteText).toMatch('');
    });

    it('Test11: monthly goals should be empty ', async () => {
        const mGoalsLength = await page.$eval('#monthGoal', (mGoals) => {
            console.log(mGoals.childNodes);
            return mGoals.childNodes.length;
        });

        expect(`${mGoalsLength}`).toMatch('0');
    });

    it('Test12: yearly goals should be empty', async () => {
        const yGoalsLength = await page.$eval('#yearGoal', (yGoals) => {
            console.log(yGoals.childNodes);
            return yGoals.childNodes.length;
        });

        expect(`${yGoalsLength}`).toMatch('0');
    });

    it('Test13: photo album should be empty', async () => {
        const photoLength = await page.$eval('#myCanvas', () => {
            console.log(window.Image.length);
            return window.Image.length;
        });

        expect(`${photoLength}`).toMatch('0');
    });

    it('Test14: add a bullet to TODO, check length', async () => {
        await page.$eval('#entry', (bulletEntry) => {
            bulletEntry.value = 'Finish 110 Lab';
        });

        await page.waitForTimeout(300);

        await page.$eval('#entry-button', (button) => {
            button.click();
        });

        const entryLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${entryLength}`).toMatch('1');
    });

    it('Test15: edit a bullet in TODO', async () => {
        await page.waitForTimeout('300');

        /**
         * .on adds an event listener to the 'dialog' event,
         * since there are other functions that get called previously, we want to get
         * rid of those using removeAllListeners and add the one we want for
         * this particular test case
         */
        page.removeAllListeners('dialog');
        page.on('dialog', async (dialog) => {
            await dialog.accept('Finish 101 Final');
        });

        await page.$eval('bullet-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('#edit').click();
        });

        await page.waitForTimeout('300');

        let bulletText = await page.$eval('bullet-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('.bullet-content')
                .innerHTML;
        });

        expect(bulletText).toMatch('Finish 101 Final');
    });

    it('Test16: add a child bullet in TODO', async () => {
        page.removeAllListeners('dialog');
        page.on('dialog', async (dialog) => {
            await dialog.accept('Remember to fill out CAPES');
        });

        await page.$eval('bullet-entry', (bulletList) => {
            //clicks "add" for the bullet
            bulletList.shadowRoot.querySelector('#add').click();
        });

        await page.waitForTimeout('300');

        let bulletChildren = await page.$eval('bullet-entry', (bulletList) => {
            //gets the length of how many children the bullet has
            return bulletList.shadowRoot.querySelector('.child').children
                .length;
        });

        expect(`${bulletChildren}`).toMatch('1');
    });

    it('Test17: child bullet has correct text', async () => {
        let bulletChildText = await page.$eval('bullet-entry', (bulletList) => {
            //gets the content of the child bullet
            return bulletList.shadowRoot.querySelector('.child > bullet-entry')
                .entry.content;
        });

        expect(bulletChildText).toMatch('Remember to fill out CAPES');
    });

    it('Test18: mark child done bullet in TODO', async () => {
        await page.$eval('bullet-entry', (bulletList) => {
            //clicks "done" for the child bullet
            return bulletList.shadowRoot
                .querySelector('.child > bullet-entry')
                .shadowRoot.querySelector('#done')
                .click();
        });

        let bulletChildDecor = await page.$eval(
            'bullet-entry',
            (bulletList) => {
                //gets the style of the text of the child bullet
                return bulletList.shadowRoot
                    .querySelector('.child > bullet-entry')
                    .shadowRoot.querySelector('.bullet-content').style
                    .textDecoration;
            }
        );

        expect(bulletChildDecor).toMatch('line-through');
    });

    it('Test19: delete a child bullet in TODO', async () => {
        await page.$eval('bullet-entry', (bulletList) => {
            //gets the child bullet and deletes it
            return bulletList.shadowRoot
                .querySelector('.child > bullet-entry')
                .shadowRoot.querySelector('#delete')
                .click();
        });

        await page.waitForTimeout('300');

        const entryLength = await page.$eval('bullet-entry', (bullets) => {
            //gets how many children the bullet has
            return bullets.shadowRoot.querySelector('.child').childNodes.length;
        });

        expect(`${entryLength}`).toMatch('0');
    });

    /**
     * add a child bullet, delete top level, both should disapear?
     */
    it('Test20a: add a child bullet in TODO, delete parent pt1', async () => {
        page.removeAllListeners('dialog');
        page.on('dialog', async (dialog) => {
            await dialog.accept('Remember to fill out TA CAPES');
        });

        await page.$eval('bullet-entry', (bulletList) => {
            //clicks "add" for the bullet
            bulletList.shadowRoot.querySelector('#add').click();
        });

        await page.waitForTimeout('300');

        let bulletChildren = await page.$eval('bullet-entry', (bulletList) => {
            //gets the length of how many children the bullet has
            return bulletList.shadowRoot.querySelector('.child').children
                .length;
        });

        expect(`${bulletChildren}`).toMatch('1');
    });

    it('Test20b: add a child bullet in TODO, delete parent pt2', async () => {
        await page.$eval('bullet-entry', (bulletList) => {
            //clicks "add" for the bullet
            bulletList.shadowRoot.querySelector('#delete').click();
        });

        await page.waitForTimeout('300');

        let bulletChildrenLen = await page.$eval('#bullets', (bulletList) => {
            //gets the length of how many children the bullet has
            return bulletList.childNodes.length;
        });

        expect(`${bulletChildrenLen}`).toMatch('0');
    });

    it('Test21: adding notes shows up', async () => {
        await page.$eval('note-box', (notebox) => {
            //stes note box text
            notebox.shadowRoot.querySelector('.noteContent').innerHTML =
                'pickup amazon package from locker';
        });

        await page.waitForTimeout('300');

        let noteText = await page.$eval('note-box', (notebox) => {
            //gets text from note box
            return notebox.shadowRoot.querySelector('.noteContent').value;
        });

        /**
         * This doesn't actually save the text, since that is done on a "mouse hover" event when the mouse
         * leaves the text area
         */

        expect(noteText).toMatch('pickup amazon package from locker');
    });

    it('Test22: go to monthly overview through <Month button', async () => {
        await page.waitForTimeout(300);

        await page.$eval('#words', (button) => {
            button.click();
        });

        const url = await page.evaluate(() => location.href);

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolMonth = url.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear = url.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolMonth && boolYear}`).toMatch('true');
    });

    it('Test23: making sure monthly goals are empty', async () => {
        const bulletLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${bulletLength}`).toMatch('0');
    });

    it('Test24: adding monthly goals, check length', async () => {
        await page.$eval('#entry', (bulletEntry) => {
            bulletEntry.value = 'Drink more water';
        });

        await page.waitForTimeout(300);

        await page.$eval('#entry-button', (button) => {
            button.click();
        });

        const entryLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${entryLength}`).toMatch('1');
    });

    it('Test25: navigating to daily through calendar in monthly', async () => {
        await page.$eval('.today', (button) => {
            button.click();
        });

        const url = await page.evaluate(() => location.href);

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolDay = url.indexOf(`${currentDate.getDate()}`) > -1;
        let boolMonth = url.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear = url.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolDay && boolMonth && boolYear}`).toMatch('true');
    });

    it('Test26: check monthly goals added in daily overview', async () => {
        const mGoalsText = await page.$eval('#monthGoal', (mGoals) => {
            return mGoals.innerHTML;
        });

        expect(`${mGoalsText}`).toMatch('Drink more water');
    });

    it('Test27: edit monthly goals', async () => {
        await page.goBack();

        await page.waitForTimeout('300');

        page.removeAllListeners('dialog');
        page.on('dialog', async (dialog) => {
            await dialog.accept('Drink 5 cups of water everyday');
        });

        await page.$eval('goals-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('#edit').click();
        });

        await page.waitForTimeout('300');

        let bulletText = await page.$eval('goals-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('.bullet-content')
                .innerHTML;
        });

        expect(bulletText).toMatch('Drink 5 cups of water everyday');
    });

    it('Test28: check monthly goals edited in daily overview', async () => {
        await page.waitForTimeout('300');

        await page.$eval('.today', (button) => {
            button.click();
        });

        const mGoalsText = await page.$eval('#monthGoal', (mGoals) => {
            return mGoals.innerHTML;
        });

        expect(`${mGoalsText}`).toMatch('Drink 5 cups of water everyday');
    });

    it('Test29: mark done monthly goals', async () => {
        await page.goBack();

        await page.$eval('goals-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('#done').click();
        });

        let bulletText = await page.$eval('goals-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('.bullet-content').style
                .textDecoration;
        });

        expect(bulletText).toMatch('line-through');
    });

    it('Test30: check monthly goals marked done in daily overview', async () => {
        await page.waitForTimeout('300');

        await page.$eval('.today', (button) => {
            button.click();
        });

        const mGoalsText = await page.$eval('p', (mGoals) => {
            return mGoals.style.textDecoration;
        });

        expect(`${mGoalsText}`).toMatch('line-through');
    });

    it('Test31: delete monthly goals', async () => {
        await page.goBack();

        await page.waitForTimeout('300');

        await page.$eval('goals-entry', (bulletList) => {
            return bulletList.shadowRoot.querySelector('#delete').click();
        });

        await page.waitForTimeout('300');

        const bulletLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${bulletLength}`).toMatch('0');
    });

    it('Test32: check monthly goals removed in daily overview', async () => {
        await page.$eval('.today', (button) => {
            button.click();
        });

        const mGoalsLength = await page.$eval('#monthGoal', (mGoals) => {
            console.log(mGoals.childNodes);
            return mGoals.childNodes.length;
        });

        expect(`${mGoalsLength}`).toMatch('0');
    });

    it('Test33: check <Year button in monthly overview works', async() => {
        await page.$eval('index', (button) => {
            button.click();
        })

        
    });

    it('Test34: making sure yearly goals should be empty', async() => {

    });

    it('Test35: adding yearly goals, check length', async() => {

    });

    it('Test36: navigating through the months should work', async() => {

    });

    it('Test37: check yearly goals added in daily overview', async() => {

    });

    it('Test38: edit yearly goals', async() => {

    });

    it('Test39: check yearly goals edited in yearly overview', async() => {

    });

    it('Test40: mark done yearly goals', async() => {

    });

    it('Test41: check yearly goals marked done in daily overview', async() => {

    });

    it('Test42: delete yearly goals', async() => {

    });

    it('Test43: check yearly goals removed in daily overview', async() => {

    });

    it('Test44: check <Index button in yearly overview works', async() => {

    });

    it('Test45: check that the calendar in the index page works properly', async() => {

    });

    it('Test46: check that going to certain years work in the index page', async() => {

    });

    it('Test47: check that going to certain months work in the index page', async() => {

    });

    it('Test48: check that the home button works in the yearly overview', async() => {

    });

    it('Test49: check that the home button works in the monthly overview', async() => {

    });

    it('Test50: check that the home button works in the daily overview', async() => {

    });
});
