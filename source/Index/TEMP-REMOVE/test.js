import { db, getUserID, getUserEmail } from '../../Backend/FirebaseInit.js';
import { set, ref } from '../../Backend/firebase-src/firebase-database.min.js';

window.onload = () => {
    const button1 = document.getElementById('Test1');
    button1.onclick = () => {
        pushMockData();
    }
}

function pushMockData() {
    const userUid = getUserID();
    const userEmail = getUserEmail();

    const mockData = {
        email: userEmail,
        theme: '#ffffff'
    }

    set(ref(db, userUid), mockData);
}