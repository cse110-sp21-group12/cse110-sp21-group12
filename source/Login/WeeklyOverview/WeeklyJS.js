import {
    getCurrentDate,
    getCurrentWeek,
    getDay,
} from '../../Backend/BackendInit.js';

/**
 * Loads the current week (7 days worth of data) into the weekly preview
 * @returns void
 */
async function loadWeek(currWeekList) {
    const weekData = {
        Sunday: await getDay(currWeekList[0]),
        Monday: await getDay(currWeekList[1]),
        Tuesday: await getDay(currWeekList[2]),
        Wednesday: await getDay(currWeekList[3]),
        Thursday: await getDay(currWeekList[4]),
        Friday: await getDay(currWeekList[5]),
        Saturday: await getDay(currWeekList[6]),
    };

    const todoList = document.getElementById('weekly_list');
    const days = Object.keys(weekData);

    // iterates through each day and creates list of tasks
    for (let i = 0; i < days.length; i++) {
        const currentDay = weekData[days[i]];
        // if there is no data for the current day in the database
        if (currentDay === undefined) {
            continue;
        }

        // create the day header
        const header = document.createElement('h2');
        header.textContent = `${days[i]}, ${currentDay.date}`;
        todoList.append(header);

        // load in the day's todos
        bulletParser(currentDay.bullets, todoList);
    }

    // adding separator
    const line = document.createElement('hr');
    todoList.append(line);
}

/**
 * recursively build all the bullets for the passed-in bullet list and append
 * the final list into the passed-in list
 * @param {Object} bullets - object that contains the bullet notes for a
 *                           particular day
 * @param {HTMLElement:ul} list - unordered list where bullet elements (li) are
 *                                appended to
 */
function bulletParser(bullets, list) {
    // eslint-disable-next-line no-unused-vars
    for (const [_, bullet] of Object.entries(bullets)) {
        const todoBullet = document.createElement('li');
        todoBullet.textContent = bullet.text;

        // if a bullet is marked as completed, add a strikethrough. otherwise,
        // render it normally
        if (bullet.done == true) {
            const strikeThrough = document.createElement('s');
            strikeThrough.appendChild(todoBullet);
            list.append(strikeThrough);
        } else {
            list.append(todoBullet);
        }

        // if there is a childList containing more bullets, begin rendering
        // the childList and append those bullets to a new unordered-list
        // that is nested under the parent unordered-list
        if ('childList' in bullet) {
            const subList = document.createElement('ul');
            bulletParser(bullet['childList'], subList);
            list.append(subList);
        }
    }
}

async function loadNotes() {
    let newNote = document.createElement('note-box');
    const currDateObj = getCurrentDate();
    const dateStr = `${currDateObj.month}/${currDateObj.day}/${currDateObj.year}`;
    const currDayObj = await getDay(dateStr);
    const todaysNotes = currDayObj.notes;
    document.querySelector('#notes').append(newNote);
    newNote.shadowRoot.querySelector('.noteContent').innerHTML = todaysNotes;
}

// call setup functions
window.onload = () => {
    loadWeek(getCurrentWeek());
    loadNotes();
};
