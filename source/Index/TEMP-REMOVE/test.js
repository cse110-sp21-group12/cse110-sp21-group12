import { db } from '../../Backend/FirebaseInit.js';
import { set, ref } from '../../Backend/firebase-src/firebase-database.min.js';
import {
    getUserID,
    getUserEmail,
    getCurrentDate,
} from '../../General/GlobalUtility.js';

window.onload = () => {
    const button1 = document.getElementById('Test1');
    const button2 = document.getElementById('Test2');
    const button3 = document.getElementById('Test3');
    button1.onclick = () => {
        pushMockData();
    };

    button2.onclick = () => {
        console.log(getCurrentDate());
    };

    button3.onclick = () => {
        console.log();
    };
};

function pushMockData() {
    const userUid = getUserID();
    const userEmail = getUserEmail();

    const mockData = {
        email: userEmail,
        theme: '#ffffff',
    };

    set(ref(db, userUid), mockData);
}
