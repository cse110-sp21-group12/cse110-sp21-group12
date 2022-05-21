import { db } from '../../Backend/FirebaseInit.js';
import {
    set,
    ref,
    onValue,
} from '../../Backend/firebase-src/firebase-database.min.js';
import {
    getUserID,
    getUserEmail,
    getCurrentDate,
    pushToDBPath,
    checkDayPathExists,
} from '../../General/GlobalUtility.js';
import { GoalEntry } from '../../Models/DTOs/ModelExport.js';

window.onload = () => {
    const button1 = document.getElementById('Test1');
    const button2 = document.getElementById('Test2');
    const formSubmit = document.getElementById('my-form-submit');
    const testAddGoal = document.getElementById('Test3');
    testAddGoal.addEventListener('click', () => addGoal('2022', 'goal1'));

    button1.onclick = () => {
        pushMockData();
    };

    button2.onclick = async () => {
        const currentDateObj = getCurrentDate();
        const currentUserID = getUserID();
        // Check if user is logged in. If not, redirect to Login.html
        if (currentUserID === null) {
            window.location.replace('../Login/Login.html');
        }

        const goalsEndpoint = `${currentUserID}/${currentDateObj.year}/goals`;
        onValue(ref(db, goalsEndpoint), (snapshot) => {
            if (!snapshot.exists()) {
                console.log('no snapshot');
                return;
            } else {
                const goalsData = snapshot.val();
                renderGoals('goal-list', goalsData);
            }
        });
    };

    formSubmit.onclick = async () => {
        const currentDateObj = getCurrentDate();
        const currentUserID = getUserID();
        const goalTitle = document.getElementById('goal-title').value;
        const completedBox = document.getElementById('completed-box').checked;
        if (goalTitle === null) {
            console.log('Goal Title is not filled out');
            return;
        }

        const goalsEndpoint = `${currentUserID}/${currentDateObj.year}/goals`;

        const newObj = {
            done: completedBox,
            goalName: goalTitle,
        };

        pushToDBPath(goalsEndpoint, newObj);
    };
};

async function addGoal(goalPath, goalName, existingGoalKeys = '') {
    const currentUserID = getUserID();
    let dbPath = `${currentUserID}/`;
    // object we want to push to firebase
    const obj = new GoalEntry(goalName, false);

    // objects for storing year/month/day string values
    let [year, month, day, childLvl1, childLvl2] = goalPath.split('-');

    // firebase keys for goals (should be stored as attributes to
    // goals in the frontend)
    let [dayGoalKey, childLvl1GoalKey] = existingGoalKeys.split('-');

    // append goal to specified year
    if (year && month && day && childLvl1 && childLvl2) {
        dbPath =
            `${year}/${month}/${day}/goals/${dayGoalKey}` +
            `/child-lvl1/goals/${childLvl1GoalKey}/child-lvl2/goals`;
    } else if (year && month && day && childLvl1) {
        dbPath += `${year}/${month}/${day}/goals/${dayGoalKey}/child-lvl1/goals`;
    } else if (year && month && day) {
        dbPath += `${year}/${month}/${day}/`;
        await checkDayPathExists(dbPath, day);
        dbPath += '/goals';
    } else if (year && month) {
        dbPath += `${year}/${month}/goals`;
    } else {
        dbPath += `${year}/goals`;
    }

    pushToDBPath(dbPath, obj);
}

function renderGoals(listId, goals) {
    console.log('rendering goals');
    const list = document.getElementById(listId);
    for (const [k, v] of Object.entries(goals)) {
        console.log(`processing goal ${k}`);
        const entry = document.createElement('li');
        entry.appendChild(document.createTextNode(v['goalName']));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Trash';
        // TODO: Add event listener for path to goal id in db
        deleteButton.addEventListener('click', () => deleteGoal(k));
        entry.appendChild(deleteButton);

        list.appendChild(entry);
    }
}

function deleteGoal(goalId) {
    console.log(`deleting goal ${goalId}`);
    // TODO: Need to find path to goal id
}

function pushMockData() {
    const userUid = getUserID();
    const userEmail = getUserEmail();

    const mockData = {
        email: userEmail,
        theme: '#ffffff',
    };

    set(ref(db, userUid), mockData);
}
