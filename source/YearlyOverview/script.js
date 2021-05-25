/* eslint-disable no-undef */
//putting this above b/c the API function are all "unknown" to eslint so it complains

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

// contains the current year's yearlyGoal object from the database
let goalsObj;

window.onload = displayGoals();

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;
    //let goal = { text: gText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    let goal = initGoal(gText);
    goalsObj.goals.push(goal);
    updateYearsGoals(goalsObj);
    //renderGoals([goal]);
    renderGoal(goal);
});

/**
 * Function that renders a list of goals into the todo area
 * @param {Object} a list of goal objects
 */
function renderGoals(goals) {
    goals.forEach((goal) => {
        let newPost = document.createElement('goals-entry');
        newPost.entry = goal;
        document.querySelector('#goals').appendChild(newPost);
    });
}

function displayGoals() {
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        console.log('database connected');
        // eslint-disable-next-line no-undef
        setDB(e.target.result);
        //tries to get the current year object, could be undefined
        // eslint-disable-next-line no-undef
        let goals = getYearlyGoals(currentYear);
        goals.onsuccess = function (e) {
            goalsObj = e.target.result;
            //if its undefined, then one hasn't been created yet, so make one
            if (goalsObj === undefined) {
                goalsObj = initYear(currentYear);
                createYearlyGoals(goalsObj);
            } else {
                goalsObj.goals.forEach((goal) => {
                    console.log(goal);
                    renderGoal(goal);
                });
            }
        };
    };
}

/**
 * takes a goal and renders it onto the screen
 * @param {Object} goal - a goal object
 */
function renderGoal(goal) {
    let newGoal = document.createElement('goals-entry');
    newGoal.entry = goal;
    document.querySelector('#goals').appendChild(newGoal);
}

/**kk */
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
