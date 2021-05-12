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

const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

/*
    <div id="2020">
        <div class="year" class="collapsible" class="horiz">
            <button id="2020_button" class = "coll_yr_button">></button>
            <a class="yearlink" href = "/year/2020.html">2020</a>
        </div>
        <div id = "2020_months" class = "collapsible_child">
            <h3>January</h3>
            <h3>February</h3>
            <h3>March</h3>
        </div>
    </div>
*/

function setupContent() {
    //alert("Load runs");
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
        yearlink.href = '/year/' + yr + '.html';
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
            month_link.href = 'months/' + yr + '/' + month_name_lc + '.html';
            month_link.innerText = months[m];
            //add this month to list of months
            months_div.appendChild(month_link);
        }

        months_div.style.display = 'none';
        //add collapsible child to wrapper
        year_wrapper.appendChild(months_div);

        //add this year to list of years
        target_section.appendChild(year_wrapper);
    }
}

//dynamically generates calendar for current month
function setupCalendar() {
    const calTarget = document.getElementById('calendar');

    //get today code stolen from stackoverflow
    var today = new Date();
    var curr_day_number = today.getDate();
    var curr_month_number = today.getMonth();
    var curr_year_number = today.getFullYear();

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
    for (let i = 1; i <= endDay; i++) {
        let day = document.createElement('li');
        day.classList.add('day');
        day.innerText = i;

        //check if today (so we can highlight it)
        if (i == curr_day_number) {
            day.classList.add('today');
        }

        days_field.appendChild(day);
    }
    calTarget.append(days_field);
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
    return new Date(year, month, 0).getDate();
}

sleep(100);

/*
document.getElementById("work").addEventListener("click", on_work);
function on_work(){
    //<!-- <script src="script.js" type="module" defer></script> -->
    let main_script = document.createElement("script");
    main_script.src = "script.js";
    main_script.type="module";
    main_script.defer = true;
    document.body.appendChild(main_script);
}
*/

//alert("setup finished");
