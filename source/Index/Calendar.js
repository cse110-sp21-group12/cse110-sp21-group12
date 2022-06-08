//alert("extra script loaded");
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

//const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const day_OV_link = '../DailyOverview/DailyOverview.html';

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    console.log('here is storage session', session);
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
});

function setupContent() {
    //set up the Today button
    var today = new Date();
    var currDay = today.getDate();
    var currMonth = today.getMonth();
    var currYear = today.getFullYear();

    let todayButton = document.getElementById('today-button');
    todayButton.addEventListener('click', () => {
        window.location.href =
            day_OV_link +
            '#' +
            monthNumber(currMonth) +
            '/' +
            dayNumber(currDay) +
            '/' +
            currYear;
    });

    //set up clickability for the year links
}

//dynamically generates calendar for current month
function setupCalendar() {
    //get today code stolen from stackoverflow
    var today = new Date();
    console.log(today);
    var curr_day_number = today.getDate();
    var currMonthNumber = today.getMonth();
    var currYearNumber = today.getFullYear();

    var monthFirstDow = firstDow(currMonthNumber, currYearNumber);

    //month title on top
    //wrapper
    //let month_header = document.getElementById('month_header');
    let month_label = document.getElementById('month_label');
    month_label.innerText = months[currMonthNumber];

    let days_field = document.getElementById('days_field');
    let endDay = daysInMonth(currMonthNumber, currYearNumber);
    console.log('Current month has ' + endDay + ' days');
    //fake days for padding
    //empty tiles for paddding
    let i = 0;
    for (i; i < monthFirstDow; i++) {
        let blank_day = days_field.children[i];
        blank_day.classList.add('blank_day');
        blank_day.innerText = '';
    }

    //real days
    for (i; i <= monthFirstDow + endDay - 1; i++) {
        let date = i - monthFirstDow + 1;
        let day = days_field.children[i];
        day.innerText = date;

        //check if today (so we can highlight it)
        if (date == curr_day_number) {
            day.classList.add('today');
        }
        //link to daily overview
        day.addEventListener('click', () => {
            window.location.href =
                day_OV_link +
                '#' +
                monthNumber(currMonthNumber) +
                '/' +
                //convert day number into a string
                dayNumber(date) +
                '/' +
                currYearNumber;
        });
    }

    //pad with more fake days at the end
    let monthLastDow = lastDow(currMonthNumber, currYearNumber);
    for (i; i < monthFirstDow + endDay + (6 - monthLastDow); i++) {
        let blank_day = days_field.children[i];
        blank_day.classList.add('blank_day');
    }
}

//call setup functions
setupContent();
setupCalendar();

//sleep
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//days-in-month helper function
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

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

sleep(100);
