import {
    getCurrentDate,
    getDay,
    getMonthlyGoals,
    getYearlyGoals,
    updateDay,
    updateNote,
} from '../Backend/BackendInit.js';

window.img = new Array(); // used to load image from <input> and draw to canvas
var input = document.getElementById('image-input');
let canvas = document.getElementById('myCanvas');
let canv = canvas.getContext('2d');

// set the header date to the current date
const { day, month, year } = getCurrentDate();
const currDateString = `${month}/${day}/${year}`;
// the space in the template literal below is needed for proper rendering
document.getElementById('date').innerHTML += ` ${currDateString}`;

// set back button
document.getElementById('home').addEventListener('click', () => {
    updateDay(currentDay);
    window.location.replace('../Login/WeeklyOverview/WeeklyOverview.html');
});

// add listener for saving notes
const noteSave = document.getElementById('notes-save');
noteSave.addEventListener('click', () => updateNotes());

let relative = 0;
// Buttons
const save = document.getElementById('save');
const right = document.getElementById('right');
const left = document.getElementById('left');

// store current day data to update when user leaves page
let currentDay;

window.onload = () => {
    // get the day and also the monthly and yearly goals
    requestDay();
    fetchMonthGoals();
    fetchYearGoals();
    setTimeout(() => console.log(currentDay), 500);
};

/**
 * Gets the current day object (and creates one if one doesn't exist)
 * and sets the "currentDay" variable
 * Also renders the days notes and bullets if there are any
 * @returns void
 */
async function requestDay() {
    let currDay = await getDay(currDateString);
    currentDay = currDay;
    if (currDay === undefined) {
        return;
    }

    //Load in bullets
    renderBullets(currDay.bullets);

    // Load in notes
    let newNote = document.createElement('note-box');
    newNote.entry = currDay.notes.content;
    document.querySelector('#notes').appendChild(newNote);

    // Load photos
    let photos = currDay.photos;
    renderPhotos(photos);
}

/**
 * Gets the current month object (and creates one if one doesn't exist)
 * also renders the monthly goals
 * @returns void
 */
async function fetchMonthGoals() {
    // should we comment out these console logs? Bad coding standards to leave them in prod
    let monthObj = await getMonthlyGoals(`${month}/${year}`);
    if (monthObj === undefined) {
        return;
    }

    //load in bullets
    // eslint-disable-next-line no-unused-vars
    for (const [_, goal] of Object.entries(monthObj)) {
        let goalElem = document.createElement('p');
        goalElem.innerHTML = goal.text;
        goalElem.style.wordBreak = 'break-all';
        goalElem.style.overflowX = 'hidden';
        goalElem.style.marginTop = '0';
        goalElem.style.paddingRight = '1vh';
        goalElem.style.fontSize = '1.25vh';
        if (goal.done == true) {
            goalElem.style.textDecoration = 'line-through';
        }
        goalElem.classList.add('month-goal');
        document.querySelector('#monthGoal').appendChild(goalElem);
    }
}

// code for fetchMonth and fetchYear are exactly the same except one does month other does year

/**
 * Gets the current year object (and creates one if one doesn't exist)
 * also renders the yearly goals
 * @returns void
 */
async function fetchYearGoals() {
    let yearObj = await getYearlyGoals(`${year}`);
    if (yearObj === undefined) {
        return;
    }

    //load in bullets
    // eslint-disable-next-line no-unused-vars
    for (const [_, goal] of Object.entries(yearObj)) {
        let goalElem = document.createElement('p');
        goalElem.innerHTML = goal.text;
        goalElem.style.wordBreak = 'break-all';
        goalElem.style.overflowX = 'hidden';
        goalElem.style.marginTop = '0';
        goalElem.style.paddingRight = '1vh';
        goalElem.style.fontSize = '1.25vh';
        if (goal.done == true) {
            goalElem.style.textDecoration = 'line-through';
        }
        goalElem.classList.add('year-goal');
        document.querySelector('#yearGoal').appendChild(goalElem);
    }
}

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let bText = document.querySelector('.entry-form-text').value;
    document.querySelector('.entry-form-text').value = '';
    // get the text in form on a submit, then push an object representing the bullet into our current day
    currentDay.bullets.push({
        text: bText,
        done: false,
        childList: [],
        features: 'normal',
    });

    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

