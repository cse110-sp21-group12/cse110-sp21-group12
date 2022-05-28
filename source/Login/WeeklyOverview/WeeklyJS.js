import {
    createDay,
    getCurrentWeek,
    getDay,
} from '../../Backend/BackendInit.js';
import mockJson from '../../Backend/updatedMockData.js';

/**
 * Loads the next 7 days worth of data into the weekly preview
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

function bulletParser(bullets, list) {
    // eslint-disable-next-line no-unused-vars
    for (const [_, bullet] of Object.entries(bullets)) {
        const todoBullet = document.createElement('li');
        todoBullet.textContent = bullet.text;

        if (bullet.done == true) {
            const strikeThrough = document.createElement('s');
            strikeThrough.appendChild(todoBullet);
            list.append(strikeThrough);
        } else {
            list.append(todoBullet);
        }

        if ('childList' in bullet) {
            const subList = document.createElement('ul');
            bulletParser(bullet['childList'], subList);
            list.append(subList);
        }
    }
}

function loadNotes() {
    let newNote = document.createElement('note-box');
    document.querySelector('#notes').appendChild(newNote);
}

// call setup functions
window.onload = () => {
    loadWeek(getCurrentWeek());
    loadNotes();

    const addDay = document.getElementById('add-day');

    addDay.addEventListener('click', () =>
        createDay(mockJson['days object store'])
    );
};
