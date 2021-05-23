//setup hasher
//var sha1 = require('sha1');

//store current page state
var loginState = 'returning';

//username box
var usernameField = document.getElementById('username');

//password box
var passwordField = document.getElementById('pin');

//make the login button redirect to Index
var loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
    if (loginState == 'returning') {
        handleLogin(passwordField.value);
    } else if (loginState == 'new') {
        handleSignup(usernameField.value, passwordField.value);
    }
});

//make the toggle button change the page state
var switchButton = document.getElementById('switch-screen');
switchButton.addEventListener('click', toggleView);

/**
 * Handle toggling the state of the page, calls the setNewUser() and setReturningUser() helper functions
 */
function toggleView() {
    if (loginState == 'returning') {
        loginState = 'new';
        setNewUser();
    } else if (loginState == 'new') {
        loginState = 'returning';
        setReturningUser();
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
        password: mockHash(newPassword),
        theme: 1,
    };
    //update settings
    // eslint-disable-next-line no-undef
    updateSettings(userObject);
    console.log('frontend: updating settings...');
    //make them log in
    toggleView();
    alert('Account created! Please log in');
}

/**
 * Begins to handle the Login request. Checks sends the password hash to be verified.
 *
 * @param {*} password : PIN to be verified
 */
function handleLogin(password) {
    let hash = mockHash(password);
    console.log('Getting settings...');
    // eslint-disable-next-line no-undef
    let getSettingsRequest = getSettings();
    getSettingsRequest.onsuccess = (e) => {
        console.log(e.target.result);
        let correctPassword = e.target.result.password;
        console.log(
            'Input: ' + hash + ' | Correct password: ' + correctPassword
        );
        let retval = hash == correctPassword;
        console.log('Correct? ' + retval);
        if (retval == true) {
            goHome();
        } else {
            alert('Incorrect password!');
        }
    };
}

/**
 * Redirect the browser to the Index page with a href
 */
function goHome() {
    //alert('login');
    window.location.href = '../Index/index.html';
}
/**
 * Change the login screen to the "New User" mode
 * Hide username, update text.
 */
function setNewUser() {
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Create your login!';
    switchButton.innerText = 'Returning user?';
    loginButton.innerText = 'Sign-Up';
}

/**
 * Change the login screen to the "Returning User" mode
 * Show username, update text
 */
function setReturningUser() {
    document.getElementById('username').style.display = 'none';
    document.getElementById('title').innerText = 'Welcome back!';
    switchButton.innerText = 'New user?';
    loginButton.innerText = 'Sign-In';
}

/**
 * Mock function for pretending to hash things
 *
 * @param {*} input Plaintext password to be hashed
 * @returns an encrypted hash representation of the password
 */
function mockHash(input) {
    //console.log(input);
    let retval = 0;
    for (let i = 0; i < input.length; i++) {
        retval += input.charCodeAt(i);
    }
    //console.log(retval);
    return retval;
}
