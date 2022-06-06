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
// currentYear = '2020';
// contains the current year's yearlyGoal object from the database
let currentYearRes;

window.addEventListener('load', () => {
    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }

    // connecting to database
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        setDB(e.target.result);

        // attempting to load selected year's goals
        let req = getYearlyGoals(currentYear);
        req.onsuccess = function (e) {
            currentYearRes = e.target.result;

            if (currentYearRes === undefined) {
                // creating yearly goals element in database if undefined
                currentYearRes = initYear(currentYear);
                createYearlyGoals(currentYearRes);
            } else {
                // loading in goals from database
                let goals = currentYearRes.goals;
                renderGoals(goals);
            }
        };

        // attempting to load settings
        let settingsReq = getSettings();
        settingsReq.onsuccess = function (e) {
            let settingObj = e.target.result;
            document.documentElement.style.setProperty(
                '--bg-color',
                settingObj.theme
            );
        };
    };
});

// adding listener to goal entry form
document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;

    // clearing form value and adding entry to goals list
    document.querySelector('.entry-form-text').value = '';
    currentYearRes.goals.push({
        text: gText,
        done: false,
    });

    // updating goals in database
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
    updateYearsGoals(currentYearRes);
});

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    // debug

    // getting index of deleted bullet
    let index = e.composedPath()[0].getAttribute('index');

    // removing bullet and updating database
    currentYearRes.goals.splice(index, 1);
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    // getting the index of edited bullet and the updated goal field
    let newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson')).text;
    let index = e.composedPath()[0].getAttribute('index');

    // updating database with edited bullet
    currentYearRes.goals[index].text = newText;
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    // getting index of completed bullet
    let index = e.composedPath()[0].getAttribute('index');

    // marking goal as completed and updating database
    currentYearRes.goals[index].done ^= true;
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
        // creating goal element
        let newPost = document.createElement('goals-entry');

        // setting attributes
        newPost.setAttribute('goalJson', JSON.stringify(goal));
        newPost.setAttribute('index', i);
        newPost.entry = goal;

        // appending goal list
        document.querySelector('#bullets').appendChild(newPost);
        i++;
    });
}

/**kk */
//link the months
document.getElementById('January').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#01/' +
    currentYear;
document.getElementById('February').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#02/' +
    currentYear;
document.getElementById('March').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#03/' +
    currentYear;
document.getElementById('April').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#04/' +
    currentYear;
document.getElementById('May').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#05/' +
    currentYear;
document.getElementById('June').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#06/' +
    currentYear;
document.getElementById('July').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#07/' +
    currentYear;
document.getElementById('August').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#08/' +
    currentYear;
document.getElementById('September').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#09/' +
    currentYear;
document.getElementById('October').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#10/' +
    currentYear;
document.getElementById('November').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#11/' +
    currentYear;
document.getElementById('December').children[0].href =
    'https://cse110-sp21-group12.github.io/cse110-sp21-group12/source/MonthlyOverview/MonthlyOverview.html' +
    '#12/' +
    currentYear;
