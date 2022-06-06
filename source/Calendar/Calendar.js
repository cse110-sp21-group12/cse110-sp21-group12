import {
    getCurrentDate,
    getDateObj,
    getMonthObj,
    getYearlyGoals,
    updateMonthlyGoals,
    updateYearlyGoals,
} from '../Backend/BackendInit.js';

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
const dayOVLink = '../DailyOverview/DailyOverview.html';
const yrStart = 2018;
const yrEnd = 2025;

let monthObj;
let yearObj;
let today, paddedDateStr;

let clickFunction, editedFunction, deletedFunction, doneFunction;

window.onload = async () => {
    await setupCalendar();
    // goalListenerSetup(monthObj, '#monthGoal', '#plus-month', (obj) =>
    //     updateMonthlyGoals(obj)
    // );
    // goalListenerSetup(yearObj, '#yearGoal', '#plus-year', (obj) =>
    //     updateYearlyGoals(obj)
    // );
};

window.onclick = function (e) {
    if (!e.target.matches('.calMonthLabel')) {
        var myDropdown = document.getElementById('dropdown');
        if (myDropdown === undefined || myDropdown == null) {
            return;
        }

        if (myDropdown.classList.contains('dropdown-content')) {
            myDropdown.classList.remove('dropdown-content');
            myDropdown.classList.add('show-content');
        }
    }
    if (!e.target.matches('.calYearLabel')) {
        var yearDropdown = document.getElementById('year-dropdown');
        if (yearDropdown === undefined) {
            return;
        }

        if (yearDropdown.classList.contains('dropdown-content')) {
            yearDropdown.classList.remove('dropdown-content');
            yearDropdown.classList.add('show-content');
        }
    }
};

