/* eslint-disable no-unused-vars */
/* since many functions here aren't called, eslint complains about unused-vars */

/**
 * Want to first check if database exists, and if not, set it up
 * a constant name to our database
 */
const DB_NAME = 'bujoBase';

/**
 * A constant of our database version
 */
const DB_VERSION = 1;

// contains mockData to populate the db
let mockData;

/**
 * will contain the db object returned from "initDB()" to be used in
 * creating future transactions, has to be set via "setDB()"
 */
let db;

/**
 * Function checks to see if this visotor has a databse set up
 * if it doesn't, then cretaes the stores and indicies
 * NOTE: It is up to the CALLER to call "setDB" with the returned database object before making
 * any transactions
 * @returns a request for a db object
 */
function initDB() {
    if (!('indexedDB' in window)) {
        console.log('This browser does not support IndexedDB');
    }
    // not sure if we need to use dbPromise here
    // eslint-disable-next-line no-unused-vars
    let dbPromise = indexedDB.open(DB_NAME, DB_VERSION);
    // TBH idk why google calls this "upgradeDb", perhaps they refernce this creations as "upgrading"
    dbPromise.onupgradeneeded = function (e) {
        db = e.target.result;
        if (!db.objectStoreNames.contains('days')) {
            /**
              * creating a object store for days, these will be differentiaed by a date string
              * (eg: '05-20-2021')
              * Here is a sample of what a 'days' could look like:
              {
                  date: "xx-xx-xxxx",
                     bullets: [bullet1,...],
                     photos: [photo1,...]
                 }
             */
            db.createObjectStore('days', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('yearlyGoals')) {
            /**
              * creating a yearly store for yearly goals, since we won't ever need to be getting
              * a specific goal (but rather goals within a certain year), we can use an auto-increment key
              {
                     year: xxxx
                     goals: [yGoal1, yGoal2,..]
                 }
                 ^^^ should we store each goal seoerately, or as a list?
             */
            db.createObjectStore('yearlyGoals', { keyPath: 'year' });
        }
        if (!db.objectStoreNames.contains('monthlyGoals')) {
            /**
              * creating a montly store for monthly goals, since we won't ever need to be getting
              * a specific goal (but rather goals within a certain monthly), we can use an auto-increment key
              {
                     month: xx/xxxx (month and year)
                     goals: [mGoal1, mGoal2,..]
                 }
                 ^^^ should we store each goal seoerately, or as a list?
             */
            db.createObjectStore('monthlyGoals', { keyPath: 'month' });
        }
        if (!db.objectStoreNames.contains('setting')) {
            /**
                      * creating a store to place the settings object
                      * This one is tricky, since the story would only have a
                      * max of 1 object (one per use). 
                      * We can always retrieve it with a key=1, but we have to make sure
                      * we only create this once
                      * -there doesn't seem to be a need to create additional indices
                      { theme: 1, passowrd: ..., name: ...  }
                     */
            db.createObjectStore('setting', { autoIncrement: true });
        }
    };
    return dbPromise;
}

/**
 * used to set the database object to make future transactions with
 * @param {Object} dbReturn
 */
function setDB(dbReturn) {
    db = dbReturn;
}

/**
 * given a string date key, will return the correct date object
 * @param {String} dateStr -  of form "mm/dd/yyyy" eg: "02/12/2020"
 * @returns A request for a date, if no day with the given dateStr exists, returns undefined
 */
function getDay(dateStr) {
    let tx = db.transaction(['days'], 'readonly');
    let store = tx.objectStore('days');
    let request = store.get(dateStr);
    return request;
}

// Create Day
/**
 * given a day object, will create an entry in the database
 * @param {Object} dayObj - Custom day object
 * @param {string} dayObj.date -  date of the form "mm/dd/yyyy/" (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects, encoded in Base64
 * @param {string} dayObj.notes - a string representing the notes
 * @returns void
 */
function createDay(dayObj) {
    let tx = db.transaction('days', 'readwrite');
    let store = tx.objectStore('days');
    let request = store.add(dayObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`Created day entry ${dayObj.date}  successful`);
    };
}

