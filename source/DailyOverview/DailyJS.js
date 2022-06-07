/* eslint-disable no-undef */
//since all backend API calls are unknown to eslint, just disabeling no-undef
window.img = new Array(); // used to load image from <input> and draw to canvas
var input = document.getElementById('image-input');
let canvas = document.getElementById('photoCanvas');
let canv = canvas.getContext('2d');

//get the desired mm/dd/yyyy string
let myLocation = window.location.href;
let currentDateStr = myLocation.substring(
    myLocation.length - 10,
    myLocation.length
);

const PAGE_404 = '../404/404.html';
let relative = 0;
// Buttons
const add = document.getElementById('addPhoto');
const del = document.getElementById('deletePhoto');
const cancel = document.getElementById('cancel');
const save = document.getElementById('save');
const right = document.getElementById('right');
const left = document.getElementById('left');
const LENGTH_OF_YEAR_NUMBER = -4;
const monthNames = [
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

// store current day data to update when user leaves page
let currentDay;

window.addEventListener('load', () => {
    // validate the URL date
    if (!validateURL()) return;

    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
        //might need this to create uness entires?
        return;
    } else {
        let dbPromise = initDB();
        dbPromise.onsuccess = function (e) {
            setDB(e.target.result);
            requestDay();
            fetchMonthGoals();
            fetchYearGoals();
            let req = getSettings();
            req.onsuccess = function (e) {
                let settingObj = e.target.result;
                document.documentElement.style.setProperty(
                    '--bg-color',
                    settingObj.theme
                );
            };
        };
        document.getElementById('date').innerHTML = 'Today: ' + currentDateStr;
    }

    setMonthlyOverviewLink();
});

/**
 * Validates the date in the URL the user is trying to fetch
 * @returns void - redirects to appropriate date if valid, otherwise redirects to 404
 */
function validateURL() {
    /* confirm date format is DD/MM/YYYY, if not redirect to 404 */
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(currentDateStr)) {
        window.location.href = PAGE_404;
        return false;
    }
    /* get each date component and convert to integer */
    const dateComponents = currentDateStr.split('/');
    const day = parseInt(dateComponents[1], 10);
    const month = parseInt(dateComponents[0], 10);
    const year = parseInt(dateComponents[2], 10);
    /* if year is more than 10 years away from current year or month is invalid redirect to 404 */
    const currYear = new Date().getFullYear();
    if (Math.abs(year - currYear) > 10 || month < 1 || month > 12) {
        window.location.href = PAGE_404;
        return false;
    }
    /* confirm day exists in current month */
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // adjust for leap years (leap years such as 1700, 1800, 1900 are skipped but not 2000)
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLengths[1] = 29;
    if (day > monthLengths[month - 1] || day < 1) {
        window.location.href = PAGE_404;
        return false;
    }
    return true;
}

/**
 * Sets the MonthlyOverview link to say '<month> <year> Overview' so that users
 * clearly know what MonthOverview they are going to from DailyOverview page
 * @returns void
 */
function setMonthlyOverviewLink() {
    // get MonthlyOverview link in top left corner of DailyOverview screen
    let monthlyOverviewLink = document.querySelector(
        '#monthView > a:first-child'
    );
    // set the link to be to the month of the current DailyOverview
    monthlyOverviewLink.href +=
        '#' +
        currentDateStr.substring(0, 2) +
        '/' +
        currentDateStr.substring(6);
    /* set link text */
    const monthString = currentDateStr.substring(
        0,
        currentDateStr.indexOf('/')
    );
    const month = monthNames[parseInt(monthString) - 1];
    const year = currentDateStr.slice(LENGTH_OF_YEAR_NUMBER);
    monthlyOverviewLink.textContent = `${month} ${year} Overview`;
}

/**
 * Gets the current day object (and creates one if one doesn't exist)
 * and sets the "currentDay" variable
 * Also renders the days notes and bullets if there are any
 * @returns void
 */
