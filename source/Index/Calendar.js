//alert("extra script loaded");
const target_section = document.getElementById('content');
const yr_start = 2018;
const yr_end = 2025;
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

const day_OV_link = '../DailyOverview/DailyOverview.html';
const month_OV_link = '../MonthlyOverview/MonthlyOverview.html';
const year_OV_link = '../YearlyOverview/YearlyOverview.html';

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    console.log('here is storage session', session);
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
});

/**
 * Dynamically setup page content.
 */
function setupContent() {
    for (let yr = yr_start; yr <= yr_end; yr++) {
        //
        //wrapper
        let year_wrapper = document.createElement('div');
        year_wrapper.id = yr;
        //
        //button group
        let year_nav = document.createElement('div');
        year_nav.classList.add('year');
        year_nav.classList.add('collapsible');
        year_nav.classList.add('horiz');
        //collapse button
        let coll_button = document.createElement('button');
        coll_button.id = yr + '_button';
        coll_button.classList.add('coll_yr_button');
        coll_button.innerText = '>';
        //year link
        let yearlink = document.createElement('a');
        yearlink.classList.add('yearlink');
        yearlink.id = yr + '_link';
        yearlink.href = year_OV_link + '#' + yr;
        yearlink.innerText = yr + ' Yearly Overview';
        //add parts to button group
        year_nav.appendChild(coll_button);
        year_nav.appendChild(yearlink);
        //add button group to wrapper
        year_wrapper.appendChild(year_nav);
        //
        //collapsible child
        let months_div = document.createElement('div');
        months_div.id = yr + '_months';
        months_div.classList.add('collapsible_child');
        //add months
        for (let m = 0; m < months.length; m++) {
            //setup month link
            let month_name_lc = months[m].toLowerCase();
            let month_link = document.createElement('a');
            month_link.class = 'monthlink ' + month_name_lc;
            month_link.id = yr + '_' + month_name_lc;
            month_link.href = month_OV_link + '#' + monthNumber(m) + '/' + yr;
            month_link.innerText = months[m];
            //add this month to list of months
            months_div.appendChild(month_link);
        }

        months_div.style.display = 'none';
        //add collapsible child to wrapper
        year_wrapper.appendChild(months_div);

        //add this year to list of years
        target_section.appendChild(year_wrapper);

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
    var curr_day_number = today.getDate();
    var currMonthNumber = today.getMonth();
    var currYearNumber = today.getFullYear();

    var monthFirstDow = firstDow(currMonthNumber, currYearNumber);

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
    let endDay = daysInMonth(currMonthNumber, currYearNumber);
    console.log('Current month has ' + endDay + ' days');
    //fake days for padding
    //empty tiles for paddding
    for (let i = 0; i < monthFirstDow; i++) {
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
        if (i == curr_day_number) {
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
    for (let i = monthLastDow; i < 7; i++) {
        let blank_day = document.createElement('li');
        blank_day.classList.add('day');
        blank_day.classList.add('blank_day');
        blank_day.innerText = '';
        days_field.appendChild(blank_day);
    }

    calTarget.append(days_field);
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
