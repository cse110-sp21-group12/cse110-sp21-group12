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
    var today = new Date();
    var curr_day_number = today.getDate();
    var curr_month_number = today.getMonth();
    var curr_year_number = today.getFullYear();

    var month_first_dow = firstDow(curr_month_number, curr_year_number);

    //month title on top
    //wrapper
    let month_header = document.createElement('div');
    month_header.classList.add('month_header');
    //text
    let month_label = document.createElement('p');
    month_label.classList.add('month_label');
    month_label.innerText = months[curr_month_number];
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
    let endDay = daysInMonth(curr_month_number, curr_year_number);
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
        if (i == curr_day_number) {
            day.classList.add('today');
        }

        days_field.appendChild(day);

        //link to daily overview
        day.addEventListener('click', () => {
            window.location.href = day_OV_link;
        });
    }
    calTarget.append(days_field);
}

//first day-of-the-week (Sunday 0, Saturday 6) helper function
function firstDow(month, year) {
    return new Date(year, month, 1).getDay();
}

setupCalendar();
