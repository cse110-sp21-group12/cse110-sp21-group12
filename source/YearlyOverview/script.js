// mock data of list of goals to render
let mockGoals = [
    { text: 'O, Wonder! ', symb: '•', done: true },
    {
        text: 'How many goodly creatures are there here! ',
        symb: '•',
    },
    { text: 'How beateous mankind is! ', symb: '•' },
    {
        text: "O brave new world, That has such people in't!",
        symb: '•',
    },
];

document.getElementById('button').addEventListener('click', () => {
    //on click, render each element and append to the goals section
    renderGoals(mockGoals);
});

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;
    let goal = { text: gText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    renderGoals([goal]);
});

/**
 * Function that renders a list of goals into the todo area
 * @param {[Goal]} a list of goal objects
 */
function renderGoals(goals) {
    goals.forEach((goal) => {
        let newPost = document.createElement('goals-entry');
        newPost.entry = goal;
        document.querySelector('#goals').appendChild(newPost);
    });
}
