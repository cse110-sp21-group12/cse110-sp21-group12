// yearObj: { year: yearStr, goals: [] }
import { db, auth } from '../Backend/FirebaseInit.js';
import {
    set,
    ref,
    push,
    get,
} from '../Backend/firebase-src/firebase-database.min.js';
import { DayModel } from '../../Models/DTOs/ModelExport.js';

/**
 * Get current user's id
 * @returns user id. null if no user is signed in or the
 * user is not signed in (i.e bypassing the authentication).
 */
function getUserID() {
    return auth.currentUser.uid;
}

function getUserEmail() {
    return auth.currentUser.email;
}

function getCurrentDate() {
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

function setObjAtDBPath(path, obj) {
    set(ref(db, path), obj);
}

function pushToDBPath(path, obj) {
    push(ref(db, path), obj);
}

async function getDataAtDBPath(path) {
    const snapshot = await get(ref(db, path));
    if (!snapshot.exists()) {
        console.log(`No DB path ${path}`);
        return undefined;
    } else {
        return snapshot.val();
    }
}

async function checkDayPathExists(path, day) {
    const notesAtDayPath = `${path}/notes`;
    const dayPathExists = await getDataAtDBPath(notesAtDayPath);
    if (!dayPathExists) {
        const newDayObj = new DayModel(day);
        setObjAtDBPath(path, newDayObj);
    }
}

export {
    getUserID,
    getUserEmail,
    getCurrentDate,
    setObjAtDBPath,
    pushToDBPath,
    getDataAtDBPath,
    checkDayPathExists,
};
