// mock data of list of bullets to render
let mockBullets = [
    { text: 'O, Wonder! ', symb: '•', done: true},
    {
        text: 'How many goodly creatures are there here! ',
        symb: '•',
    },
    { text: 'How beateous mankind is! ', symb: '•'},
    {
        text: "O brave new world, That has such people in't!",
        symb: '•',
        childList: [
            {
                text: "child test",
                symb: '•',
                childList: [{
                    text: "extra child test",
                    symb: '•',
                }]
            },
            {
                text: "please work",
                symb: '•',
            }
        ]
    },
];

document.getElementById('button').addEventListener('click', () => {
    //on click, render reach element and append to the todo section, used to test rendering of bullets
    renderBullets(mockBullets);
    // mockBullets.forEach((bullet) => {
    //     let newPost = document.createElement('bullet-entry');
    //     newPost.entry = bullet;
    //     document.querySelector('#todo').appendChild(newPost);
    // });
});

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let bText = document.querySelector('.entry-form-text').value;
    let bullet = { text: bText, symb: '•'};
    document.querySelector('.entry-form-text').value = '';
    renderBullets([bullet]);
});

// TODO : function createBullet(text, indentNum, )

/**
 * Function that renders a list of bullets into the todo area
 * it also writes the new bullets into the mockBullets for now
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
    console.log('here are the new bullets: ', mockBullets);
}

/**
 * Function that recursively renders the nested bullets of a given bullet
 * @param {Bullet} a bullet object
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
