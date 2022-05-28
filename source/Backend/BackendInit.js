import { db, auth } from '../Backend/FirebaseInit.js';
import {
    ref,
    get,
    update,
    remove,
    set,
    push,
} from '../Backend/firebase-src/firebase-database.min.js';

// see getMonthName()
const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * add a base64 encoded photo in the database
 * @param {String} date string of the form "mm/dd/yyyy"
 * @param {File} photo as file-type that will be converted to base64
 * @returns void
 * Here is a comment for the purposes of "adding a small change"
 * to the repo
 *
 * Want to first check if database exists, and if not, set it up
 * a constant name to our database
 */
async function addPhoto(dayStr, photoFile) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, day, year] = dayStr.split('/');
    const base64Str = await getBase64(photoFile);
    const dbPath = `${currentUserID}/${year}/${month}/${day}/photos`;
    // creates a new key for the new photo and stores it as
    // 'firebaseUUID: base64String'
    pushObjToDBPath(dbPath, base64Str);
}

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
async function createDay(dayObj) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, day, year] = dayObj.date.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    // we update instead of create because updateDay() calls createDay().
    // this is simpler, but computationally costs more
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
async function createMonthlyGoals(monthObj) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, year] = monthObj.month.split('/');
    const dbPath = `${currentUserID}/${year}/${month}`;
    // see bottom of createDay() for update justification
    updateObjAtDBPath(dbPath, monthObj);
}

/**
 * create db object for year
 * @param {Object} yearObj - custom year object
 * @param {String} yearObj.year - year in the form "xxxx" (eg: "2020")
 * @param {Object} yearObj.goals - an array of custom goal objects
 * @returns void
 */
async function createYearlyGoals(yearObj) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const dbPath = `${currentUserID}/${yearObj.year}`;
    // see bottom of createDay() for update justification
    updateObjAtDBPath(dbPath, yearObj);
}

/**
 * delete db object for day
 * @param {String} - date string of the form "mm/dd/yyyy"
 * @returns void
 */
async function deleteDay(dayStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, day, year] = dayStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    deleteObjAtDBPath(dbPath);
}

/**
 * delete db object for month
 * @param {String} monthStr - string of the form "xx/xxxx" eg: "02/2022"
 * @param {string} base64 an encoding of an image from getBase64()
 * @returns void
 */
async function deletePhoto(dayStr, base64) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, day, year] = dayStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}/photos`;

    // TODO: find more efficient way to store image keys (eg generate
    // pseudorandom uuid based on base64String)
    // we need to grab our existing photos, and iterate through to delete the
    // photo because photos are stored as randomUUID:base64String. firebase
    // does not support hash tables or arrays
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
async function deleteMonthlyGoals(monthStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });
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
    remove(ref(db, path))
        .then(() => {
            console.log(`Data deleted successfully at ${path}`);
        })
        .catch((error) => {
            console.log(`Data was not deleted successfully: ${error}`);
        });
}

/**
 * delete db object for year
 * @param {String} yearStr - year string of the form 'xxxx' (eg: "2021")
 * @returns void
 */
async function deleteYearlyGoals(yearStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const dbPath = `${currentUserID}/${yearStr}/goals`;
    deleteObjAtDBPath(dbPath);
}

/**
 * get current date in the form of an object
 * @returns Object with string keys day, month, and year
 */
function getCurrentDate() {
    var today = new Date();
    const dateObj = {
        day: String(today.getDate()).padStart(2, '0'),
        month: String(today.getMonth() + 1).padStart(2, '0'), // January is 0
        year: String(today.getFullYear()),
    };

    return dateObj;
}

/**
 * compute current week strings based on current day. first day of the week
 * will be Sunday and last day of the week will be Saturday
 * @returns Array of string keys in the format of 'mm/dd/yyyy'
 */
function getCurrentWeek() {
    const currDayObj = getCurrentDate();
    // source: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
    const curr = new Date(
        `${currDayObj.year}/${currDayObj.month}/${currDayObj.day}`
    );
    const week = [];
    // source: https://medium.com/@quynh.totuan/how-to-get-the-current-week-in-javascript-9e64d45a9a08
    for (let i = 0; i < 7; i++) {
        const first = curr.getDate() - curr.getDay() + i;
        const date = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        const [year, month, day] = date.split('-');
        const formattedString = `${month}/${day}/${year}`;
        week.push(formattedString);
    }

    return week;
}

/**
 * compute base64 encoding for file (file must be an image)
 * @param {File} file - a file that contains an image which must be encoded
 *                      into base64 format
 * @returns Promise that resolves to the images base64 encoding
 */
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
 * @returns Object A request for a date, if no day with the given dateStr exists,
 *  returns undefined.
 */
async function getDay(dateStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

    const [month, day, year] = dateStr.split('/');
    const dbPath = `${currentUserID}/${year}/${month}/${day}`;
    return getDataAtDBPath(dbPath);
}

/**
 * get the name associated with a month's number (eg '05' => 'May')
 * @param {String} monthNumber - a month number in the form of '0x' (eg 05) or
 * '1x' (eg 12)
 * @returns name of the corresponding month
 */
function getMonthName(monthNumber) {
    return monthNames[parseInt(monthNumber) - 1];
}

/**
 * get db object from month
 * @param {String} monthStr - month along with year in the form "xx/xxxx"
 *  (eg: "02/2022")
 * @returns a request for a monthlyGoals object if none with the monthStr
 *  exist, returns undefined
 */
async function getMonthlyGoals(monthStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

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
    // source: https://github.com/firebase/firebase-js-sdk/issues/462#:~:text=you%20can%20easily%20implement%20that%20on%20your%20own%20with%20a%20couple%20of%20lines%3A
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
async function getYearlyGoals(yearStr) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });

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

function setObjAtDBPath(path, obj) {
    set(ref(db, path), obj).catch((err) => console.log(err));
}

/**
 * update db object at path. if no path exists, create object at path
 * @param {String} path - path to key you would like to update eg:
 *                        "${currentUserID}/2022/02/05"
 * @param {Object} obj - object to set in place of existing object at path in db
 * @returns void
 */
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
 * Update the notes of year/month/day
 * @param {String} year year of notes to update
 * @param {String} month month of notes to update
 * @param {String} day day of notes to update
 * @param {String} notes notes to update
 */
async function updateNote(year, month, day, notes) {
    const currentUserID = await getUserID()
        .then((user) => {
            return user.uid;
        })
        .catch((err) => {
            console.log(err);
            return;
        });
    let dbPath = `${currentUserID}/${year}/${month}/${day}/notes`;
    setObjAtDBPath(dbPath, notes);
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
    createDay,
    createMonthlyGoals,
    createYearlyGoals,
    deleteDay,
    deleteMonthlyGoals,
    deletePhoto,
    deleteYearlyGoals,
    getBase64,
    getCurrentDate,
    getCurrentWeek,
    getDay,
    getMonthName,
    getMonthlyGoals,
    getYearlyGoals,
    updateDay,
    updateMonthlyGoals,
    updateNote,
    updateYearsGoals,
};
