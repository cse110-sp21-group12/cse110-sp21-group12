# How to use Crud functions

The backendInit have implemented the Create, Read, and Update. We do not have a delete because we are assuming that everytime we enter a page, we will create data for that page immediately.

### Get

    `function get____(data){
        let tx = db.transaction(['id'], 'readonly');
        let store = tx.objecStore('id');
        let request = store.get(data);
        return request
    }`

### Create

    `function create____(data) {
        let tx = db.transaction('days', 'readwrite');
        let store = tx.objectStore('days');
        let request = store.add(dateData);
    }`

### Update

    `function update____(data) {
    	let tx = db.transaction(['id'], 'readwrite');
        let store = tx.objectStore('id');
        let request = store.put(data);
     }   `

For all these functions, you will have 3 of them for each object: days, monthlyGoals, yearlyGoals, setting.

### How to access data

What you will need to do is one you have created or read new data into the database using `create___(data)` in which data will be the value you will be storing when you leave the page. Lets say `data` is the data for the day, then day will contain `day.notes, day.bullets, day.date, day.photos`
and you would pass `day` as a parameter.
When trying to get the data based on the key we want, you will need to write the following lines,

    `
        let req = getMonthlyGoals('12/2021');
        req.onsuccess = function (e) {
            console.log('got monthly goals');
            console.log(e.target.result);
            /*
                Continue to do anything you need here.
            */
        };`

Here you need to declare a new variable `req` and set it to one of the get function and pass the correct key. When you are able to get the promise request, you will do all the operations in the `re.onsuccess` function for you to use the data, you will need to use `e.target.result`.
This is only needed to be used when you have just entered the page, this is the first thing you do as it is a get function.

An example is when you enter the daily page but you need to display all the values of `day.notes, day.bullets, day.date, day.photos`. Once you leave the page, you will use the update function. However, if it is the first time you enter the page, you will need to use the create function.
