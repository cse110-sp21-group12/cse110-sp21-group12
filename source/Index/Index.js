import { db, getUserID } from '../Backend/FirebaseInit.js';
import { ref } from '../Backend/firebase-src/firebase-database.min.js';

const daysInWeek = 7;
const mthInYear = 12;

window.addEventListener('load', () => {
    // check user existence and get user id
    const userId = getUserID();

    let userData;

    // Current date the week preview is at
    // TODO - handle calendar case
    const now = new Date(Date.now());
    const currYr = now.getFullYear();
    const currMth = now.getMonth() + 1; // 1 - 12
    const currDate = now.getDate(); // 1 - 31
    const currDay = now.getDay(); // 0 - 6

    // get user data from Firebase
    ref(db, `${userId}`)
        .then((res) => res.json())
        .then((data) => {
            userData = data;

            // set theme
            document.documentElement.style.setProperty(
                '--bg-color',
                userData.theme
            );

            // render week preview
            renderWeekPreview(userData, currYr, currMth, currDate, currDay);

            // render monthly goals
            renderMonthlyGoals(userData, currYr, currMth);

            // render yearly goals
            renderYearlyGoals(userData, currYr);

            // render notes
            renderNotes(userData, currYr, currMth, currDate);

            // render photo album
            renderPhotos(userData, currYr, currMth, currDate, currDay);
        });

    // add event listener 'click' for Settings
    settingsListener();
});

/**
 * Render user's undone monthly goals to Monthly goal section on Homapge
 * @param {Object} userData Object of user data
 * @param {Number} year current year
 * @param {Number} mth current month (1 - 12)
 * @param {Number} date current date (1 - 31)
 * @param {Number} day current day (0 - 6)
 */
function renderWeekPreview(userData, year, mth, date, day) {
    // get weekly preview board - TODO
    // const wkBoard = document.querySelector('#');
    let wkDate = date - day; // require wrap around

    // create <ul> if html does not have

    // get goals in this week
    for (let i = 0; i < daysInWeek; i++) {
        // find daily goals
        let goal = userData[toStr(year)][toStr(mth)][toStr(wkDate)];
        if (goal) {
            goal = goal.goals;

            // create and append <li> for goals to <ul>
        }

        // update date
        date = (date + 1) % getDaysInMth(year, mth);

        // update mth if date wrapped, i.e. date === 1
        if (date === 1) {
            mth = (mth + 1) % mthInYear;
            // update year if month wrapped, i.e. mth === 1
            if (mth === 1) {
                year++;
            }
        }
    }
}

/**
 * Render user's undone monthly goals to Monthly goal section on Homapge
 * @param {*} userData Object of user data
 * @param {*} year current year
 * @param {*} mth current month (1 - 12)
 */
function renderMonthlyGoals(userData, year, mth) {
    // get monthly goals board section - TODO
    const mthGoalBoard = document.querySelector('#TODO');
    let monthGoals = userData[toStr(year)][toStr(mth)].goals;

    let mthGoalList = document.createElement('ul');

    // create and render <li> for undone goals
    for (let key in monthGoals) {
        let goal = monthGoals[key];
        if (!goal.done) {
            mthGoalList.appendChild(createGoalEntry(goal));
        }
    }

    mthGoalBoard.appendChild(mthGoalList);
}

/**
 * Render user's undone yearly goals to Yearly goal section on Homapge
 * @param {*} userData Object of user data
 * @param {*} year current year
 */
function renderYearlyGoals(userData, year) {
    // get yearly board section - TODO
    const yrGoalBoard = document.querySelector('#TODO');
    let yrGoals = userData[toStr(year)].goals;

    let yrGoalList = document.createElement('ul');

    // create and render <li> for undone goals
    for (let key in yrGoals) {
        let goal = yrGoals[key];
        if (!goal.done) {
            yrGoalList.appendChild(createGoalEntry(goal));
        }
    }

    yrGoalBoard.appendChild(yrGoalList);
}

/**
 * Render notes of current day
 * @param {*} userData Object of user data
 * @param {*} year current year
 * @param {*} mth curret month
 * @param {*} date current date
 */
function renderNotes(userData, year, mth, date) {
    let dayObj = userData[toStr(year)][toStr(mth)][toStr(date)];

    if (dayObj) {
        const noteBoard = document.querySelector('#TODO');
        noteBoard.innerText = dayObj.notes;
    }
}

/**
 * Render images to photo album. One image per day
 * @param {Object} userData  Object of user data
 * @param {Number} year current year
 * @param {Number} mth current month (1 - 12)
 * @param {Number} date current date (1 - 31)
 * @param {Number} day current day (0 - 6)
 */
function renderPhotos(userData, year, mth, date, day) {
    let album = document.querySelector('#TODO');
    let wkDate = date - day; // the date of the first day of the week

    for (let i = 0; i < daysInWeek; i++) {
        let dayObj = userData[toStr(year)][toStr(mth)][toStr(wkDate)];

        if (dayObj) {
            let photos = dayObj.photos;
            let keys = Object.keys(photos);

            if (keys.length > 0) {
                let phToRender = photos[keys[0]]; // first photo

                // create <img>
                let img = document.createElement('img');
                img.src = phToRender;

                // haven't implemented image captiono yet
                // the "From Monday 5/20" stuff

                album.appendChild(img);
            }
        }
    }
}

/**
 * Return a <li> element for a goal
 * @param {String | Object} goal name of goal
 * @returns <li> element of the goal
 */
function createGoalEntry(goal) {
    let entry = document.createElement('li');

    if (typeof goal === 'string') {
        // yearly / monthly case
        entry.innerText = goal;
    } else {
        // weekly case
        // recursion to create all subtasks and subsubtasks
        // refer to old codes
    }
    return entry;

    // let entry = document.createElement('goal-entry');
    // entry.setAttribute('goalJSON', JSON.stringify(goalJson));
    // entry.setAttribute('id', goalId);
    // entry.entry = goalJson;
}

/**
 * Get the number of days of the given month. Special case for Febuary
 * if it is a leap year.
 * @param {Number} year year for leap year checking
 * @param {Number} mth month
 */
function getDaysInMth(year, mth) {
    if (mth === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else if (mth === 4 || mth === 6 || mth === 9 || mth === 11) {
        return 30;
    }

    return 31;
}

/**
 * Convert number to string
 * @param {Number} input number to convert to string
 * @returns string of input
 */
function toStr(input) {
    return '' + input;
}

/**
 * Ref: https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript
 * @param {Number} year year to check for leap year
 * @returns boolean
 */
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

/**
 *
 * @param {Object} userData
 */
function settingsListener(userData) {
    // TODO: selector of setting button
    document.querySelector('#settings').addEventListener('click', () => {
        renderSettingPopup(userData);
    });
}

/**
 *
 * @param {Object} userData
 */
function renderSettingPopup(userData) {
    // eslint-disable-next-line
    let theme = userData.theme;
}
