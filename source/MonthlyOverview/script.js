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

// mock data of list of goals to render
let mockGoals = [
    { text: 'O, Wonder! ', symb: '•', done: true },
    {
        text: 'How many goodly creatures are there here! ',
        symb: '•',
    },
    { text: 'How beateous mankind is! ', symb: '•' },
    {
        text: "O brave new world, That has such people in't!",
        symb: '•',
    },
];

document.getElementById('button').addEventListener('click', () => {
    //on click, render each element and append to the goals section
    renderGoals(mockGoals);
});

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;
    let goal = { text: gText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    renderGoals([goal]);
});

/**
 * Function that renders a list of goals into the todo area
 * @param {Object} a list of goal objects
 */
function renderGoals(goals) {
    goals.forEach((goal) => {
        let newPost = document.createElement('goals-entry');
        newPost.entry = goal;
        document.querySelector('#goals').appendChild(newPost);
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
        var today = new Date();
        var currDay = today.getDate();
        if (i == dayNumber(currDay)) {
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

//set back button
document.getElementById('index').children[0].href +=
    '#' + currentMonth.substring(3);
