// yearObj: { year: yearStr, goals: [] }
import { db, auth } from '../Backend/FirebaseInit.js';
import { set, ref } from '../Backend/firebase-src/firebase-database.min.js';

// Path to webpage's root directory
// eslint-disable-next-line no-unused-vars
const originPath = window.location.origin;

/**
 * Get current user's id
 * @returns user id. null if no user is signed in or the
 * user is not signed in (i.e bypassing the authentication).
 */
export function getUserID() {
    return auth.currentUser.uid;
}

export function getUserEmail() {
    return auth.currentUser.email;
}

export function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    const yyyy = today.getFullYear();

    const todayObj = {
        day: dd,
        month: mm,
        year: yyyy,
    };

    return todayObj;
}

export function pushObjToDB(path, obj) {
    set(ref(db, path), obj);
}
