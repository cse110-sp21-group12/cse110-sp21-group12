// mock data of list of goals to render

let goalsObj;

window.onload = displayGoals();

document.querySelector('.entry-form').addEventListener('submit', (submit) => {
    submit.preventDefault();
    let gText = document.querySelector('.entry-form-text').value;
    let goal = { text: gText, symb: '•' };
    document.querySelector('.entry-form-text').value = '';
    renderGoals([goal]);
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
        setDB(e.target.result);
        let goals = getYearlyGoals('2020');
        goals.onsuccess = function (e) {
            goalsObj = e.target.result.goals;
            goalsObj.forEach((goal) => {
                console.log(goal);
                renderGoal(goal);
            });
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