/**
 * takes a given day object and updates it
 * the date property must match an entry in the database
 * @param {Object} dayObj - Custom day object
 * @param {string} dayObj.date -  date of the form "mm/dd/yyyy/" (ie: "02/28/2021")
 * @param {Object} dayObj.bullets - an array of bullets
 * @param {Object} dayObj.photos - an array of photo objects
 * @param {string} dayObj.notes - a string representing the notes
 * @returns void
 */
function updateDay(dayObj) {
    let tx = db.transaction(['days'], 'readwrite');
    let store = tx.objectStore('days');
    let request = store.put(dayObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`Updated day entry ${dayObj.date}  successful`);
    };
}

/**
 * takes a given date string and deletes that entry from the database
 * @param {string} date string of the form "mm/dd/yyyy"
 * @returns void
 */
function deleteDay(dayStr) {
    let tx = db.transaction(['days'], 'readwrite');
    let store = tx.objectStore('days');
    let request = store.delete(dayStr);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`${dayStr} entry successful deleted`);
    };
}

/**
 * given a year string, gets the set of yearly goals in that year
 * @param {String} yearStr - the year in the form "yyyy" (eg: "2021")
 * @returns A request for the year object, if none exist with the yearStr, returns undefined
 */
function getYearlyGoals(yearStr) {
    let tx = db.transaction(['yearlyGoals'], 'readonly');
    let store = tx.objectStore('yearlyGoals');
    let request = store.get(yearStr);
    return request;
}

/**
 * given a yearlyGoals obj, creates a yearGoals object which contains the year, as well as a list of yearly goals
 * @param {Object} yearObj - custom year object
 * @param {string} yearObj.year - year in the form "xxxx" (eg: "2020")
 * @param {Object} yearObj.goals - an array of custom goal objects
 * @returns void
 */
function createYearlyGoals(yearObj) {
    let tx = db.transaction(['yearlyGoals'], 'readwrite');
    let store = tx.objectStore('yearlyGoals');
    let request = store.add(yearObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`Created yearlyGoal ${yearObj.year} entry successful`);
    };
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
    let tx = db.transaction(['yearlyGoals'], 'readwrite');
    let store = tx.objectStore('yearlyGoals');
    let request = store.put(yearObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`updated yearlyGoal entry ${yearObj.year} successful`);
    };
}

/**
 * Deletes the given Yearly Goals under the year string
 * @param {String} yearStr - year string of the form 'xxxx' (eg: "2021")
 * @returns void
 */
function deleteYearlyGoals(yearStr) {
    let tx = db.transaction(['yearlyGoals'], 'readwrite');
    let store = tx.objectStore('yearlyGoals');
    let request = store.delete(yearStr);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`deleted yearlyGoal entry ${yearStr} successful`);
    };
}

/**
 * gets a monthlyGoal object given the input month string
 * @param {String} monthStr - month along with year in the form "xx/xxxx" (eg: "02/2022")
 * @returns a request for a monthlyGoals object if none with the monthStr exist, returns undefined
 */
function getMonthlyGoals(monthStr) {
    let tx = db.transaction(['monthlyGoals'], 'readonly');
    let store = tx.objectStore('monthlyGoals');
    let request = store.get(monthStr);
    return request;
}

/**
 * creates a monthlyGoal object in the database given a monthlyGoal object
 * @param {Object} monthObj
 * @param {string} monthObj.year - month and year in the form "mm/yyyy" (eg: "12/2020")
 * @param {Object} monthObj.goals - an array of custom goal objects
 * @returns void
 */
function createMonthlyGoals(monthObj) {
    let tx = db.transaction(['monthlyGoals'], 'readwrite');
    let store = tx.objectStore('monthlyGoals');
    let request = store.add(monthObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`Created monthlyGoal entry ${monthObj.month} successful`);
    };
}

/**
 * updates a monthlyGoals object in the database  monthObj.month must
 * match one existing in the database
 * @param {Object} monthlyObj
 * @param {string} monthObj.month - month and year in the form "mm/yyyy" (eg: "12/2020")
 * @param {Object} monthObj.goals - an array of custom goal objects
 * @returns void
 */
