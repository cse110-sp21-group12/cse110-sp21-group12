/**
 * Want to first check if database exists, and if not, set it up
 */

const DB_NAME = 'bujoBase';
const DB_VERSION = 1;

// eslint-disable-next-line no-unused-vars
let db;

/**
 * Function checks to see if this visotor has a databse set up
 * if it doesn't, then cretaes the stores and indicies
 * lastly, it assigns the actual db object from the promise
 * @returns void:
 */

// eslint-disable-next-line no-unused-vars
function initCall() {
    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB");
        return;
    }
    // not sure if we need to use dbPromise here
    // eslint-disable-next-line no-unused-vars
    let dbPromise = indexedDB
        // TBH idk why google calls this "upgradeDb", perhaps they refernce this creations as "upgrading"
        .open(DB_NAME, DB_VERSION, (upgradeDb) => {
            if (!upgradeDb.objectStoreNames.contains('days')) {
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
                upgradeDb.createObjectStore('days', { keyPath: 'date' });
            }
            if (!upgradeDb.objectStoreNames.contains('yearlyGoals')) {
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
                let yearlyOS = upgradeDb.createObjectStore('yearlyGoals', {
                    autoIncrement: true,
                });
                yearlyOS.createIndex('year', 'year', { unique: false });
            }
            if (!upgradeDb.objectStoreNames.contains('monthlyGoals')) {
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
                let monthlyOS = upgradeDb.createObjectStore('monthlyGoals', {
                    autoIncrement: true,
                });
                monthlyOS.createIndex('year', 'year', { unique: false });
                monthlyOS.createIndex('month', 'month', { unique: false });
            }
            if (!upgradeDb.objectStoreNames.contains('setting')) {
                /**
                 * creating a store to place the settings object
                 * This one is tricky, since the story would only have a
                 * max of 1 object (one per use). 
                 * We can always retrieve it with a key=1, but we have to make sure
                 * we only create this once
                 * -there doesn't seem to be a need to create additional indices
                    { theme: 1, passowrd: ..., name: ...  }
                 */
                upgradeDb.createObjectStore('setting', { autoIncrement: true });
            }
        })
        .then((evt) => {
            console.log('database connected');
            db = evt;
        });
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
