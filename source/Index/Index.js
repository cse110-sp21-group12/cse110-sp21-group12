import { db, getUserID } from '../Backend/FirebaseInit.js';
import { ref } from '../Backend/firebase-src/firebase-database.min.js';

const daysInWeek = 7;
const mthInYear = 12;

window.addEventListener('load', () => {
    // check user existence and get user id
    const userId = getUserID();

    let userData;

    // Current date
    const now = new Date(Date.now());
    const currYr = now.getFullYear();
    const currMth = now.getMonth() + 1; //0x or 1x
    const currDate = now.getDate(); // 1 - 31
    const currDay = now.getDay() + 1; // 1 - 7. no prepending 0

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
        });
});

/**
 * Render user's undone monthly goals to Monthly goal section on Homapge
 * @param {Object} userData Object of user data
 * @param {Number} year current year
 * @param {Number} mth current month (1 - 12)
 * @param {Number} date current date (1 - 31)
 * @param {Number} day current day (1 - 7)
 */
function renderWeekPreview(userData, year, mth, date, day) {
    // get weekly preview board - TODO
    // const wkBoard = document.querySelector('#');

    // get goals in this week
    for (let i = day; i <= daysInWeek; i++) {
        // find daily goals
        // let goal = userData[toStr(year)][toStr(mth)][toStr(date)].goals;

        // render on board

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
 * @param {*} year current year (1 - 12)
 * @param {*} mth current month (1 - 31)
 */
function renderMonthlyGoals(userData, year, mth) {
    // get monthly goals board section - TODO
    const mthGoalBoard = document.querySelector('#');
    let monthGoals = userData[toStr(year)][toStr(mth)].goals;

    // create and render <goals-entry> for undone goals
    for (let key in monthGoals) {
        let goal = monthGoals.key;
        if (!goal.done) {
            mthGoalBoard.appendChild(createGoalEntry(goal, key));
        }
    }
}

/**
 * Render user's undone yearly goals to Yearly goal section on Homapge
 * @param {*} userData Object of user data (1 - 12)
 * @param {*} year current year (1 - 31)
 */
function renderYearlyGoals(userData, year) {
    // get yearly board section - TODO
    const yrGoalBoard = document.querySelector('#');
    let yrGoals = userData[toStr(year)].goals;

    // create and render <goals-entry> for undone goals
    for (let key in yrGoals) {
        let goal = yrGoals.key;
        if (!goal.done) {
            yrGoalBoard.appendChild(createGoalEntry(goal, key));
        }
    }
}

/**
 *
 * @param {*} goalJson
 * @param {*} goalId
 * @returns
 */
function createGoalEntry(goalJson, goalId) {
    let entry = document.createElement('goal-entry');
    entry.setAttribute('goalJSON', JSON.stringify(goalJson));
    entry.setAttribute('id', goalId);
    entry.entry = goalJson;

    return entry;
}

/**
 *
 * @param {*} year
 * @param {*} mth
 */
function getDaysInMth(year, mth) {
    if (mth === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else if (mth === 4 || mth === 6 || mth === 9 || mth === 11) {
        return 30;
    }

    return 31;
}

function toStr(input) {
    return '' + input;
}

/**
 * Ref: https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript
 * @param {*} year
 * @returns
 */
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

/**
 *
 * @param {*} userData
 */
// function settingsListener(userData) {
//     // TODO: selector of setting button
//     document.querySelector('#settings').addEventListener('click', () => {
//         renderSettingPopup(userData);
//     });
// }

/**
 *
 * @param {*} userData
 */
// function renderSettingPopup(userData) {}
