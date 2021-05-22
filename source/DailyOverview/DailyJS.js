var img = new Image(); // used to load image from <input> and draw to canvas
var input = document.getElementById('image-input');
const canvas = document.getElementById('myCanvas');
let canv = canvas.getContext('2d');

var relative = 0;
// Buttons
const add = document.getElementById('addPhoto');
const save = document.getElementById('save');
const right = document.getElementById('right');
const left = document.getElementById('left');



let x = {
    content: 'The demo then changes the flex-basis on the first item. It will then grow and shrink from that flex-basis. This means that, for example, when the flex-basis of the first item is 200px, it will start out at 200px but then shrink to fit the space available with the other items being at least min-content sized.'
}

window.addEventListener("load", () => {
    let newNote = document.createElement('note-box');
    newNote.entry = x;

    document.querySelector("#notes").appendChild(newNote);
});


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
    var imgDimension = getDimensions(
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
        var imgDimension = getDimensions(
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
        var imgDimension = getDimensions(
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
