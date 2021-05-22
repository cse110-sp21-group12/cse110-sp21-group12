/**
 * Want to first check if database exists, and if not, set it up
 */
const DB_NAME = 'bujoBase';
const DB_VERSION = 1;

// eslint-disable-next-line no-unused-vars
var db;
/**
 * Function checks to see if this visotor has a databse set up
 * if it doesn't, then cretaes the stores and indicies
 * lastly, it assigns the actual db object from the promise
 * @returns void:
 */
// eslint-disable-next-line no-unused-vars
if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB");
}
// not sure if we need to use dbPromise here
// eslint-disable-next-line no-unused-vars
var dbPromise = indexedDB.open(DB_NAME, DB_VERSION);
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
                 * -created an index for 'year' so we can grab bullets with x-year
                 {
                     key: (Some number we don't care about),
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
                 * -created an index for 'year' and 'month' so we can grab bullets with x-month
                 * 
                 {
                     key: (Some number we don't care about),
                        year: xxxx,
                        month: xx;
                        goals: [mGoal1, mGoal2,..]
                    }
                    ^^^ should we store each goal seoerately, or as a list?
                */
        let monthlyOS = db.createObjectStore('monthlyGoals', {
            autoIncrement: true,
        });
        monthlyOS.createIndex('year', 'year', { unique: false });
        monthlyOS.createIndex('month', 'month', { unique: false });
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
dbPromise.onsuccess = function (e) {
    console.log('database connected');
    db = e.target.result;
};
dbPromise.onerror = function (e) {
    console.log('onerror!');
    console.dir(e);
};

// Get Day
function getDay() {
    var tx = db.transaction(['days'], 'readonly');
    var store = tx.objectStore('days');
    return store.get('date'), store.get('bullet'), store.get('photos');
}
// Create Day
function createDay() {
    var tx = db.transaction(['days'], 'readwrite');
    var store = tx.objectStore('days');
    var item = {
        date: 'hello',
        bullet: 'hello',
        photo: 'hello',
    };
    var request = store.add(item);

    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
    };
    request.onsuccess = function (e) {
        console.log('Created day entry successful');
    };
}
// Update Day
function updateDay(day) {
    var tx = db.transaction(['days'], 'readwrite');
    var store = tx.objectStore('days');
    var item = {
        bullets: day.bullet,
        photos: day.photos,
    };
    store.put(item);
    return tx.complete;
}

// Get Yearly Goal
function getYearGoal(db) {
    var tx = db.transaction(['yearlyGoals'], 'readonly');
    var store = tx.objectStore('yearlyGoals');
    return store.get('year'), store.get('goals');
}
// Create Yearly Goal
function createYearGoal(db, year) {
    var tx = db.transaction(['yearlyGoals'], 'readwrite');
    var store = tx.objectStore('yearlyGoals');
    var item = {
        year: year,
        goals: new Array(),
    };
    store.add(item);
    return tx.complete;
}
// Update Yearly Goal
function updateYearGoal(db, year) {
    var tx = db.transaction(['yearlyGoals'], 'readwrite');
    var store = tx.objectStore('yearlyGoals');
    var item = {
        goals: year.goals,
    };
    store.put(item);
    return tx.complete;
}

// Get Monthly Goal
function getMonthGoal(db) {
    var tx = db.transaction(['monthlyGoals'], 'readonly');
    var store = tx.objectStore('monthlyGoals');
    return store.get('year'), store.get('month'), store.get('goals');
}
// Create Monthly Goal
function createMonthGoal(db, month) {
    var tx = db.transaction(['monthlyGoals'], 'readwrite');
    var store = tx.objectStore('monthlyGoals');
    var item = {
        year: month.year,
        month: month.month,
        goals: new Array(),
    };
    store.add(item);
    return tx.complete;
}
// Update Monthly Goals
function updateMonthGoals(db, month) {
    var tx = db.transaction(['monthlyGoals'], 'readwrite');
    var store = tx.objectStore('monthlyGoals');
    var item = {
        goals: month.goals,
    };
    store.put(item);
    return tx.complete;
}

// Get Settings
function getSettings(db) {
    var tx = db.transaction(['setting'], 'readonly');
    var store = tx.objectStore('setting');
    return (
        store.get('theme'),
        store.get('color'),
        store.get('password'),
        store.get('name')
    );
}
// Create Settings
function createSettings(db, setting) {
    var tx = db.transaction(['setting'], 'readwrite');
    var store = tx.objectStore('setting');
    var item = {
        theme: 'dino',
        color: 'green',
        password: setting.password,
        name: setting.name,
    };
    store.add(item);
    return tx.complete;
}
// Update Settings
function updateSettings(db, setting) {
    var tx = db.transaction(['setting'], 'readwrite');
    var store = tx.objectStore('setting');
    var item = {
        theme: setting.theme,
        color: setting.color,
        password: setting.password,
        name: setting.name,
    };
    store.put(item);
    return tx.complete;
}
/*

obejct references here but prob going to change
--- bullet 

//Also don't know how we are going to store nesting, figure out
what the front end is doing and how we can possibly adapt it
{
    
    done: true/false,
    text: " ",
    indent: number (how many "tabs" or how nested is it"),
    type: number (is it a todo, scheudle, note?),
    time: (date object), for reminders only, could be null or somth,
    tag: collection label (if we are having labels for different bullets 
        (like important for example)
    
}
--- goals
{
    text: " ",
    type: number (yearly, monthy),
    time: (date object), when will goal be done? 
}



*/
