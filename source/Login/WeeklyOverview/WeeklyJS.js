/**
 * Gets the current day object (and creates one if one doesn't exist)
 * and sets the "currentDay" variable
 * Also renders the days notes and bullets if there are any
 * @returns void
 */
// function requestDay () {
//     let req = getDay(currentDateStr);
//     req.onsuccess = function (e) {
//         console.log('got day');
//         console.log(e.target.result);
//         currentDay = e.target.result;
//         if (currentDay === undefined) {
//             currentDay = initDay(currentDateStr);
//             createDay(currentDay);
//             let newNote = document.createElement('note-box');
//             document.querySelector('#notes').appendChild(newNote);
//         } else {
//             //Load in bullets
//             let bullets = currentDay.bullets;
//             renderBullets(bullets);
//             // Load in notes
//             let newNote = document.createElement('note-box');
//             newNote.entry = currentDay.notes;
//             document.querySelector('#notes').appendChild(newNote);

//             // Load photos
//             let photos = currentDay.photos;
//             renderPhotos(photos);
//         }
//     };
// }
/**
 * Loads the next 7 days worth of data into the weekly preview
 * @returns void
 */
function loadWeek() {
    var weekData = {
        monday: ['task 1', 'task 2', 'task 3', 'task 4'],
        tuesday: ['task 1', 'task 2', 'task 3', 'task 4'],
        wednesday: ['task 1', 'task 2', 'task 3', 'task 4'],
        thursday: ['task 1', 'task 2', 'task 3', 'task 4'],
        friday: ['task 1', 'task 2', 'task 3', 'task 4'],
    };

    // expects weekData in the form { 'day_of_week' : ['task 1', 'task 2', ...] }
    var todoList = document.getElementById('weekly_list');
    var days = Object.keys(weekData);

    // iterates through each day and creates list of tasks
    for (var i = 0; i < days.length; i++) {
        var currentDay = weekData[days[i]];

        // create the day header
        var header = document.createElement('h2');
        header.textContent = days[i];
        todoList.append(header);

        // load in the day's todos
        for (var j = 0; j < currentDay.length; j++) {
            var todoBullet = document.createElement('li');
            todoBullet.textContent = currentDay[j];
            todoList.append(todoBullet);
        }

        // adding separator
        var line = document.createElement('hr');
        todoList.append(line);
    }
}

function loadNotes() {
    let newNote = document.createElement('note-box');
    document.querySelector('#notes').appendChild(newNote);
}
//call setup functions
window.addEventListener('load', loadWeek);
window.addEventListener('load', loadNotes);


document.getElementById("header_settings_button").onclick = function(){document.getElementById("settings").style.display = "block";}
document.getElementById("close-button").onclick = function(){document.getElementById("settings").style.display = "none";}
