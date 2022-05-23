//minimum length values
const MIN_NAME_LENGTH = 2;
const MIN_PIN_LENGTH = 4;

//PIN restriction regex (identify bad PINs)
const pin_regex = /\D/;
//Username restriction regex (identify bad Usernames)
const name_regex = /[^\w-]/;

/**
 * gets the current session storage,
 * lasts as long as the tab or the browser is open
 * survives between reloads
 * -new tabs or closing it will refresh the session
 */
let storageSession = window.sessionStorage;
console.log('here is the storage session: ', storageSession);

//store current page state
let loginState;

//"settings" object retrieved from backend/storage
let settingObj;

//username box
let usernameField = document.getElementById('username');

//password box
let passwordField = document.getElementById('pin');

//make the login button redirect to Index
let loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
    if (loginState == 'returning') {
        handleLogin(passwordField.value);
    } else if (loginState == 'new') {
        handleSignup(usernameField.value.trim(), passwordField.value.trim());
    }
});

//make the toggle button change the page state
//let switchButton = document.getElementById('switch-screen');
//switchButton.addEventListener('click', toggleView);

window.onload = getLoginState();

/**
 * Connects to the database, and sees if
 * the user is new or returning
 */
function getLoginState() {
    // eslint-disable-next-line no-undef
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
        //console.log('database connected');
        // eslint-disable-next-line no-undef
        setDB(e.target.result);
        // eslint-disable-next-line no-undef
        let req = getSettings();
        req.onsuccess = function (e) {
            //console.log('got settings');
            console.log(e.target.result);
            settingObj = e.target.result;
            if (settingObj === undefined) {
                loginState = 'new';
                setNewUser();
            } else {
                loginState = 'returning';
                setReturningUser();
            }
        };
    };
}

/**
 * Handle a Sign-Up request from a new user
 *
 * @param {String} newUsername Display name of new user
 * @param {String} newPassword PIN of new user
 */
function handleSignup(newUsername, newPassword) {
    //call helper to check if inputs are valid
    if (verifyValidInputs(newUsername, newPassword)) {
        //if so, proceed
        let userObject = {
            username: newUsername,
            password: newPassword,
            theme: '#d4ffd4',
        };

        //update settings
        // eslint-disable-next-line no-undef
        updateSettings(userObject);

        //automatically log in
        sessionStorage.setItem('loggedIn', 'true');
        goHome();
    }
}

/**
 * Helper function called from handleSignup()
 * Checks that username and PIN comply with length requirements and don't contain prohibited characters.
 * @param {String} newUsername Username to check
 * @param {String} newPassword password to check
 */
function verifyValidInputs(newUsername, newPassword) {
    //prohibit empty username
    if (newUsername.length == 0) {
        alert('Please provide a username');
        return false;
    }
    //prohibit short names
    else if (newUsername.length < MIN_NAME_LENGTH) {
        alert('Username must be at least 2 characters long');
        return false;
    }
    //prohibit invalid characters in username
    else if (name_regex.test(newUsername)) {
        alert('Username must not contain special characters');
        return false;
    }

    //prohibit short passwords
    else if (newPassword.length < MIN_PIN_LENGTH) {
        alert('PIN must be at least 4 digits long');
        return false;
    }
    //prohibit non-numeric PIN
    else if (pin_regex.test(newPassword)) {
        alert('PIN must contain numbers only');
        return false;
    }

    //allow otherwise
    else {
        return true;
    }
}

/**
 * Handles Login request. Checks if password hash is correct, and if so, goes to index
 * (Password is "dinosaurs12")
 * Begins to handle the Login request. Checks sends the password hash to be verified.
 *
 * @param {String} password : PIN to be verified
 */
function handleLogin(password) {
    let correctPassword = settingObj.password;
    console.log(
        'Input: ' + password + ' | Correct password: ' + correctPassword
    );
    if (correctPassword === password) {
        //set login flag that user logged in
        // eslint-disable-next-line no-undef
        sessionStorage.setItem('loggedIn', 'true');
        goHome();
    } else {
        alert('Incorrect password!');
    }
}

/**
 * Redirect the browser to the Index page with a href
 */
function goHome() {
    window.location.href = '../Index/Index.html';
}
/**
 * Change the login screen to the "New User" mode
 * Hide username, update text.
 */
function setNewUser() {
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Create your login!';
    loginButton.innerText = 'Sign Up';
}

/**
 * Change the login screen to the "Returning User" mode
 * Show username, update text
 */
function setReturningUser() {
    document.getElementById('username').style.display = 'none';
    document.getElementById('title').innerText = 'Welcome back!';
    loginButton.innerText = 'Sign In';
}

/*

/**
 * Mock function for pretending to hash things
 *
 * @param {*} input Plaintext password to be hashed
 * @returns an encrypted hash representation of the password
function mockHash(input) {
    //console.log(input);
    let retval = 0;
    for (let i = 0; i < input.length; i++) {
        retval += input.charCodeAt(i);
    }
    //console.log(retval);
    return retval;
}

*/
