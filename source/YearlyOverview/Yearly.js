import { db } from '../Backend/FirebaseInit.js';
import {
    getUserID,
    // pushObjToDB,
    // getCurrentDate,
} from '../../General/GlobalUtility.js';
import { ref, onValue } from '../Backend/firebase-src/firebase-database.min.js';

window.onload = () => {
    // const currentDateObj = getCurrentDate();
    const currentUserID = getUserID();
    // Check if user is logged in. If not, redirect to Login.html
    if (currentUserID === null) {
        window.location.replace('../Login/Login.html');
    }

    const userRef = ref(db, currentUserID);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data === null) {
            console.log('data is null');
            // const dbPath = `${currentUserID}/${currentDateObj.year}`;

            //  pushObjToDB(dbPath, )
        }
    });
};
