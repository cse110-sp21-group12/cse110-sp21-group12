//get the desired day
let myLocation = window.location.href;
let currentDay = myLocation.substring(
    myLocation.length - 10,
    myLocation.length
);
//default case
if (currentDay == 'rview.html') {
    currentDay = '05/23/2021';
}
console.log(currentDay);

document.getElementById('date').innerText = 'Today is ' + currentDay;

window.onload = () => {
    // eslint-disable-next-line no-undef
    let req = getDay(currentDay);
    req.onsuccess = function (e) {
        console.log('got day');
        console.log(e.target.result);
        if (e.target.result != undefined) {
            let bullets = e.target.result.bullets;
            renderBullets(bullets);
        }
    };
};

/* Here is another version of what to do when the window loads, TODO, merge these into one
window.onload = () => {
    // eslint-disable-next-line no-undef
    let req = getDay('05/20/2021');
    req.onsuccess = function (e) {
        console.log('got day');
        console.log(e.target.result);
        let bullets = e.target.result.bullets;
        let photos = e.target.result.photos;
        renderPhotos(photos);

        renderBullets(bullets);
    };
};
*/

// document.getElementById('button').addEventListener('click', () => {
//     //on click, render reach element and append to the todo section, used to test rendering of bullets
//     renderBullets(mockBullets);
// });

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let bText = document.querySelector('.entry-form-text').value;
    let bullet = { text: bText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    renderBullets([bullet]);
});

// TODO : function createBullet(text, indentNum, )

/**
 * Function that renders a list of bullets into the todo area
 * @param {Object} a list of bullet objects
 */
function renderBullets(bullets) {
    bullets.forEach((bullet) => {
        let newPost = document.createElement('bullet-entry');
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
 * @param {Object} a bullet object
 * @return {Object} new child created
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

//set back button
document.getElementById('monthView').children[0].href +=
    '#' + currentDay.substring(0, 2) + '/' + currentDay.substring(6);

/**
 * Function that recursively renders the nested bullets of a given bullet
 * @param {Object} a bullet object
 * @return {Object} new child created
 */
// eslint-disable-next-line no-unused-vars
function renderPhotos(photos) {
    for (let i = 0; i < photos.length; i++) {
        window.img[i] = new Image();
        window.img[i].src = photos[i];
    }
}
