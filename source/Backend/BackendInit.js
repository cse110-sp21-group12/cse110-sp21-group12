import { db, auth } from '../Backend/FirebaseInit.js';
import {
    // set,
    ref,
    get,
    update,
    remove,
    push,
} from '../Backend/firebase-src/firebase-database.min.js';

let currentUserID;
getUserID().then((user) => {
    currentUserID = user.uid;
});

/**
 * takes a given date string and adds a base64 encoded photo in the database
 * @param {string} date string of the form "mm/dd/yyyy"
 * @param {file} photo as file-type that will be converted to base64
 * @returns void
 */
async function addPhoto(dayStr, photoFile) {
    const [month, day, year] = dayStr.split('/');
    const base64Str = await getBase64(photoFile);
    const dbPath = `${currentUserID}/${year}/${month}/${day}/photos`;
    pushObjToDBPath(dbPath, base64Str);
}

// Create Day
/**
 * create db object for day
 * @param {Object} dayObj - Custom day object
 * @param {String} dayObj.date -  date of the form "mm/dd/yyyy/"
 *  (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects, encoded in Base64
 * @param {String} dayObj.notes - a string representing the notes
 * @returns void
 */
function createDay(dayObj) {
    const [month, day, year] = dayObj.date.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    if (dayObj.bullets.length === 0) {
        dayObj.bullets.push('');
    }
    if (dayObj.photos.length === 0) {
        dayObj.photos.push('');
    }

    updateObjAtDBPath(dbPath, dayObj);
}

/**
 * create db object for month
 * @param {Object} monthObj
 * @param {String} monthObj.month - month and year in the form "mm/yyyy"
 *  (eg: "12/2020")
 * @param {Object} monthObj.goals - an array of custom goal objects
 * @returns void
 */
function createMonthlyGoals(monthObj) {
    const [month, year] = monthObj.month.split('/');
    const dbPath = `${currentUserID}/${year}/${month}`;
    updateObjAtDBPath(dbPath, monthObj);
}

/**
 * create db object for year
 * @param {Object} yearObj - custom year object
 * @param {String} yearObj.year - year in the form "xxxx" (eg: "2020")
 * @param {Object} yearObj.goals - an array of custom goal objects
 * @returns void
 */
function createYearlyGoals(yearObj) {
    const dbPath = `${currentUserID}/${yearObj.year}`;
    updateObjAtDBPath(dbPath, yearObj);
}

/**
 * delete db object for day
 * @param {String} - date string of the form "mm/dd/yyyy"
 * @returns void
 */
function deleteDay(dayStr) {
    const [month, day, year] = dayStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    deleteObjAtDBPath(dbPath);
}

/**
 * delete db object for month
 * @param {String} monthStr - string of the form "xx/xxxx" eg: "02/2022"
 * @returns void
 */
function deleteMonthlyGoals(monthStr) {
    const [month, year] = monthStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/goals`;
    deleteObjAtDBPath(dbPath);
}

/**
 * delete object at db path
 * @param {String} path - path to key you would like to delete eg:
 *                        "${currentUserID}/2022/02/05"
 * @returns void
 */
function deleteObjAtDBPath(path) {
    remove(ref(db, path));
}

/**
 * delete db object for year
 * @param {String} yearStr - year string of the form 'xxxx' (eg: "2021")
 * @returns void
 */
function deleteYearlyGoals(yearStr) {
    const dbPath = `${currentUserID}/${yearStr}/goals`;
    deleteObjAtDBPath(dbPath);
}

function getBase64(file) {
    let reader = new FileReader();
    // eslint-disable-next-line no-unused-vars
    let promise = new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });
    return promise;
}

/**
 * get data from db
 * @param {String} path - path to key you would like to retrieve eg:
 *                        "${currentUserID}/2022/02/05"
 * @returns Object containing requested data at path from firebase db.
 *          undefined if the path does not exist in the db
 */
async function getDataAtDBPath(path) {
    const snapshot = await get(ref(db, path));
    if (!snapshot.exists()) {
        console.log(`No DB path ${path}`);
        return undefined;
    } else {
        return snapshot.val();
    }
}

/**
 * get db object from day
 * @param {String} dateStr - of form "mm/dd/yyyy" eg: "02/12/2020"
 * @returns A request for a date, if no day with the given dateStr exists,
 *  returns undefined
 */
function getDay(dateStr) {
    const [month, day, year] = dateStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    return getDataAtDBPath(dbPath);
}

/**
 * get db object from month
 * @param {String} monthStr - month along with year in the form "xx/xxxx"
 *  (eg: "02/2022")
 * @returns a request for a monthlyGoals object if none with the monthStr
 *  exist, returns undefined
 */
function getMonthlyGoals(monthStr) {
    const [month, year] = monthStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/goals`;
    return getDataAtDBPath(dbPath);
}

