// mock data of list of bullets to render
const mockBullets = [
    { text: 'O, Wonder! ', symb: '*', done: true, indent: 0 },
    {
        text: 'How many goodly creatures are there here! ',
        symb: '*',
        indent: 1,
    },
    { text: 'How beateous mankind is! ', symb: '*', indent: 2 },
    {
        text: "O brave new world, That has such people in't!",
        symb: '*',
        indent: 0,
    },
];

document.getElementById('button').addEventListener('click', () => {
    //on click, render reach element and append to the todo section, used to test rendering of bullets
    mockBullets.forEach((bullet) => {
        let newPost = document.createElement('bullet-entry');
        newPost.entry = bullet;
        document.querySelector('#todo').appendChild(newPost);
    });
});
