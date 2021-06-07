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
            //await dialog.dismiss();
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

        await page.hover('#dropdownHover');

        await page.waitForTimeout('300');

        await page.$eval('#edit', (button) => {
            button.click();
        });

        await page.waitForTimeout(300);

        await dialog.accept(['Finish 101 Final']);

        const mGoalsText = await page.$eval('#bullet-content', (bullet) => {
            return bullet.innerHTML;
        });

        expect(bullet).toMatch('Finish 101 Final');
    });
    /*
    it('Test 16: delete a bullet in TODO', async() => {

    })

    it('Test 17: add a child bullet in TODO', async() => {

    })

    it('Test18: mark done bullet in TODO', async() => {

    })

    it('Test19: add notes in notes', async() => {

    })

    it('Test 20: add photo in photo album', async() => {

    })

    it('Test21: go to monthly overview through <Month button', async() => {

        await page.waitForTimeout(300);

        await page.$eval('#words', (button) => {
            button.click();
        })

        const url = await page.evaluate(() => location.href);

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolMonth = url.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear = url.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolMonth && boolYear}`).toMatch('true');
    });

    it ('Test22: making sure monthly goals are empty', async() => {
        const bulletLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        });

        expect(`${bulletLength}`).toMatch('0');
    })

    it ('Test23: adding monthly goals, check length', async() => {
        await page.$eval('#entry', (bulletEntry) => {
            bulletEntry.value = 'Drink more water';
        });
        
        await page.waitForTimeout(300);

        await page.$eval('#entry-button', (button) => {
            button.click();
        })

        const entryLength = await page.$eval('#bullets', (bullets) => {
            return bullets.childNodes.length;
        })

        expect(`${entryLength}`).toMatch('1');
    })

    it ('Test24: navigating to daily through calendar in monthly', async() => {
        await page.$eval('.today', (button) => {
            button.click();
        })

        const url = await page.evaluate(() => location.href);

        let currentDate = new Date();

        //kinda too lazy to build the string
        let boolDay = url.indexOf(`${currentDate.getDate()}`) > -1;
        let boolMonth = url.indexOf(`${currentDate.getMonth() + 1}`) > -1;
        let boolYear = url.indexOf(`${currentDate.getFullYear()}`) > -1;

        expect(`${boolDay && boolMonth && boolYear}`).toMatch('true');
        
    })

    it ('Test25: check monthly goals added in daily overview', async() => {
        const mGoalsText = await page.$eval('#monthGoal', (mGoals) => {
            return mGoals.innerHTML;
        });

        expect(`${mGoalsText}`).toMatch('Drink more water');
    })
/*
    it ('Test26: edit monthly goals', async() => {

    })

    it ('Test27: check monthly goals edited in daily overview', async() => {

    })

    it ('Test28: mark done monthly goals', async() => {

    })

    it ('Test29: check monthly goals marked done in daily overview', async() => {

    })

    it ('Test30: delete monthly goals', async() => {

    })

    it ('Test31: check monthly goals removed in daily overview', async() => {

    })

*/
});