function updateMonthlyGoals(monthObj) {
    let tx = db.transaction(['monthlyGoals'], 'readwrite');
    let store = tx.objectStore('monthlyGoals');
    let request = store.put(monthObj);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`updated monthlyGoal entry ${monthObj.month} successful`);
    };
}

/**
 * deletes monthly goal obejct associated with the given month string
 * @param {String} monthStr -  string of the form "xx/xxxx" eg: "02/2022"
 * @returns void
 */
function deleteMonthlyGoals(monthStr) {
    let tx = db.transaction(['monthlyGoals'], 'readwrite');
    let store = tx.objectStore('monthlyGoals');
    let request = store.delete(monthStr);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`delete monthly goal ${monthStr} entry successful`);
    };
}

/**
 * gets the current settings for the user
 * NOTE: Since there is only 1 user, there is only 1 setting object
 * @returns a request for a settings object
 */
function getSettings() {
    var tx = db.transaction(['setting'], 'readonly');
    var store = tx.objectStore('setting');
    //Since there is only one setting, we just get the first one
    let request = store.get(1);
    return request;
}

/**
 * stores a setting object in the database
 * @param {Object} setting
 * @param {String} setting.username - name of the user (ie: "Miranda")
 * @param {String} setting.password - password of the user (ie: "password")
 * @param {Number} setting.theme - theme id of the user (ie: 0)
 * @return void
 */
function createSettings(setting) {
    var tx = db.transaction(['setting'], 'readwrite');
    var store = tx.objectStore('setting');
    let request = store.add(setting);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`added setting entry for ${setting.username} successful`);
    };
}

/**
 * updates the custom setting object with new info
 * @param {Object} setting
 * @param {String} setting.username - name of the user (ie: "Miranda")
 * @param {String} setting.password - password of the user (ie: "password")
 * @param {Number} setting.theme - theme id of the user (ie: 0)
 * @returns void
 */
function updateSettings(setting) {
    var tx = db.transaction(['setting'], 'readwrite');
    var store = tx.objectStore('setting');
    let request = store.put(setting, 1);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log(`updated setting entry for ${setting.username} successful`);
    };
}

/**
 * deletes the setting object
 * @returns void
 */
function deleteSettings() {
    var tx = db.transaction(['setting'], 'readwrite');
    var store = tx.objectStore('setting');
    let request = store.delete(1);
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
        throw 'Error' + e.target.error.name;
    };
    request.onsuccess = function () {
        console.log('setting entry deleted successful');
    };
}

/**
 * Below are constuctors for objects to store
 * in the database that you may help find useful
 */

/**
 * creates a new year object given a year string
 * @param {String} yearStr - the year (eg: "2020")
 * @returns {Object} yearObj - the new year object
 * @returns {String} yearObj.year - string of the year
 * @returns {Object} yearObj.goals- an array (initally empty) of goal objects
 */
function initYear(yearStr) {
    return { year: yearStr, goals: [] };
}

/**
 * creates a new month object given a month string
 * @param {String} monthStr - a string repr of the month (this also includes the year)
 * @returns {Object} monthObj - the new monthly goal obj
 * @returns {String} monthObj.year - string of the month (which is of the form "xx/xxxx" eg: "02/2021")
 * @returns {Object} monthObj.goals- an array (initally empty) of goal objects
 */
function initMonth(monthStr) {
    return { month: monthStr, goals: [] };
}

/**
 * creates a new day object given a date string
 * @param {String} dateStr - a string of the goal
 * @returns {Object} dateObj - the new day object
 * Look into createDay() to see what a date object consists of
 */
function initDay(dateStr) {
    return { date: dateStr, bullets: [], photos: [], notes: '' };
}

/**
 * creates a new goal object given a goal string
 * new goals area always initalized as not done
 * @param {String} goalStr - a string of the goal
 * @returns {Object} goal - the new goal object
 * @returns {String} goal.text - the string of what the text is
 * @returns {boolean} goal.done - is the goal is done or not
 */
function initGoal(goalStr) {
    return { text: goalStr, done: false };
}
