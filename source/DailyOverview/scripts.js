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

// mock data of list of bullets to render
// eslint-disable-next-line no-unused-vars
let mockBullets = [
    { text: 'O, Wonder! ', symb: '•', done: true },
    {
        text: 'How many goodly creatures are there here! ',
        symb: '•',
    },
    { text: 'How beateous mankind is! ', symb: '•' },
    {
        text: "O brave new world, That has such people in't!",
        symb: '•',
        childList: [
            {
                text: 'child test',
                symb: '•',
                childList: [
                    {
                        text: 'extra child test',
                        symb: '•',
                    },
                ],
            },
            {
                text: 'please work',
                symb: '•',
            },
        ],
    },
];

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
 * @param {[Bullet]} a list of bullet objects
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

//set back button
document.getElementById('monthView').children[0].href +=
    '#' + currentDay.substring(0, 2) + '/' + currentDay.substring(6);
