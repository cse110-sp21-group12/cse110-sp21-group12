//get the desired year
let myLocation = window.location.href;
let currentYear = myLocation.substring(
    myLocation.length - 4,
    myLocation.length
);
//default case
if (currentYear == 'html') {
    currentYear = 2021;
}
console.log(currentYear);

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

//query the database

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

//link the months
document.getElementById('January').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#01/' + currentYear;
document.getElementById('February').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#02/' + currentYear;
document.getElementById('March').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#03/' + currentYear;
document.getElementById('April').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#04/' + currentYear;
document.getElementById('May').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#05/' + currentYear;
document.getElementById('June').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#06/' + currentYear;
document.getElementById('July').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#07/' + currentYear;
document.getElementById('August').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#08/' + currentYear;
document.getElementById('September').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#09/' + currentYear;
document.getElementById('October').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#10/' + currentYear;
document.getElementById('November').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#11/' + currentYear;
document.getElementById('December').children[0].href =
    '/source/MonthlyOverview/MonthlyOverview.html' + '#12/' + currentYear;