function addGoalListeners() {
    goalListenerSetup(monthObj, '#monthGoal', '#plus-month', (obj) =>
        updateMonthlyGoals(obj)
    );
    goalListenerSetup(yearObj, '#yearGoal', '#plus-year', (obj) =>
        updateYearlyGoals(obj)
    );
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

function goalListenerRemoval(goalDivId, addHeaderId) {
    console.log(`removing goal listeners for ${goalDivId} and ${addHeaderId}`);
    const goals = document.querySelector(goalDivId);
    const addHeader = document.querySelector(addHeaderId);

    addHeader.removeEventListener('click', clickFunction, true);
    goals.removeEventListener('edited', editedFunction, true);
    goals.removeEventListener('deleted', deletedFunction, true);
    goals.removeEventListener('done', doneFunction, true);
}

function goalListenerSetup(goalObj, goalDivId, addHeaderId, callback) {
    console.log(`add goal listeners for ${goalDivId} and ${addHeaderId}`);
    console.log(goalObj);
    const goals = document.querySelector(goalDivId);
    const addHeader = document.querySelector(addHeaderId);

    const getIndexFromEvent = (e) => {
        const index = e.composedPath()[0].getAttribute('index');
        return index;
    };

    clickFunction = function () {
        console.log(goalDivId, addHeaderId, goalObj);
        const newGoalTxt = window.prompt('Enter new goal title');
        if (newGoalTxt === null || newGoalTxt === undefined) {
            return;
        }

        if (!('goals' in goalObj)) {
            goalObj.goals = [];
        }

        goalObj.goals.push({ text: newGoalTxt, done: false });
        callback(goalObj);
        renderGoals(goalObj.goals, goalDivId);
    };

    editedFunction = function (e) {
        const newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson'))
            .text;
        let index = getIndexFromEvent(e);
        goalObj.goals[index].text = newText;
        callback(goalObj);
        renderGoals(goalObj.goals, goalDivId);
    };

    deletedFunction = function (e) {
        let index = getIndexFromEvent(e);
        goalObj.goals.splice(index, 1);
        callback(goalObj);
        renderGoals(goalObj.goals, goalDivId);
    };

    doneFunction = function (e) {
        let index = getIndexFromEvent(e);
        goalObj.goals[index].done ^= true;
        callback(goalObj);
        renderGoals(goalObj.goals, goalDivId);
    };

    addHeader.addEventListener('click', clickFunction);
    goals.addEventListener('edited', editedFunction);
    goals.addEventListener('deleted', deletedFunction);
    goals.addEventListener('done', doneFunction);
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

function removeGoalListeners() {
    goalListenerRemoval('#monthGoal', '#plus-month');
    goalListenerRemoval('#yearGoal', '#plus-year');
}

function renderGoals(goalsList, goalsDivId) {
    const htmlGoalsList = document.querySelector(goalsDivId);
    htmlGoalsList.innerHTML = '';
    if (goalsList !== undefined) {
        for (let i = 0; i < goalsList.length; i++) {
            const newGoal = document.createElement('goals-entry');
            newGoal.setAttribute('goalJson', JSON.stringify(goalsList[i]));
            newGoal.setAttribute('index', JSON.stringify(i));
            newGoal.entry = goalsList[i];
            newGoal.index = i;
            htmlGoalsList.append(newGoal);
        }
    }
}

/**
 * Dynamically generate calendar for current month
 */
async function setupCalendar(dateStr = undefined) {
    const calTarget = document.querySelector('.calendar-div');

    // get today code stolen from stack overflow
    if (dateStr === undefined) {
        today = getCurrentDate();
    } else {
        today = getDateObj(dateStr);
    }

    var month = today.month - 1;
    var paddedMonth = today.month;
    var year = today.year;
    paddedDateStr = `${paddedMonth}/${year}`;

    monthObj = (await getMonthObj(paddedDateStr)) || {};
    monthObj.month = paddedDateStr;
    yearObj = { year: year, goals: (await getYearlyGoals(year)) || [] };
    console.log(monthObj);
    addGoalListeners();
    renderGoals(monthObj.goals, '#monthGoal');
    renderGoals(yearObj.goals, '#yearGoal');

    var monthFirstDow = firstDow(month, year);

    // month title on top
    // the black background for the header
    let monthHeader = document.createElement('div');
    monthHeader.classList.add('calMonthHeader');

    // the month header that when clicked will open dropdown
    let monthLabel = document.createElement('p');
    monthLabel.classList.add('calMonthLabel');
    //the year header that when clicked will open dropdown
    monthLabel.innerText = months[month];

    let yearLabel = document.createElement('p');
    yearLabel.classList.add('calYearLabel');
    yearLabel.innerText = ' ' + year;
    monthLabel.onclick = function () {
        document.getElementById('dropdown').classList.toggle('show-content');
        document
            .getElementById('dropdown')
            .classList.toggle('dropdown-content');
    };
    yearLabel.onclick = function () {
        document
            .getElementById('year-dropdown')
            .classList.toggle('show-content');
        document
            .getElementById('year-dropdown')
            .classList.toggle('dropdown-content');
    };

    // month dropdown
    let monthDropdown = document.createElement('div');
    monthDropdown.classList.add('show-content');
    monthDropdown.id = 'dropdown';
    let monthSelect = document.createElement('ul');
    for (let m = 0; m < months.length; m++) {
        // setup names of months in dropdown
        let monthLink = document.createElement('li');
        monthLink.innerText = months[m];
        monthLink.classList.add('month-link');
        monthLink.onclick = function () {
            monthHeader.remove();
            weekdaysLabel.remove();
            daysField.remove();
            removeGoalListeners();
            setupCalendar(`${year}/${m + 1}`);
        };

        // add this month to list of months
        monthSelect.appendChild(monthLink);
    }

    // dropdown.appendChild(monthSelect);
    monthDropdown.appendChild(monthSelect);

    // year dropdown
    let yearDropdown = document.createElement('div');
    yearDropdown.classList.add('show-content');
    yearDropdown.id = 'year-dropdown';
    let yearSelect = document.createElement('ul');
    for (let y = yrStart; y <= yrEnd; y++) {
        let yearLink = document.createElement('li');
        yearLink.innerText = y;
        yearLink.classList.add('month-link');
        yearLink.onclick = function () {
            monthHeader.remove();
            weekdaysLabel.remove();
            daysField.remove();
            removeGoalListeners();
            setupCalendar(`${y}/${month + 1}`);
        };
        yearSelect.appendChild(yearLink);
    }
    yearDropdown.appendChild(yearSelect);

    monthHeader.appendChild(monthLabel);
    monthHeader.appendChild(yearLabel);
    monthHeader.appendChild(monthDropdown);
    monthHeader.appendChild(yearDropdown);
    calTarget.appendChild(monthHeader);

    // top bar of weekday names
    let weekdaysLabel = document.createElement('ul');
    weekdaysLabel.classList.add('calWeekdaysLabel');
    for (let i = 0; i < weekdays.length; i++) {
        let weekday = document.createElement('li');
        weekday.innerText = weekdays[i];
        weekday.classList.add('calWeekday');
        weekdaysLabel.appendChild(weekday);
    }

    calTarget.appendChild(weekdaysLabel);

    // all the little days
    let daysField = document.createElement('ul');
    daysField.classList.add('calDaysField');
    let endDay = daysInMonth(month, year);

    // fake days for padding
    // empty tiles for padding
    for (let i = 0; i < monthFirstDow; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('calDay');
        blankDay.classList.add('calBlankDay');
        blankDay.style.cursor = 'default';
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    let current = new Date();
    // real days
    for (let i = 1; i <= endDay; i++) {
        let day = document.createElement('a');
        day.classList.add('calDay');
        day.innerText = i;
        // link to daily overview
        const mm = monthNumber(month);
        const dd = dayNumber(i);
        const yr = year;
        const href = `${dayOVLink}?date=${yr}/${mm}/${dd}`;
        day.addEventListener('click', () => {
            window.location.href = href;
        });
        // check if today (so we can highlight it)
        if (
            i == current.getDate() &&
            current.getMonth() == month &&
            current.getFullYear() == year
        ) {
            day.classList.add('calToday');
        }

        let dayNotes = document.createElement('div');
        dayNotes.classList.add('day-notes');
        if (dd in monthObj && 'bullets' in monthObj[dd]) {
            const numTasks = monthObj[dd].bullets.length;
            if (numTasks == 1) {
                dayNotes.innerText = `${numTasks} Task`;
            } else {
                dayNotes.innerText = `${numTasks} Tasks`;
            }
        }

        day.appendChild(dayNotes);

        daysField.appendChild(day);
    }

    // pad with more fake days at the end
    let monthLastDow = lastDow(month, year);
    for (let i = monthLastDow; i < 6 && i >= 0; i++) {
        let blankDay = document.createElement('li');
        blankDay.classList.add('calDay');
        blankDay.classList.add('calBlankDay');
        blankDay.style.cursor = 'default';
        blankDay.innerText = '';
        daysField.appendChild(blankDay);
    }

    calTarget.append(daysField);
}

/**
 * Sleep for a set amount of milliseconds - helper function
 * @param {*} ms
 * @returns a Promise object to handle sleeping
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

sleep(100);
