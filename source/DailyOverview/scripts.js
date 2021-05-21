// mock data of list of bullets to render
let mockBullets = [
    { text: 'O, Wonder! ', symb: '•', done: true, indent: 0 },
    {
        text: 'How many goodly creatures are there here! ',
        symb: '•',
        indent: 1,
    },
    { text: 'How beateous mankind is! ', symb: '•', indent: 2 },
    {
        text: "O brave new world, That has such people in't!",
        symb: '•',
        indent: 0,
        child: {
            text: "child test",
            symb: '•',
            indent: 0,
            child: {
                text: "extra child test",
                symb: '•',
                indent: 0,
            }
        }
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
    let bullet = { text: bText, symb: '*', indent: 0 };
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
        if (bullet.child) {
            let newChild = renderChild(bullet.child);
            newPost.child = newChild;
        }
        document.querySelector('#todo').appendChild(newPost);
        mockBullets.push(bullet);
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
    if (bullet.child) {
        let newNewChild = renderChild(bullet.child);
        newChild.child = newNewChild;
    }
    return newChild;
}
