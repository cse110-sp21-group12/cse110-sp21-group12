//alert("extra script loaded");
const targetSection = document.getElementById('content');
const yrStart = 2018;
const yrEnd = 2025;
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

const dayOverviewLink = '../DailyOverview/DailyOverview.html';
const monthOverviewLink = '../MonthlyOverview/MonthlyOverview.html';
const yearOverviewLink = '../YearlyOverview/YearlyOverview.html';

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
});

/**
 * Dynamically setup page content.
 */
function setupContent() {
    for (let yr = yrStart; yr <= yrEnd; yr++) {
        //
        //wrapper
        let yearWrapper = document.createElement('div');
        yearWrapper.id = yr;
        //
        //button group
        let yearNav = document.createElement('div');
        yearNav.classList.add('year');
        yearNav.classList.add('collapsible');
        yearNav.classList.add('horiz');
        //collapse button
        let collButton = document.createElement('button');
        collButton.id = yr + '_button';
        collButton.classList.add('coll_yr_button');
        collButton.innerText = '>';
        //year link
        let yearlink = document.createElement('a');
        yearlink.classList.add('yearlink');
        yearlink.id = yr + '_link';
        yearlink.href = yearOverviewLink + '#' + yr;
        yearlink.innerText = yr + ' Yearly Overview';
        //add parts to button group
        yearNav.appendChild(collButton);
        yearNav.appendChild(yearlink);
        //add button group to wrapper
        yearWrapper.appendChild(yearNav);
        //
        //collapsible child
        let monthsDiv = document.createElement('div');
        monthsDiv.id = yr + '_months';
        monthsDiv.classList.add('collapsible_child');
        //add months
        for (let m = 0; m < months.length; m++) {
            //setup month link
            let monthNameLc = months[m].toLowerCase();
            let monthLink = document.createElement('a');
            monthLink.class = 'monthlink ' + monthNameLc;
            monthLink.id = yr + '_' + monthNameLc;
            monthLink.href =
                monthOverviewLink + '#' + monthNumber(m) + '/' + yr;
            monthLink.innerText = months[m];
            //add this month to list of months
            monthsDiv.appendChild(monthLink);
        }

        monthsDiv.style.display = 'none';
        //add collapsible child to wrapper
        yearWrapper.appendChild(monthsDiv);

        //add this year to list of years
        targetSection.appendChild(yearWrapper);

        var today = new Date();
        var currDay = today.getDate();
        var currMonth = today.getMonth();
        var currYear = today.getFullYear();

        let todayButton = document.getElementById('today-button');
        todayButton.addEventListener('click', () => {
            window.location.href =
                dayOverviewLink +
                '#' +
                monthNumber(currMonth) +
                '/' +
                dayNumber(currDay) +
                '/' +
                currYear;
        });
    }
}

/**
 * Dynamically generate calendar for current month.
 */
function setupCalendar() {
    const calTarget = document.getElementById('calendar');

    //get today code stolen from stackoverflow
    var today = new Date();
    console.log(today);
    var currDayNumber = today.getDate();
    var currMonthNumber = today.getMonth();
    var currYearNumber = today.getFullYear();

    var monthFirstDow = firstDow(currMonthNumber, currYearNumber);

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
    let endDay = daysInMonth(currMonthNumber, currYearNumber);
    console.log('Current month has ' + endDay + ' days');
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
        if (i == currDayNumber) {
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
    for (let i = monthLastDow; i < 7; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('day');
        blankDay.classList.add('blankDay');
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    calTarget.append(daysField);
}

//call setup functions
setupContent();
setupCalendar();

/**
 * Sleep for a set amount of milliseconds - helper function
 * @param {*} ms
 * @returns a Promise object to handle sleeping
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets the number of days in a specified month - helper function
 * @param {*} month
 * @param {*} year
 * @returns
 */
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
