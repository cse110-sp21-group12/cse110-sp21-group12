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
/* TODO: link calendar to other pages (make calendar clickable)
const dayOVLink = '../DailyOverview/DailyOverview.html';
const monthOVLink = '../MonthlyOverview/MonthlyOverview.html';
const yearOVLink = '../YearlyOverview/YearlyOverview.html';
*/
const dayOVLink = '../../DailyOverview/DailyOverview.html';

// TODO: login check(?) considering OOP, it doesn't make sense for
//       calendar to check this
/*window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    console.log('here is storage session', session);
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
});*/

/**
 * Dynamically setup page content
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
        // eslint-disable-next-line
        yearlink.href = yearOVLink + '#' + yr;
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
            // eslint-disable-next-line
            monthLink.href = monthOVLink + '#' + monthNumber(m) + '/' + yr;
            monthLink.innerText = months[m];
            //add this month to list of months
            monthsDiv.appendChild(monthLink);
        }

        monthsDiv.style.display = 'none';
        //add collapsible child to wrapper
        yearWrapper.appendChild(monthsDiv);

        //add this year to list of years
        targetSection.appendChild(yearWrapper);

        // var today = new Date();
        // var currDay = today.getDate();
        // var currMonth = today.getMonth();
        // var currYear = today.getFullYear();

        // let todayButton = document.getElementById('today-button');
        /* TODO: clickable button needs to link to another page (see above)
        todayButton.addEventListener('click', () => {
            window.location.href =
                dayOVLink +
                '#' +
                monthNumber(currMonth) +
                '/' +
                dayNumber(currDay) +
                '/' +
                currYear;
        });
        */
    }
}

/**
 * Dynamically generate calendar for current month
 */
function setupCalendar(date) {
    const calTarget = document.querySelector('.calendar-div');

    //get today code stolen from stackoverflow
    var today = date;
    console.log(today);
    // var currDayNumber = today.getDate();
    var currMonthNumber = today.getMonth();
    var currYearNumber = today.getFullYear();

    var monthFirstDow = firstDow(currMonthNumber, currYearNumber);

    //month title on top
    //the black background for the header
    let monthHeader = document.createElement('div');
    monthHeader.classList.add('calMonthHeader');
    //the text in the header
    let monthLabel = document.createElement('p');
    monthLabel.classList.add('calMonthLabel');
    monthLabel.innerText = months[currMonthNumber] + ' ' + currYearNumber;
    //dropdown arrow
    let dropBtn = document.createElement('button');
    dropBtn.classList.add('calDropBtn');
    let dropIcon = document.createElement('i');
    dropIcon.classList.add('fa', 'fa-caret-down');
    dropBtn.appendChild(dropIcon);
    dropBtn.onclick = function () {
        document.getElementById('dropdown').classList.toggle('show-content');
        document
            .getElementById('dropdown')
            .classList.toggle('dropdown-content');
    };
    let dropdown = document.createElement('div');
    dropdown.classList.add('show-content');
    dropdown.id = 'dropdown';
    let monthSelect = document.createElement('ul');
    for (let m = 0; m < months.length; m++) {
        //setup names of months in dropdown
        let monthLink = document.createElement('li');
        monthLink.innerText = months[m];
        monthLink.classList.add('month-link');
        monthLink.onclick = function () {
            monthHeader.remove();
            weekdaysLabel.remove();
            daysField.remove();
            setupCalendar(new Date(2022, m));
        };
        //add this month to list of months
        monthSelect.appendChild(monthLink);
    }
    dropdown.appendChild(monthSelect);
    monthHeader.appendChild(monthLabel);
    monthHeader.appendChild(dropBtn);
    monthHeader.appendChild(dropdown);
    calTarget.appendChild(monthHeader);

    //top bar of weekday names
    let weekdaysLabel = document.createElement('ul');
    weekdaysLabel.classList.add('calWeekdaysLabel');
    for (let i = 0; i < weekdays.length; i++) {
        let weekday = document.createElement('li');
        weekday.innerText = weekdays[i];
        weekday.classList.add('calWeekday');
        weekdaysLabel.appendChild(weekday);
    }
    calTarget.appendChild(weekdaysLabel);

    //all the little days
    let daysField = document.createElement('ul');
    daysField.classList.add('calDaysField');
    let endDay = daysInMonth(currMonthNumber, currYearNumber);
    console.log('Current month has ' + endDay + ' days');
    //fake days for padding
    //empty tiles for paddding
    for (let i = 0; i < monthFirstDow; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('calDay');
        blankDay.classList.add('calBlankDay');
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    let current = new Date();
    //real days
    for (let i = 1; i <= endDay; i++) {
        let day = document.createElement('a');
        day.classList.add('calDay');
        day.innerText = i;
        //link to daily overview
        day.addEventListener('click', () => {
            window.location.href =
                dayOVLink +
                '?date=' +
                monthNumber(currMonthNumber) +
                '/' +
                //convert day number into a string
                dayNumber(i) +
                '/' +
                currYearNumber;
        });
        //check if today (so we can highlight it)
        if (i == current.getDate() && current.getMonth() == currMonthNumber) {
            day.classList.add('calToday');
        }

        let dayNotes = document.createElement('div');
        dayNotes.classList.add('day-notes');
        dayNotes.innerText = '3 Tasks';
        day.appendChild(dayNotes);

        daysField.appendChild(day);
    }

    //pad with more fake days at the end
    let monthLastDow = lastDow(currMonthNumber, currYearNumber);
    console.log(monthLastDow);
    for (let i = monthLastDow; i < 6 && i >= 0; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('calDay');
        blankDay.classList.add('calBlankDay');
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    calTarget.append(daysField);

    let plusMonth = document.getElementById('plus-month');
    let plusYear = document.getElementById('plus-year');
    // plusMonth.onclick = function () {
    //     document
    //         .getElementById('month-form')
    //         .classList.toggle('entry-form-hide');
    //     document.getElementById('month-form').classList.toggle('entry-form');
    // };
    // plusYear.onclick = function () {
    //     document
    //         .getElementById('year-form')
    //         .classList.toggle('entry-form-hide');
    //     document.getElementById('year-form').classList.toggle('entry-form');
    // };
    plusMonth.onclick = function () {
        window.prompt('Enter new note');
    };
    plusYear.onclick = function () {
        window.prompt('Enter new note');
    };
}

window.addEventListener('load', setupContent);
window.addEventListener('load', setupCalendar(new Date()));

window.onclick = function (e) {
    if (!e.target.matches('.fa-caret-down')) {
        console.log(e.target);
        var myDropdown = document.getElementById('dropdown');
        if (myDropdown.classList.contains('dropdown-content')) {
            myDropdown.classList.remove('dropdown-content');
            myDropdown.classList.add('show-content');
        }
    }
};

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
