/* eslint-disable no-undef */
//get the desired month
let myLocation = window.location.href;
let currentMonth = myLocation.substring(
    myLocation.length - 7,
    myLocation.length
);
//default case
if (currentMonth == 'ew.html') {
    currentMonth = '05/2021';
}

let currentMonthRes;

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    // let session = window.sessionStorage;
    // console.log('here is storage session', session);
    // if (session.getItem('loggedIn') !== 'true') {
    //     window.location.href = '../Login/Login.html';
    // }
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        setDB(e.target.result);
        let req = getMonthlyGoals(currentMonth);
        req.onsuccess = function (e) {
            currentMonthRes = e.target.result;
            if (currentMonthRes === undefined) {
                // creates a month object which will be used to create a blank template of monthly goals
                currentMonthRes = initMonth(currentMonth);
                createMonthlyGoals(currentMonthRes);
            } else {
                //Load in bullets
                let goals = currentMonthRes.goals;
                renderGoals(goals);
            }
        };
        // gets the users preferred settings and switches the theme to match their stated preference
        let settingsReq = getSettings();
        settingsReq.onsuccess = function (e) {
            let settingObj = e.target.result;
            document.documentElement.style.setProperty(
                '--bg-color',
                settingObj.theme
            );
        };
    };
});

// creates a form for entering the text for monthly goals and will create a list of them and update in database accordingly
document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;

    document.querySelector('.entry-form-text').value = '';
    currentMonthRes.goals.push({
        text: gText,
        done: false,
    });
    document.querySelector('#bullets').innerHTML = '';
    // turns the goals from text into bullets
    renderGoals(currentMonthRes.goals);
    // updates the goals in the database
    updateMonthlyGoals(currentMonthRes);
});

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    // potentially bad console logs that is used for debugging and should be
    // deleted when finished
    let index = e.composedPath()[0].getAttribute('index');
    currentMonthRes.goals.splice(index, 1);
    updateMonthlyGoals(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    let newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson')).text;
    let index = e.composedPath()[0].getAttribute('index');
    currentMonthRes.goals[index].text = newText;
    updateMonthlyGoals(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    let index = e.composedPath()[0].getAttribute('index');
    currentMonthRes.goals[index].done ^= true;
    updateMonthlyGoals(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
});

/**
 * Function that renders a list of goals into the todo area
 * @param {Object} a list of goal objects
 */
function renderGoals(goals) {
    let i = 0;
    goals.forEach((goal) => {
        let newPost = document.createElement('goals-entry');
        newPost.setAttribute('goalJson', JSON.stringify(goal));
        newPost.setAttribute('index', i);
        newPost.entry = goal;
        document.querySelector('#bullets').appendChild(newPost);
        i++;
    });
}
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//link to daily overview
const dayOverviewLink = '../DailyOverview/DailyOverview.html';

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

/**
 * dynamically generates calendar for current month
 */
function setupCalendar() {
    const calTarget = document.getElementById('calendar');

    // get today code stolen from stack overflow
    // var today = new Date();
    let thisDate = new Date(
        currentMonth.substring(3) +
            '-' +
            currentMonth.substring(0, 2) +
            '-03T00:00:00.000-07:00'
    );

    //var curr_day_number = today.getDate();
    let currMonthNumber = thisDate.getMonth();
    let currYearNumber = thisDate.getFullYear();

    let monthFirstDow = firstDow(currMonthNumber, currYearNumber);

    //month title on top
    //wrapper
    let monthHeader = document.createElement('div');
    monthHeader.classList.add('monthHeader');
    //text
    let monthLabel = document.createElement('p');
    monthLabel.classList.add('monthLabel');
    monthLabel.innerText = months[currMonthNumber];
    monthHeader.appendChild(monthLabel);
    calTarget.appendChild(monthHeader);

    //top bar of weekday names
    let weekdaysLabel = document.createElement('ul');
    weekdaysLabel.classList.add('weekdaysLabel');
    for (let i = 0; i < weekdays.length; i++) {
        let weekday = document.createElement('li');
        weekday.innerText = weekdays[i];
        weekday.classList.add('weekday');
        weekdaysLabel.appendChild(weekday);
    }
    calTarget.appendChild(weekdaysLabel);

    //all the little days
    let daysField = document.createElement('ul');
    daysField.classList.add('daysField');
    let endDay = daysInMonth(currMonthNumber + 1, currYearNumber);
    //fake days for padding
    //empty tiles for paddding
    for (let i = 0; i < monthFirstDow; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('day');
        blankDay.classList.add('blankDay');
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    //real days
    for (let i = 1; i <= endDay; i++) {
        let day = document.createElement('li');
        day.classList.add('day');
        day.innerText = i;

        //check if today (so we can highlight it)
        // if (i == curr_day_number) {
        //     day.classList.add('today');
        // }

        // check if today so we can highlight it
        let today = new Date();
        let currDay = today.getDate();
        let currMonth = today.getMonth();
        let currYear = today.getFullYear();

        if (
            i == dayNumber(currDay) &&
            currMonth == currMonthNumber &&
            currYear == currYearNumber
        ) {
            day.classList.add('today');
        }

        daysField.appendChild(day);

        //link to daily overview
        day.addEventListener('click', () => {
            window.location.href =
                dayOverviewLink +
                '#' +
                monthNumber(currMonthNumber) +
                '/' +
                //convert day number into a string
                dayNumber(i) +
                '/' +
                currYearNumber;
        });
    }

    //pad with more fake days at the end
    let monthLastDow = lastDow(currMonthNumber, currYearNumber);
    for (let i = monthLastDow; i < 6; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('day');
        blankDay.classList.add('blankDay');
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    calTarget.append(daysField);
}

//

/**
 * first day-of-the-week (Sunday 0, Saturday 6) helper function
 * @param {*} month
 * @param {*} year
 * @returns the day of the week of the first day in this month (Sunday 0, Saturday 6)
 */
function firstDow(month, year) {
    return new Date(year, month, 1).getDay();
}

/**
 * last day-of-the-week (Sunday 0, Saturday 6) helper function
 * @param {*} month
 * @param {*} year
 * @returns the day of the week of the last day in this month (Sunday 0, Saturday 6)
 */
function lastDow(month, year) {
    return new Date(year, month + 1, 1).getDay() - 1;
}

setupCalendar();

/**
 * Formats the month number
 * @param {*} month zero-indexed month integer, like 1 for February
 * @returns a month number string like "02" for February
 */
function monthNumber(month) {
    if (month > 8) {
        return '' + (month + 1);
    } else {
        return '0' + (month + 1);
    }
}

/**
 * Formats the day number
 * @param {*} day one-indexed day integer
 * @returns a day number string like "22" for 22nd day of month
 */
function dayNumber(day) {
    if (day > 9) {
        return '' + day;
    } else {
        return '0' + day;
    }
}

//set back button
document.getElementById('index').children[0].href +=
    '#' + currentMonth.substring(3);
