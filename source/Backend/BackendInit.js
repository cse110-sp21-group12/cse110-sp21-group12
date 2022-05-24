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

/**
 * Create Day
 * given a day object, will create an entry in the database
 * @param {Object} dayObj - Custom day object
 * @param {string} dayObj.date -  date of the form "mm/dd/yyyy/"
 *  (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects, encoded in Base64
 * @param {string} dayObj.notes - a string representing the notes
 * @returns void
 */
function createDay(dayObj) {
    const [month, day, year] = dayObj.date.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    updateObjAtDBPath(dbPath, dayObj);
}

/**
 * creates a monthlyGoal object in the database given a monthlyGoal object
 * @param {Object} monthObj
 * @param {string} monthObj.month - month and year in the form "mm/yyyy"
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
 * given a yearlyGoals obj, creates a yearGoals object which contains the year,
 * as well as a list of yearly goals
 * @param {Object} yearObj - custom year object
 * @param {string} yearObj.year - year in the form "xxxx" (eg: "2020")
 * @param {Object} yearObj.goals - an array of custom goal objects
 * @returns void
 */
function createYearlyGoals(yearObj) {
    const dbPath = `${currentUserID}/${yearObj.year}`;
    updateObjAtDBPath(dbPath, yearObj);
}

/**
 * takes a given date string and deletes that entry from the database
 * @param {string} date string of the form "mm/dd/yyyy"
 * @returns void
 */
function deleteDay(dayStr) {
    const [month, day, year] = dayStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    deleteObjAtDBPath(dbPath);
}

async function deletePhoto(dayStr, base64) {
    const [month, day, year] = dayStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}/photos`;
    const dayPhotos = await getDataAtDBPath(dbPath);
    for (const [base64UUID, storedBase64] of Object.entries(dayPhotos)) {
        if (storedBase64.length == base64.length && storedBase64 == base64) {
            deleteObjAtDBPath(`${dbPath}/${base64UUID}`);
            break;
        }
    }
}

/**
 * deletes monthly goal object associated with the given month string
 * @param {String} monthStr -  string of the form "xx/xxxx" eg: "02/2022"
 * @returns void
 */
function deleteMonthlyGoals(monthStr) {
    const [month, year] = monthStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/goals`;
    deleteObjAtDBPath(dbPath);
}

function deleteObjAtDBPath(path) {
    remove(ref(db, path))
        .then(() => {
            console.log(`Data deleted successfully at ${path}`);
        })
        .catch((error) => {
            console.log(`Data was not deleted successfully: ${error}`);
        });
}

/**
 * Deletes the given Yearly Goals under the year string
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
 * given a string date key, will return the correct date object
 * @param {String} dateStr -  of form "mm/dd/yyyy" eg: "02/12/2020"
 * @returns A request for a date, if no day with the given dateStr exists,
 *  returns undefined
 */
function getDay(dateStr) {
    const [month, day, year] = dateStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    return getDataAtDBPath(dbPath);
}

/**
 * gets a monthlyGoal object given the input month string
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
 * Get current user's id
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
 * given a year string, gets the set of yearly goals in that year
 * @param {String} yearStr - the year in the form "yyyy" (eg: "2021")
 * @returns A request for the year object, if none exist with the yearStr,
 *  returns undefined
 */
function getYearlyGoals(yearStr) {
    const dbPath = `${currentUserID}/${yearStr}/goals`;
    return getDataAtDBPath(dbPath);
}

function pushObjToDBPath(path, obj) {
    push(ref(db, path), obj)
        .then(() => {
            console.log(`Data pushed successfully at ${path}`);
        })
        .catch((error) => {
            console.log(`Data was not pushed successfully: ${error}`);
        });
}

// function setObjAtDBPath(path, obj) {
//     set(ref(db, path), obj);
// }

function updateObjAtDBPath(path, obj) {
    update(ref(db, path), obj)
        .then(() => {
            console.log(`Data updated successfully at ${path}`);
        })
        .catch((error) => {
            console.log(`Data was not updated successfully: ${error}`);
        });
}

/**
 * takes a given day object and updates it
 * the date property must match an entry in the database
 * @param {Object} dayObj - Custom day object
 * @param {string} dayObj.date -  date of the form "mm/dd/yyyy/"
 *  (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects
 * @param {string} dayObj.notes - a string representing the notes
 * @returns void
 */
function updateDay(dayObj) {
    createDay(dayObj);
}

/**
 * updates a monthlyGoals object in the database  monthObj.month must
 * match one existing in the database
 * @param {Object} monthlyObj
 * @param {string} monthObj.month - month and year in the form "mm/yyyy"
 *  (eg: "12/2020")
 * @param {Object} monthObj.goals - an array of custom goal objects
 * @returns void
 */
function updateMonthlyGoals(monthObj) {
    createMonthlyGoals(monthObj);
}

/**
 * updates a yearlyGoals already existing in the db
 * the year property much match one already existing in the database
 * @param {Object} yearObj - custom year object
 * @param {string} yearObj.year - year in the form "xxxx" (eg: "2020")
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
    deletePhoto,
    getBase64,
};
