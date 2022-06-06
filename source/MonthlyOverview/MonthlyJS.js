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
console.log(currentMonth);

let currentMonthRes;

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    console.log('here is storage session', session);
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        console.log('database connected');
        setDB(e.target.result);
        let req = getMonthlyGoals(currentMonth);
        req.onsuccess = function (e) {
            console.log('got month');
            console.log(e.target.result);
            currentMonthRes = e.target.result;
            if (currentMonthRes === undefined) {
                currentMonthRes = initMonth(currentMonth);
                createMonthlyGoals(currentMonthRes);
            } else {
                //Load in bullets
                let goals = currentMonthRes.goals;
                renderGoals(goals);
            }
        };
        let settingsReq = getSettings();
        settingsReq.onsuccess = function (e) {
            let settingObj = e.target.result;
            console.log('setting initial theme');
            document.documentElement.style.setProperty(
                '--bg-color',
                settingObj.theme
            );
        };
    };

    setYearlyOverviewLink();
});

/**
 * Sets the YearlyOverview link to say '<year> Overview' so that users
 * clearly know what YearlyOverview they are going to from MonthlyOverview page
 * @returns void
 */
function setYearlyOverviewLink() {
    // get the YearlyOverview link in the top left corner
    let yearlyOverviewLink = document.querySelector('#back');
    // set the link to be to the year of the current MonthlyOverview
    const year = currentMonth.substring(currentMonth.indexOf('/') + 1);
    yearlyOverviewLink.href += '#' + year;
    // set link text
    yearlyOverviewLink.textContent = `${year} Overview`;
}

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;

    document.querySelector('.entry-form-text').value = '';
    currentMonthRes.goals.push({
        text: gText,
        done: false,
    });
    console.log(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
    updateMonthlyGoals(currentMonthRes);
});

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    console.log('got event');
    console.log(e.composedPath());
    let index = e.composedPath()[0].getAttribute('index');
    currentMonthRes.goals.splice(index, 1);
    updateMonthlyGoals(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    console.log('got event');
    console.log(e.composedPath()[0]);
    let newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson')).text;
    let index = e.composedPath()[0].getAttribute('index');
    currentMonthRes.goals[index].text = newText;
    updateMonthlyGoals(currentMonthRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentMonthRes.goals);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    console.log('got done event');
    console.log(e.composedPath()[0]);
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
        console.log(newPost);
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
const day_OV_link = '../DailyOverview/DailyOverview.html';

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

/**
 * dynamically generates calendar for current month
 */
function setupCalendar() {
    const calTarget = document.getElementById('calendar');

    //get today code stolen from stackoverflow
    // var today = new Date();
    let thisDate = new Date(
        currentMonth.substring(3) +
            '-' +
            currentMonth.substring(0, 2) +
            '-03T00:00:00.000-07:00'
    );
    //thisDate = new Date('2021-05-23');
    console.log(currentMonth.substring(0, 2));
    console.log(thisDate);

    //var curr_day_number = today.getDate();
    let currMonthNumber = thisDate.getMonth();
    let currYearNumber = thisDate.getFullYear();

    let month_first_dow = firstDow(currMonthNumber, currYearNumber);

    //month title on top
    //wrapper
    let month_header = document.createElement('div');
    month_header.classList.add('month_header');
    //text
    let month_label = document.createElement('p');
    month_label.classList.add('month_label');
    month_label.innerText = months[currMonthNumber];
    month_header.appendChild(month_label);
    calTarget.appendChild(month_header);

    //top bar of weekday names
    let weekdays_label = document.createElement('ul');
    weekdays_label.classList.add('weekdays_label');
    for (let i = 0; i < weekdays.length; i++) {
        let weekday = document.createElement('li');
        weekday.innerText = weekdays[i];
        weekday.classList.add('weekday');
        weekdays_label.appendChild(weekday);
    }
    calTarget.appendChild(weekdays_label);

    //all the little days
    let days_field = document.createElement('ul');
    days_field.classList.add('days_field');
    let endDay = daysInMonth(currMonthNumber + 1, currYearNumber);
    console.log('Current month has ' + endDay + ' days');
    //fake days for padding
    //empty tiles for paddding
    for (let i = 0; i < month_first_dow; i++) {
        let blank_day = document.createElement('li');
        blank_day.classList.add('day');
        blank_day.classList.add('blank_day');
        blank_day.innerText = '';
        days_field.appendChild(blank_day);
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

        days_field.appendChild(day);

        //link to daily overview
        day.addEventListener('click', () => {
            window.location.href =
                day_OV_link +
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
        let blank_day = document.createElement('li');
        blank_day.classList.add('day');
        blank_day.classList.add('blank_day');
        blank_day.innerText = '';
        days_field.appendChild(blank_day);
    }

    calTarget.append(days_field);
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

/**
 * check if the form is empty. If it is, return true. If not, return false.
 * @returns whether the form is valid or not
 */
function checkForm() {
    if (document.querySelector('.entry-form-text').value === '') {
        alert('Please enter a goal');
        return false;
    } else {
        return true;
    }
}

window.checkForm = checkForm;
