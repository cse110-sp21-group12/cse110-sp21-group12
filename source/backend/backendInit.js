/**
 * Want to first check if database exists, and if not, set it up
 */
const DB_NAME = 'bujoBase';
const DB_VERSION = 1;

// contains mockData to populate the db
let mockData;

// eslint-disable-next-line no-unused-vars
let db;
/**
 * Function checks to see if this visotor has a databse set up
 * if it doesn't, then cretaes the stores and indicies
 * lastly, it assigns the actual db object from the promise
 * @returns void:
 */
// eslint-disable-next-line no-unused-vars
//function dbInit() {
if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB");
}
// not sure if we need to use dbPromise here
// eslint-disable-next-line no-unused-vars
let dbPromise = indexedDB.open(DB_NAME, DB_VERSION);
// TBH idk why google calls this "upgradeDb", perhaps they refernce this creations as "upgrading"
dbPromise.onupgradeneeded = function (e) {
    var db = e.target.result;
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
    //populate mock data
    setUpMockData();
};
dbPromise.onsuccess = function (e) {
    console.log('database connected');
    db = e.target.result;
};
dbPromise.onerror = function (e) {
    console.log('onerror!');
    console.dir(e);
};
//}

/**
 * Is called to populate the databse with mockData when one doesn't exist
 */
function setUpMockData() {
    fetch('/source/backend/mockData.json')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            mockData = data;
            console.log('here is the mock Data', mockData);
            console.log('setting up mock data');
            createDay(mockData.sampleDay1);
            createDay(mockData.sampleDay2);
            createMonthlyGoals(mockData.sampleMonthlyGoals);
            createYearlyGoals(mockData.sampleYearlyGoals);
            createSettings(mockData.sampleSetting);
        });

    /* sample way to update the monthly goals
        let month = mockData.sampleMonthlyGoals;
        month.goals[0].text = 'run some laps';
        updateMonthGoals(month);
    */

    /* sample way to delete day
    
    deleteDay('05/20/2021');
    */

    /* sample way to get the monthly goals
        let req = getMonthlyGoals('12/2021');
        req.onsuccess = function (e) {
            console.log('got monthly goals');
            console.log(e.target.result);
        };
    */
}

/**
 * sample function to get the mock data from the database
 */
// eslint-disable-next-line no-unused-vars
function getMockData() {
    let reqD1 = getDay('05/20/2021');
    reqD1.onsuccess = function (e) {
        console.log('got daily goals 05/20/2021');
        console.log(e.target.result);
    };

    let reqMG = getMonthlyGoals('12/2021');
    reqMG.onsuccess = function (e) {
        console.log('got monthly goals');
        console.log(e.target.result);
    };

    let reqYG = getYearlyGoals('2020');
    reqYG.onsuccess = function (e) {
        console.log('got yearly goals 2020');
        console.log(e.target.result);
    };

    let reqSE = getSettings();
    reqSE.onsuccess = function (e) {
        console.log('got settings');
        console.log(e.target.result);
    };

    //This one is getting an entry that doesn't exist
    let reqYGE = getYearlyGoals('2021');
    reqYGE.onsuccess = function (e) {
        console.log('didnt yearly goals 2021, should be undefined');
        console.log(e.target.result);
    };
}

/**
 * sample function to delete the mock data from database
 */
// eslint-disable-next-line no-unused-vars
function deleteMockData() {
    deleteDay('05/20/2021');
    deleteMonthlyGoals('12/2021');
    deleteYearlyGoals('2020');
    deleteSettings();
    //deleting something that isn't there actually doesn't throw an error
    deleteYearlyGoals('2020');
}

/**
 * sample function to edit the mock data from database
 */
// eslint-disable-next-line no-unused-vars
function editMockData() {
    let settings = { username: 'Prospero', passoword: '1611', theme: 0 };
    updateSettings(settings);
}

/**
 * given a string date key, will return the correct date object
 * @param {String} date of form "mm/dd/yyyy"
 * @returns A request for a date
 */
// eslint-disable-next-line no-unused-vars
function getDay(dateStr) {
    let tx = db.transaction(['days'], 'readonly');
    let store = tx.objectStore('days');
    let request = store.get(dateStr);
    return request;
}

// Create Day
/**
 * given a day object, will create an entry in the database
 * @param {custom Day object}
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {custom Day object}
 * @returns a day request
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {String} date string of the form "mm/dd/yyyy"
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {String} the year in the form "yyyy"
 * eg: "2021"
 * @returns A request for the year object
 */
// eslint-disable-next-line no-unused-vars
function getYearlyGoals(yearStr) {
    let tx = db.transaction(['yearlyGoals'], 'readonly');
    let store = tx.objectStore('yearlyGoals');
    let request = store.get(yearStr);
    return request;
}

/**
 * given a yearlyGoals obj, creates a yearGoals object which contains the year, as well as a list of yearly goals
 * @param {custom year object} year
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {custom year object} year
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {String} year string of the form 'xxxx'
 * eg: "2021"
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {String} month along with year in the form "xx/xxxx"
 * eg: "02/2022"
 * @returns a request for a monthlyGoals object
 */
// eslint-disable-next-line no-unused-vars
function getMonthlyGoals(monthStr) {
    let tx = db.transaction(['monthlyGoals'], 'readonly');
    let store = tx.objectStore('monthlyGoals');
    let request = store.get(monthStr);
    return request;
}

/**
 * creates a monthlyGoal object in the database given a monthlyGoal object
 * @param {custom monthlyGoals object} monthlyGoals
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * updates a monthlyGoals object in the database
 * @param {custom monthlyGoals object} monthlyGoals
 * @returns void
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {String} month string of the form "xx/xxxx"
 * eg: "02/2022"
 */
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
function getSettings() {
    var tx = db.transaction(['setting'], 'readonly');
    var store = tx.objectStore('setting');
    //Since there is only one setting, we just get the first one
    let request = store.get(1);
    return request;
}

/**
 * stores a setting object in the database
 * @param {custom settings object} setting
 */
// eslint-disable-next-line no-unused-vars
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
 * @param {custom setting object}
 */
// eslint-disable-next-line no-unused-vars
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
 */
// eslint-disable-next-line no-unused-vars
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