/**
 * get current user's id
 * @returns user id. null if no user is signed in or the
 * user is not signed in (i.e bypassing the authentication).
 */
function getUserID() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
}

/**
 * get db object for year
 * @param {String} yearStr - the year in the form "yyyy" (eg: "2021")
 * @returns A request for the year object, if none exist with the yearStr,
 *  returns undefined
 */
function getYearlyGoals(yearStr) {
    const dbPath = `${currentUserID}/${yearStr}/goals`;
    return getDataAtDBPath(dbPath);
}

function pushObjToDBPath(path, obj) {
    push(ref(db, path), obj);
}

// function setObjAtDBPath(path, obj) {
//     set(ref(db, path), obj);
// }

/**
 * update db object at path. if no path exists, create object at path
 * @param {String} path - path to key you would like to update eg:
 *                        "${currentUserID}/2022/02/05"
 * @param {Object} obj - object to set in place of existing object at path in db
 * @returns void
 */
function updateObjAtDBPath(path, obj) {
    update(ref(db, path), obj);
}

/**
 * update db object for day
 * @param {Object} dayObj - Custom day object
 * @param {String} dayObj.date -  date of the form "mm/dd/yyyy/"
 *  (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects
 * @param {String} dayObj.notes - a string representing the notes
 * @returns void
 */
function updateDay(dayObj) {
    createDay(dayObj);
}

/**
 * update db object for month
 * @param {Object} monthlyObj
 * @param {String} monthObj.month - month and year in the form "mm/yyyy"
 *  (eg: "12/2020")
 * @param {Object} monthObj.goals - an array of custom goal objects
 * @returns void
 */
function updateMonthlyGoals(monthObj) {
    createMonthlyGoals(monthObj);
}

/**
 * update db object for year
 * @param {Object} yearObj - custom year object
 * @param {String} yearObj.year - year in the form "xxxx" (eg: "2020")
 * @param {Object} yearObj.goals - an array of custom goal objects
 * @returns void
 */
function updateYearsGoals(yearObj) {
    createYearlyGoals(yearObj);
}

/**
 * gets the current settings for the user
 * NOTE: Since there is only 1 user, there is only 1 setting object
 * @returns a request for a settings object
 */
// function getSettings() {
//     var tx = db.transaction(['setting'], 'readonly');
//     var store = tx.objectStore('setting');
//     //Since there is only one setting, we just get the first one
//     let request = store.get(1);
//     return request;
// }

/**
 * stores a setting object in the database
 * @param {Object} setting
 * @param {String} setting.username - name of the user (ie: "Miranda")
 * @param {String} setting.password - password of the user (ie: "password")
 * @param {Number} setting.theme - theme id of the user (ie: 0)
 * @return void
 */
// function createSettings(setting) {
//     var tx = db.transaction(['setting'], 'readwrite');
//     var store = tx.objectStore('setting');
//     let request = store.add(setting);
//     request.onerror = function (e) {
//         console.log('Error', e.target.error.name);
//         throw 'Error' + e.target.error.name;
//     };
//     request.onsuccess = function () {
//         console.log(`added setting entry for ${setting.username} successful`);
//     };
// }

/**
 * updates the custom setting object with new info
 * @param {Object} setting
 * @param {String} setting.username - name of the user (ie: "Miranda")
 * @param {String} setting.password - password of the user (ie: "password")
 * @param {Number} setting.theme - theme id of the user (ie: 0)
 * @returns void
 */
// function updateSettings(setting) {
//     var tx = db.transaction(['setting'], 'readwrite');
//     var store = tx.objectStore('setting');
//     let request = store.put(setting, 1);
//     request.onerror = function (e) {
//         console.log('Error', e.target.error.name);
//         throw 'Error' + e.target.error.name;
//     };
//     request.onsuccess = function () {
//         console.log(`updated setting entry for ${setting.username} successful`);
//     };
// }

/**
 * deletes the setting object
 * @returns void
 */
// function deleteSettings() {
//     var tx = db.transaction(['setting'], 'readwrite');
//     var store = tx.objectStore('setting');
//     let request = store.delete(1);
//     request.onerror = function (e) {
//         console.log('Error', e.target.error.name);
//         throw 'Error' + e.target.error.name;
//     };
//     request.onsuccess = function () {
//         console.log('setting entry deleted successful');
//     };
// }

export {
    addPhoto,
    getDay,
    createDay,
    updateDay,
    deleteDay,
    getYearlyGoals,
    createYearlyGoals,
    updateYearsGoals,
    deleteYearlyGoals,
    getMonthlyGoals,
    createMonthlyGoals,
    updateMonthlyGoals,
    deleteMonthlyGoals,
};
