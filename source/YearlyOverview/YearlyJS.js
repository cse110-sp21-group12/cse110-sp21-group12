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
currentYear = '2020';
// contains the current year's yearlyGoal object from the database
let currentYearRes;

window.onload = displayGoals();

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;

    document.querySelector('.entry-form-text').value = '';
    currentYearRes.goals.push({
        text: gText,
        done: false,
    });
    console.log(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
    updateYearsGoals(currentYearRes);
});

function displayGoals() {
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        console.log('database connected');
        setDB(e.target.result);
        let req = getYearlyGoals(currentYear);
        req.onsuccess = function (e) {
            console.log('got year');
            console.log(e.target.result);
            currentYearRes = e.target.result;
            if (currentYearRes === undefined) {
                currentYearRes = initYear(currentYear);
                createYearlyGoals(currentYearRes);
            } else {
                //Load in bullets
                let goals = currentYearRes.goals;
                renderGoals(goals);
            }
        };
    };
}

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    console.log('got event');
    console.log(e.composedPath());
    let index = e.composedPath()[0].getAttribute('index');
    currentYearRes.goals.splice(index, 1);
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

// lets todo component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('edited', function (e) {
    console.log('got event');
    console.log(e.composedPath()[0]);
    let newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson')).text;
    let index = e.composedPath()[0].getAttribute('index');
    currentYearRes.goals[index].text = newText;
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

/**
 * Function that renders a list of goals into the todo area
 * @param {Object} a list of goal objects
 */
function renderGoals(goals) {
    let i = 0;
    goals.forEach((goal) => {
        let newPost = document.createElement('goals-entry');
        newPost.setAttribute('goalJson', JSON.stringify(goal));
        newPost.setAttribute('index', i);
        newPost.entry = goal;
        console.log(newPost);
        document.querySelector('#bullets').appendChild(newPost);
        i++;
    });
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
