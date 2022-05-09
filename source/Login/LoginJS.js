//setup hasher
//let sha1 = require('sha1');

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

//sotring setting got back
let settingObj;

//username box
let usernameField = document.getElementById('username');

//password box
let passwordField = document.getElementById('pin');

//make the login button redirect to Index
let loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', handleLoginButton);

// make the reset-password-button redirect to Index
let resetPasswordButton = document.getElementById('reset-password-button');
resetPasswordButton.addEventListener('click', () => {
    handleResetPassword();
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
        console.log('database connected');
        // eslint-disable-next-line no-undef
        setDB(e.target.result);
        // eslint-disable-next-line no-undef
        let req = getSettings();
        req.onsuccess = function (e) {
            console.log('got settings');
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
 * handle the login button functionalities
 */
function handleLoginButton() {
    if (loginState == 'returning') {
        handleLogin(passwordField.value);
    } else if (loginState == 'new') {
        handleSignup(usernameField.value, passwordField.value);
    }
}

/**
 * Handle a Sign-Up request from a new user
 *
 * @param {*} newUsername Display name of new user
 * @param {*} newPassword PIN of new user
 */
function handleSignup(newUsername, newPassword) {
    let userObject = {
        username: newUsername,
        password: newPassword,
        theme: '#d4ffd4',
    };
    //update settings
    // eslint-disable-next-line no-undef
    updateSettings(userObject);
    console.log('frontend: updating settings...');
    //make them log in
    //toggleView();
    console.lo('Account created! Please log in');
    sessionStorage.setItem('loggedIn', 'true');
    goHome();
}

/**
 * handle reset password functionaliy of the associated
 */
/**
 * handle the login button functionalities
 */

function handleResetPassword() {
    loginButton.innerHTML = 'Confirm';
    loginButton.removeEventListener('login-button', handleLoginButton);
    loginButton.addEventListener('click', () => {
        // update settings
        let userObject = {
            username: settingObj.username,
            password: passwordField.value,
            theme: '#d4ffd4',
        };
        // eslint-disable-next-line no-undef
        updateSettings(userObject);

        //sessionStorage.setItem('loggedIn', 'true');
        //handleLogin(userObject.password);
        // reset the button after clicked and update the settings
        loginButton.innerHTML = 'Sign-In';
        loginButton.addEventListener('click', handleLoginButton);
    });
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
    console.log('login');
    window.location.href = '../Index/Index.html';
}
/**
 * Change the login screen to the "New User" mode
 * Hide username, update text.
 */
function setNewUser() {
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Create your login!';
    loginButton.innerText = 'Sign-Up';
}

/**
 * Change the login screen to the "Returning User" mode
 * Show username, update text
 */
function setReturningUser() {
    document.getElementById('username').style.display = 'none';
    document.getElementById('title').innerText = 'Welcome back!';
    loginButton.innerText = 'Sign-In';
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
