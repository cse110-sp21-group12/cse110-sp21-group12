let img = new Image(); // used to load image from <input> and draw to canvas
let input = document.getElementById('image-input');
const canvas = document.getElementById('myCanvas');
let canv = canvas.getContext('2d');

let relative = 0;
// Buttons
const add = document.getElementById('addPhoto');
const save = document.getElementById('save');
const right = document.getElementById('right');
const left = document.getElementById('left');

// store current day data to update when user leaves page
let currentDay;
//  = {
//     date: "05/20/2021",
//     bullets: [
//         {
//             text: "O, Wonder!",
//             symb: "•",
//             done: true,
//             childList: [],
//             time: null
//         }
//     ],
//     photos: [],
//     notes: "Here is some notes sample test this is a note possibly here could be another"
// }

window.addEventListener('load', () => {
    // getting backend sample day
    let req = getDay('05/20/2021');
    req.onsuccess = function (e) {
        console.log('got day');
        console.log(e.target.result);
        currentDay = e.target.result;

        //Load in bullets
        let bullets = currentDay.bullets;
        renderBullets(bullets);

        // Load in notes
        let newNote = document.createElement('note-box');
        newNote.entry = currentDay.notes;
        document.querySelector('#notes').appendChild(newNote);
    };
});

document.getElementById('notes').addEventListener('click', () => {
    var divs = document.getElementsByClassName('divs');
    for (var i = 0; i < arrows.length; i++) {
        if (this != arrows[i]) {
            arrows[i].style.display = 'none';
        }
    }
    updateDay(currentDay);
});

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let bText = document.querySelector('.entry-form-text').value;
    let bullet = { text: bText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    renderBullets([bullet]);
    currentDay.bullets.push({
        text: bText,
        symb: '•',
        done: false,
        childList: [],
        time: null,
    });
    updateDay(currentDay);
});

// function createBullet(text, indentNum, )

/**
 * Function that renders a list of bullets into the todo area
 * Update currentDay json with updated bullets
 * @param {[Bullet]} a list of bullet objects
 */
function renderBullets(bullets) {
    bullets.forEach((bullet) => {
        let newPost = document.createElement('bullet-entry');
        newPost.setAttribute('bulletJson', JSON.stringify(bullet));
        newPost.setAttribute('editFunc', editBullet.bind(newPost));
        newPost.entry = bullet;
        if (bullet.childList) {
            bullet.childList.forEach((child) => {
                let newChild = renderChild(child);
                newPost.child = newChild;
            });
        }
        document.querySelector('#todo').appendChild(newPost);
    });
}

/**
 * Function that recursively renders the nested bullets of a given bullet
 * @param {Bullet} a bullet object
 * @return {Bullet} new child created
 */
function renderChild(bullet) {
    let newChild = document.createElement('bullet-entry');
    newChild.entry = bullet;
    if (bullet.childList) {
        bullet.childList.forEach((child) => {
            let newNewChild = renderChild(child);
            newChild.child = newNewChild;
        });
    }
    return newChild;
}

function editBullet() {
    console.log('in here');
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
    let currNote = document.querySelector(textarea['class=noteContent']);
    console.log(currNote);
}

input.addEventListener('change', (event) => {
    img[relative] = new Image();
    img[relative].src = URL.createObjectURL(event.target.files[0]); // User picks image location
});
// Add an image to the canvas
add.addEventListener('click', () => {
    input.type = 'file';
    save.style.display = 'inline';
});
// Save image and will hide everything else
// REQUIRED TO PRESS SAVE AFTER UPLOAD
save.addEventListener('click', () => {
    input.type = 'hidden';
    save.style.display = 'none';
    let imgDimension = getDimensions(
        canvas.width,
        canvas.height,
        img[relative].width,
        img[relative].height
    );
    canv.drawImage(
        img[relative],
        imgDimension['startX'],
        imgDimension['startY'],
        imgDimension['width'],
        imgDimension['height']
    );
});
left.addEventListener('click', () => {
    relative -= 1;
    canv.clearRect(0, 0, canvas.width, canvas.height);
    if (img[relative]) {
        let imgDimension = getDimensions(
            canvas.width,
            canvas.height,
            img[relative].width,
            img[relative].height
        );
        canv.drawImage(
            img[relative],
            imgDimension['startX'],
            imgDimension['startY'],
            imgDimension['width'],
            imgDimension['height']
        );
    }
});
right.addEventListener('click', () => {
    relative += 1;
    canv.clearRect(0, 0, canvas.width, canvas.height);
    if (img[relative]) {
        let imgDimension = getDimensions(
            canvas.width,
            canvas.height,
            img[relative].width,
            img[relative].height
        );
        canv.drawImage(
            img[relative],
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
