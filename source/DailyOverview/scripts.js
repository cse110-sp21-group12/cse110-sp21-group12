window.onload = () => {
    // eslint-disable-next-line no-undef
    let req = getDay('05/20/2021');
    req.onsuccess = function (e) {
        console.log('got day');
        console.log(e.target.result);
        let bullets = e.target.result.bullets;
        renderBullets(bullets);
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
