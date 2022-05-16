import { db } from '../../Backend/FirebaseInit.js';
import {
    set,
    ref,
    push,
    onValue,
} from '../../Backend/firebase-src/firebase-database.min.js';
import {
    getUserID,
    getUserEmail,
    getCurrentDate,
    pushObjToDB,
} from '../../General/GlobalUtility.js';
// import { YearModel } from '../../Models/DTOs/YearModel.js';

window.onload = () => {
    const button1 = document.getElementById('Test1');
    const button2 = document.getElementById('Test2');
    const formSubmit = document.getElementById('my-form-submit');
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
        const goalsRef = ref(db, goalsEndpoint);
        const newKey = push(goalsRef).key;

        const newObj = {
            [newKey]: {
                done: completedBox,
                'goal-name': goalTitle,
            },
        };

        console.log(newObj);
        pushObjToDB(goalsEndpoint, newObj);
    };
};

function renderGoals(listId, goals) {
    console.log('rendering goals');
    const list = document.getElementById(listId);
    for (const [k, v] of Object.entries(goals)) {
        console.log(`processing goal ${k}`);
        const entry = document.createElement('li');
        entry.appendChild(document.createTextNode(v['goal-name']));

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
