/* eslint-disable no-undef */
//putting this above b/c the API function are all "unknown" to eslint so it complains

//get the desired year
let myLocation = window.location.href;
let currentYear = myLocation.substring(
    myLocation.length - 4,
    myLocation.length
);

const PAGE_404 = '../404/404.html';

// contains the current year's yearlyGoal object from the database
//default case
let currentYearRes;

// add the current year to the page so the user can tell what yearly overview they are on
let currentYearTag = document.createElement('h2');
currentYearTag.innerHTML = `${currentYear} Yearly Overview`;
currentYearTag.id = 'currentYear';
let houseIcon = document.getElementById('house');
// this line gets the element header which is the parent of the houseIcon and then puts
// the current year before the houseIcon in the html
document.getElementById('header').insertBefore(currentYearTag, houseIcon);

window.addEventListener('load', () => {
    // validate the URL date
    if (!validateURL()) return;

    //gets the session, if the user isn't logged in, sends them to login page
    let session = window.sessionStorage;
    if (session.getItem('loggedIn') !== 'true') {
        window.location.href = '../Login/Login.html';
    }
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        setDB(e.target.result);
        let req = getYearlyGoals(currentYear);
        req.onsuccess = function (e) {
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

/**
 * Validates the date in the URL the user is trying to fetch
 * @returns void - redirects to appropriate date if valid, otherwise redirects to 404
 */
function validateURL() {
    /* confirm date format is YYYY, if not redirect to 404 */
    if (!/^\d{4}$/.test(currentYear)) {
        window.location.href = PAGE_404;
        return false;
    }
    /* convert year to integer */
    const year = parseInt(currentYear, 10);
    /* if year is more than 10 years away from current year redirect to 404 */
    const currYear = new Date().getFullYear();
    if (Math.abs(year - currYear) > 10) {
        window.location.href = PAGE_404;
        return false;
    }
    return true;
}

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

// lets bullet component listen to when a bullet is deleted
document.querySelector('#bullets').addEventListener('deleted', function (e) {
    let index = e.composedPath()[0].getAttribute('index');
    currentYearRes.goals.splice(index, 1);
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

// lets bullet component listen to when a bullet is edited
document.querySelector('#bullets').addEventListener('edited', function (e) {
    let newText = JSON.parse(e.composedPath()[0].getAttribute('goalJson')).text;
    let index = e.composedPath()[0].getAttribute('index');
    currentYearRes.goals[index].text = newText;
    updateYearsGoals(currentYearRes);
    document.querySelector('#bullets').innerHTML = '';
    renderGoals(currentYearRes.goals);
});

// lets bullet component listen to when a bullet is marked done
document.querySelector('#bullets').addEventListener('done', function (e) {
    let index = e.composedPath()[0].getAttribute('index');
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
        let newPost = document.createElement('goals-entry');
        newPost.setAttribute('goalJson', JSON.stringify(goal));
        newPost.setAttribute('index', i);
        newPost.entry = goal;
        document.querySelector('#bullets').appendChild(newPost);
        i++;
    });
}

/**
 * check if the form is empty. If it is, return true. If not, return false.
 * @returns whether the form is valid or not
 */
function checkForm() {
    if (document.querySelector('.entry-form-text').value === '') {
        alert('Please enter a note');
        return false;
    } else {
        return true;
    }
}

window.checkForm = checkForm;

/**kk */
//link the months; the 'a' tag is the parent now so you can just search by the ids
document.getElementById('January').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#01/' + currentYear;
document.getElementById('February').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#02/' + currentYear;
document.getElementById('March').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#03/' + currentYear;
document.getElementById('April').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#04/' + currentYear;
document.getElementById('May').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#05/' + currentYear;
document.getElementById('June').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#06/' + currentYear;
document.getElementById('July').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#07/' + currentYear;
document.getElementById('August').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#08/' + currentYear;
document.getElementById('September').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#09/' + currentYear;
document.getElementById('October').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#10/' + currentYear;
document.getElementById('November').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#11/' + currentYear;
document.getElementById('December').href =
    '../MonthlyOverview/MonthlyOverview.html' + '#12/' + currentYear;
