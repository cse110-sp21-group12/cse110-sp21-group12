import {
    getCurrentDate,
    getCurrentWeek,
    getDay,
    getMonthName,
    getMonthlyGoals,
    getYearlyGoals,
} from '../../Backend/BackendInit.js';

/**
 * add a bullet to a specified unordered list
 * @param {Object} bullet - can either be a goals object (with keys text and
 * done) or a bullet object (with keys text, done, features, and possibly
 * childList)
 * @param {HTMLElement} list - the unordered list we add the parsed bullet to
 * @returns void
 */
function appendBulletToList(bullet, list) {
    const newBullet = document.createElement('li');
    newBullet.textContent = bullet.text;

    // if a bullet is marked as completed, add a strikethrough. otherwise,
    // render it normally
    if (bullet.done == true) {
        const strikeThrough = document.createElement('s');
        strikeThrough.appendChild(newBullet);
        list.append(strikeThrough);
    } else {
        list.append(newBullet);
    }

    // if there is a childList containing more bullets, begin rendering
    // the childList and append those bullets to a new unordered-list
    // that is nested under the parent unordered-list
    if ('childList' in bullet) {
        const subList = document.createElement('ul');
        bulletParser(bullet['childList'], subList);
        list.append(subList);
    }

    // TODO: Check for features property?
}

/**
 * recursively build all the bullets for the passed-in bullet list and append
 * the final list into the passed-in list
 * @param {Object} bullets - object that contains the bullet notes for a
 *                           particular day
 * @param {HTMLElement:ul} list - unordered list where bullet elements (li) are
 *                                appended to
 * @returns void
 */
function bulletParser(bullets, list) {
    // eslint-disable-next-line no-unused-vars
    for (const [_, bullet] of Object.entries(bullets)) {
        appendBulletToList(bullet, list);
    }
}

/**
 * load monthly and yearly goals for current month and yearly from db into goal
 * reminder panel
 * @param {Object} currDateObj - Object with string keys day, month, and year
 * @returns void
 */
async function loadGoalReminders(currDateObj) {
    const dbMonthlyGoals = await getMonthlyGoals(
        `${currDateObj.month}/${currDateObj.year}`
    );
    const dbYearlyGoals = await getYearlyGoals(`${currDateObj.year}`);

    // if there are existing goals for the current month
    if (dbMonthlyGoals !== undefined) {
        populateGoalList('monthGoal', dbMonthlyGoals);
    }

    // if there are existing goals for the current year
    if (dbYearlyGoals !== undefined) {
        populateGoalList('yearGoal', dbYearlyGoals);
    }
}

/**
 * load notes for current day from db into notes panel
 * @param {Object} currDateObj - Object with string keys day, month, and year
 * @returns void
 */
async function loadNotes(currDateObj) {
    let newNote = document.createElement('note-box');
    const dateStr = `${currDateObj.month}/${currDateObj.day}/${currDateObj.year}`;
    const currDayObj = await getDay(dateStr);

    // if the current day is not stored in the db or if there are no stored
    // notes, stop loading notes
    if (currDayObj === undefined || !('notes' in currDayObj)) {
        return;
    }

    const todaysNotes = currDayObj.notes;
    document.querySelector('#notes').append(newNote);
    newNote.shadowRoot.querySelector('.noteContent').innerHTML = todaysNotes;
}

/**
 * Loads the current week (7 days worth of data) into the weekly preview
 * @returns void
 */
async function loadWeek() {
    const currWeekList = getCurrentWeek();
    const weekData = {
        Sunday: await getDay(currWeekList[0]),
        Monday: await getDay(currWeekList[1]),
        Tuesday: await getDay(currWeekList[2]),
        Wednesday: await getDay(currWeekList[3]),
        Thursday: await getDay(currWeekList[4]),
        Friday: await getDay(currWeekList[5]),
        Saturday: await getDay(currWeekList[6]),
    };

    const photoList = document.querySelector('.stage');
    const todoList = document.getElementById('weekly_list');
    const days = Object.keys(weekData);

    // iterates through each day and creates list of tasks
    for (let i = 0; i < days.length; i++) {
        const currentDay = weekData[days[i]];
        // if there is no data for the current day in the database
        if (currentDay === undefined) {
            continue;
        }

        // parse and render bullets only if they exist
        if (currentDay.bullets !== undefined) {
            // create the day header
            const header = document.createElement('h2');
            header.textContent = `${days[i]}, ${currentDay.date}`;
            todoList.append(header);

            // load in the day's todos
            bulletParser(currentDay.bullets, todoList);

            // adding separator
            const line = document.createElement('hr');
            todoList.append(line);
        }

        // parse and render photos only if they exist
        if (currentDay.photos !== undefined) {
            // add photos to photo panel
            const photoListEntry = document.createElement('li');
            const photoListEntryCaption = document.createElement('span');
            photoListEntryCaption.innerText = `From ${currentDay.date}`;
            photoListEntry.classList.add('image-wrapper');
            photoListEntry.append(photoListEntryCaption);
            // eslint-disable-next-line no-unused-vars
            for (const [_, base64String] of Object.entries(currentDay.photos)) {
                const photoListEntrySrc = document.createElement('img');
                photoListEntrySrc.src = base64String;
                photoListEntry.append(photoListEntrySrc);
            }
            photoList.append(photoListEntry);
        }
    }
}

/**
 * populate a newly created unordered list by iterating through goals object.
 * This is list is then stored under the HTML element with id goalDivId
 * @param {String} goalDivId - the HTML div id of the goals section
 * @param {} goalsObj - the object we need to parse through and append to a
 *                      newly created unordered list
 * @returns void
 */
function populateGoalList(goalDivId, goalsObj) {
    const goalDiv = document.getElementById(goalDivId);
    const list = document.createElement('ul');

    bulletParser(goalsObj, list);

    goalDiv.append(list);
}

// Open and close Setting container
document.getElementById('header_settings_button').onclick = function () {
    document.getElementById('settings').style.display = 'block';
};
document.getElementById('close-button').onclick = function () {
    document.getElementById('settings').style.display = 'none';
};

// Change background color on select
document.getElementById('themes').addEventListener('change', function (e) {
    document.getElementsByClassName('weekly_column')[0].style.background =
        e.target.value;
    document.getElementsByClassName('monthly_column')[0].style.background =
        e.target.value;
    document.getElementsByClassName('photo_column')[0].style.background =
        e.target.value;
});

// call setup functions
window.onload = () => {
    // make the date header of the page reflect the current date
    const headerDate = document.getElementById('header_date');
    const currDateObj = getCurrentDate();
    headerDate.innerHTML = `${getMonthName(currDateObj.month)} ${
        currDateObj.day
    }, ${currDateObj.year}`;

    // load panels
    loadWeek();
    loadNotes(currDateObj);
    loadGoalReminders(currDateObj);
};