// lets bullet component listen to when a bullet child is added
document.querySelector('#bullets').addEventListener('added', function (e) {
    console.log(e.composedPath());
    // gets the index and json object of the current bullet we want to look at
    let newJson = JSON.parse(e.composedPath()[0].getAttribute('bulletJson'));
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));

    // if 3rd layer of nesting, add it to our children
    if (e.composedPath().length > 7) {
        currentDay.bullets[index[0]].childList[index[1]] = newJson;
    } else {
        currentDay.bullets[index[0]] = newJson;
    }
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    console.log(e.composedPath());
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
    // i don't like this code at all really, it seems very hard-coding and limits our children levels to 2?
    let firstIndex = index[0];
    if (index.length > 1) {
        let secondIndex = index[1];
        if (index.length > 2) {
            let thirdIndex = index[2];
            currentDay.bullets[firstIndex].childList[
                secondIndex
            ].childList.splice(thirdIndex, 1);
        } else {
            currentDay.bullets[firstIndex].childList.splice(secondIndex, 1);
        }
    } else {
        currentDay.bullets.splice(firstIndex, 1);
    }
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    console.log(e.composedPath()[0]);
    let newText = JSON.parse(e.composedPath()[0].getAttribute('bulletJson'))
        .text;
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
    // very similar weird code to 'deleted' directly above
    let firstIndex = index[0];
    if (index.length > 1) {
        let secondIndex = index[1];
        if (index.length > 2) {
            let thirdIndex = index[2];
            currentDay.bullets[firstIndex].childList[secondIndex].childList[
                thirdIndex
            ].text = newText;
        } else {
            currentDay.bullets[firstIndex].childList[
                secondIndex
            ].text = newText;
        }
    } else {
        currentDay.bullets[firstIndex].text = newText;
    }
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    console.log(e.composedPath()[0]);
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
    // same logic as 'deleted' and 'edited' lots of similar code, but is there a way to condense it?
    let firstIndex = index[0];
    if (index.length > 1) {
        let secondIndex = index[1];
        if (index.length > 2) {
            let thirdIndex = index[2];
            currentDay.bullets[firstIndex].childList[secondIndex].childList[
                thirdIndex
            ].done ^= true;
        } else {
            currentDay.bullets[firstIndex].childList[secondIndex].done ^= true;
        }
    } else {
        currentDay.bullets[firstIndex].done ^= true;
    }
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

// lets bullet component listen to when a bullet is clicked category
document.querySelector('#bullets').addEventListener('features', function (e) {
    console.log(e.composedPath()[0]);
    // same logic as before except this time allows a new feature to be added to each index
    let newFeature = JSON.parse(e.composedPath()[0].getAttribute('bulletJson'))
        .features;
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
    let firstIndex = index[0];
    if (index.length > 1) {
        let secondIndex = index[1];
        if (index.length > 2) {
            let thirdIndex = index[2];
            currentDay.bullets[firstIndex].childList[secondIndex].childList[
                thirdIndex
            ].features = newFeature;
        } else {
            currentDay.bullets[firstIndex].childList[
                secondIndex
            ].features = newFeature;
        }
    } else {
        currentDay.bullets[firstIndex].features = newFeature;
    }
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
    updateDay(currentDay);
});

/**
 * Function that renders a list of bullets into the todo area
 * Update currentDay json with updated bullets
 * @param {Object} bullets - a list of bullet objects to render
 */
function renderBullets(bullets) {
    let iNum = 0;
    bullets.forEach((bullet) => {
        let i = [iNum];
        let newPost = document.createElement('bullet-entry');
        newPost.setAttribute('bulletJson', JSON.stringify(bullet));
        newPost.setAttribute('index', JSON.stringify(i));
        newPost.entry = bullet;
        newPost.index = i;
        if ('childList' in bullet && bullet.childList.length != 0) {
            i.push(0);
            bullet.childList.forEach((child) => {
                let newChild = renderChild(child, i);
                newPost.child = newChild;
                i[i.length - 1]++;
            });
            i.pop();
        }
        document.querySelector('#bullets').appendChild(newPost);
        iNum++;
    });
    setTimeout(() => console.log(currentDay), 500);
}

// function processBullet(bullet, i) {
//     let newPost = document.createElement('bullet-entry');
//     newPost.setAttribute('bulletJson', JSON.stringify(bullet));
//     newPost.setAttribute('index', JSON.stringify(i));
//     newPost.entry = bullet;
//     newPost.index = i;
//     if (bullet.childList.length != 0) {
//         i.push(0);
//         bullet.childList.forEach((child) => {
//             let newChild = renderChild(child, i);
//             newPost.child = newChild;
//             i[i.length - 1]++;
//         });
//         i.pop();
//     }
//     return newPost;
// }

