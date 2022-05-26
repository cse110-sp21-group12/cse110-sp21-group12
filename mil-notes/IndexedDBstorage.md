Looking at old storage:
Everything is a json object, I'm defining the fields of the object (eg: `bullets.text`, `monthlyGoals.goals.done`)

the following are building block objects, they aren't stored individually in the database, but instead the "object stores" contain them

bullet:
- text: string that contains the actual text
- done: a boolean if the bullet should be marked as done or not
- childList: an array containing more "bullet" objects that are it's children
- features: a string differentiating what kind of bullet we want (the picture on the left of the text), options are: "normal", "important", "workRelated", "household", "personal", "event", "other".  these end up loading different pictures to use

goal:
- text: string that contains the actual text
- done: boolean to mark if done


"object stores", they are keyed objects that are stored in IndexedDB that contain more info.

days (date attribute is the key):
- date: string in the form "MM/DD/YYYY"
- bullets: array of bullet objects (defined further down)
- photos: array of photo strings (pretty sure a string in b64)
- notes: string

monthlyGoals (month attribute is the key):
- month: string in the form "MM/YYYY"
- stores an array of goals

yearlyGoals (keyed by year, "xxxx")
- year: string in the form "YYYY"
- stores an array of goals

Example (refer to `source/backend/updatedMockData.json` other file):
Each user has 4 "object stores" in which everything is placed into (think of them as buckets each indexed by a key)

The way the old crud functions work is it only updates the day. month, year at a time. There is no way to directly only change the certain bullets/goals, since the keys don't get that specific, the only way that can happen is if you update an entire goal object (which could be inefficient in a way, but we can just have it update once before the user leaves the page and not on every update)

Mysteries of `bullet.js`:
- the problem of nestability is that there is not direct way for other bullet-entries to access the parent's parameters, particularly the json containing the data. This is the reason for the `JSON.stringify` stuff, we ended up hard-coding the needed json information as an attribute of the HTML element, and reference it that way in the shadow dom.
- Essentially the parent bullet makes the database call, and passes json as string to children (that's why there is "Stringify" and "JSON.parse" as we are converting between string and JSON)
- `DailyJS.js` event listeners for bullets is waiting for events to bubble up. Much like stated above, since we can't pass JSON up and down the shadowDOM, `DailyJS.js` reads the attributes and treats it as JSON, this way it is able to update the overall "bullets" array for the date object so it can update the database. Note that only `DailyJS.js` is making database calls, the individual bullets don't.