function requestDay() {
    let req = getDay(currentDateStr);
    req.onsuccess = function (e) {
        currentDay = e.target.result;
        if (currentDay === undefined) {
            currentDay = initDay(currentDateStr);
            createDay(currentDay);
            let newNote = document.createElement('note-box');
            document.querySelector('#notes').appendChild(newNote);
        } else {
            //Load in bullets
            let bullets = currentDay.bullets;
            renderBullets(bullets);
            // Load in notes
            let newNote = document.createElement('note-box');
            newNote.entry = currentDay.notes;
            document.querySelector('#notes').appendChild(newNote);

            // Load photos
            let photos = currentDay.photos;
            renderPhotos(photos);
        }
    };
}

/**
 * Gets the current month object (and creates one if one doesn't exist)
 * also renders the monthly goals
 * @returns void
 */
function fetchMonthGoals() {
    let monthStr = currentDateStr.substring(0, 3) + currentDateStr.substring(6);
    let req = getMonthlyGoals(monthStr);
    req.onsuccess = function (e) {
        let monthObj = e.target.result;
        if (monthObj === undefined) {
            createMonthlyGoals(initMonth(monthStr));
        } else {
            //load in bullets
            monthObj.goals.forEach((goal) => {
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
            });
        }
    };
}

/**
 * Gets the current year object (and creates one if one doesn't exist)
 * also renders the yearly goals
 * @returns void
 */
function fetchYearGoals() {
    let yearStr = currentDateStr.substring(6);
    let req = getYearlyGoals(yearStr);
    req.onsuccess = function (e) {
        let yearObj = e.target.result;
        if (yearObj === undefined) {
            createYearlyGoals(initYear(yearStr));
        } else {
            //load in bullets
            yearObj.goals.forEach((goal) => {
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
            });
        }
    };
}

document.querySelector('#notes').addEventListener('focusout', () => {
    updateNote();
    updateDay(currentDay);
});

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let bText = document.querySelector('.entry-form-text').value;
    document.querySelector('.entry-form-text').value = '';
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
    let newJson = JSON.parse(e.composedPath()[0].getAttribute('bulletJson'));
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
    // if 3rd layer of nesting
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
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
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
    updateDay(currentDay);
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    let newText = JSON.parse(e.composedPath()[0].getAttribute('bulletJson'))
        .text;
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
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
    updateDay(currentDay);
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    let index = JSON.parse(e.composedPath()[0].getAttribute('index'));
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
    updateDay(currentDay);
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
});

// lets bullet component listen to when a bullet is clicked category
document.querySelector('#bullets').addEventListener('features', function (e) {
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
    updateDay(currentDay);
    document.querySelector('#bullets').innerHTML = '';
    renderBullets(currentDay.bullets);
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
        if (bullet.childList.length != 0) {
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
}

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
    if (bullet.childList.length != 0) {
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
function updateNote() {
    let currNote = document
        .querySelector('note-box')
        .shadowRoot.querySelector('.noteContent').value;
    currentDay.notes = currNote;
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

// Add an image to the canvas
add.addEventListener('click', () => {
    input.type = 'file';
    //add.style.display = 'none';
    cancel.style.display = 'inline';
    save.style.display = 'inline';
    relative = window.img.length;
});

del.addEventListener('click', () => {
    if (window.img.length > 0) {
        let idx = currentDay.photos.indexOf(window.img[relative].src);
        currentDay.photos.splice(idx, 1);
        window.img.splice(relative, 1);
        updateDay(currentDay);
        canv.clearRect(0, 0, canvas.width, canvas.height);
    }
});

cancel.addEventListener('click', () => {
    input.type = 'hidden';
    //add.style.display = 'inline';
    save.style.display = 'none';
    cancel.style.display = 'none';
    relative = 0;
});
// Save image and will hide everything else
// REQUIRED TO PRESS SAVE AFTER UPLOAD
save.addEventListener('click', () => {
    input.type = 'hidden';
    //add.style.display = 'inline';
    save.style.display = 'none';
    cancel.style.display = 'none';
    // clear image space before displaying new image
    canv.clearRect(0, 0, canvas.width, canvas.height);
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
    updateDay(currentDay);
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

    // If the apsect ratio is less than 1 it's a verical image
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
    for (let i = 0; i < photos.length; i++) {
        window.img[i] = new Image();
        window.img[i].src = photos[i];
    }
}