/**
 * Function that recursively renders the nested bullets of a given bullet
 * @param {Object} bullet - a bullet object of child to create
 * @param {Number} i -  array of integers of index of bullets
 * @return {Object} new child created
 */
function renderChild(bullet, i) {
    let newChild = document.createElement('bullet-entry');
    newChild.setAttribute('bulletJson', JSON.stringify(bullet));
    newChild.setAttribute('index', JSON.stringify(i));
    newChild.entry = bullet;
    newChild.index = i;
    if ('childList' in bullet && bullet.childList.length != 0) {
        i.push(0);
        bullet.childList.forEach((child) => {
            let newNewChild = renderChild(child, i);
            newChild.child = newNewChild;
            i[i.length - 1]++;
        });
        i.pop();
    }
    return newChild;
}

// eslint-disable-next-line no-unused-vars
function editBullet() {
    let editedEntry = prompt(
        'Edit Bullet',
        this.shadowRoot.querySelector('.bullet-content').innerText
    );
    if (editedEntry != null && editedEntry != '') {
        this.shadowRoot.querySelector(
            '.bullet-content'
        ).innerText = editedEntry;
    }
}

/**
 * Function that updates the notes
 */
function updateNotes() {
    let newNote = document.querySelector('note-box').entry;
    updateNote(currDateString, newNote);
}

input.addEventListener('change', (event) => {
    window.img[relative] = new Image();

    // This allows you to store blob -> base64
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = function () {
        var base64data = reader.result;
        window.img[relative].src = base64data;
    };
});

// Save image and will hide everything else
// REQUIRED TO PRESS SAVE AFTER UPLOAD
save.addEventListener('click', () => {
    let imgDimension = getDimensions(
        canvas.width,
        canvas.height,
        window.img[relative].width,
        window.img[relative].height
    );
    canv.drawImage(
        window.img[relative],
        imgDimension['startX'],
        imgDimension['startY'],
        imgDimension['width'],
        imgDimension['height']
    );

    // Add Item and update whenever save
    currentDay.photos.push(window.img[relative].src);
});

left.addEventListener('click', () => {
    relative -= 1;
    if (relative == -1) {
        relative = window.img.length - 1;
    }
    canv.clearRect(0, 0, canvas.width, canvas.height);
    if (window.img[relative]) {
        var imgDimension = getDimensions(
            canvas.width,
            canvas.height,
            window.img[relative].width,
            window.img[relative].height
        );
        canv.drawImage(
            window.img[relative],
            imgDimension['startX'],
            imgDimension['startY'],
            imgDimension['width'],
            imgDimension['height']
        );
    }
});

right.addEventListener('click', () => {
    relative += 1;
    if (relative == window.img.length) {
        relative = 0;
    }
    canv.clearRect(0, 0, canvas.width, canvas.height);
    if (window.img[relative]) {
        var imgDimension = getDimensions(
            canvas.width,
            canvas.height,
            window.img[relative].width,
            window.img[relative].height
        );
        canv.drawImage(
            window.img[relative],
            imgDimension['startX'],
            imgDimension['startY'],
            imgDimension['width'],
            imgDimension['height']
        );
    }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
    let aspectRatio, height, width, startX, startY;

    // Get the aspect ratio, used so the picture always fits inside the canvas
    aspectRatio = imageWidth / imageHeight;

    // If the aspect ratio is less than 1 it's a vertical image
    if (aspectRatio < 1) {
        // Height is the max possible given the canvas
        height = canvasHeight;
        // Width is then proportional given the height and aspect ratio
        width = canvasHeight * aspectRatio;
        // Start the Y at the top since it's max height, but center the width
        startY = 0;
        startX = (canvasWidth - width) / 2;
        // This is for horizontal images now
    } else {
        // Width is the maximum width possible given the canvas
        width = canvasWidth;
        // Height is then proportional given the width and aspect ratio
        height = canvasWidth / aspectRatio;
        // Start the X at the very left since it's max width, but center the height
        startX = 0;
        startY = (canvasHeight - height) / 2;
    }

    return { width: width, height: height, startX: startX, startY: startY };
}

/**
 * Function that gets photos and renders
 * @param {Object} photos takes in photo object
 * @return nothing
 */
// eslint-disable-next-line no-unused-vars
function renderPhotos(photos) {
    if (photos === undefined) {
        return;
    }

    for (let i = 0; i < photos.length; i++) {
        window.img[i] = new Image();
        window.img[i].src = photos[i];
    }
}
