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

//storing setting got back
let settingObj;

//username box
let usernameField = document.getElementById('username');

//password box
let passwordField = document.getElementById('pin');

//get sign up button
let signupButton = document.getElementById('signup-button');

//boolean for determining if login or sign up is displayed
let loginPage = true;

//make the login button redirect to Index
let loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
    if (loginState == 'returning') {
        handleLogin(passwordField.value);
    } else if (loginState == 'new') {
        handleSignup(usernameField.value, passwordField.value);
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
        console.log('database connected');
        // eslint-disable-next-line no-undef
        setDB(e.target.result);
        // eslint-disable-next-line no-undef
        let req = getSettings();
        req.onsuccess = function (e) {
            console.log('got settings');
            console.log(e.target.result);
            settingObj = e.target.result;
            // if (settingObj === undefined) {
            //     loginState = 'new';
            //     setNewUser();
            // } else {
            //     loginState = 'returning';
            //     setReturningUser();
            // }
        };
    };
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
    alert('Account created! Please log in');
    sessionStorage.setItem('loggedIn', 'true');
    goHome();
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
 * Change the login screen to the "Login" mode
 * login is first button, sign up is second.
 */
function setLogin() {
    loginPage = true;
    document.getElementById('google-button').textContent =
        'Sign in with Google';
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Login to your Account';
    document.getElementById('sign-up-text').innerText =
        // enforcing use of single quotes for the next line will result in needing to escape the apos. in "don't". manually overriding
        // eslint-disable-next-line
        "Don't have an account?";
    loginButton.innerText = 'LOGIN';
    signupButton.innerText = 'SIGN UP';
}

/**
 * Change the login screen to the "Sign Up" mode
 * sign up is first button, login is second.
 */
function setSignUp() {
    loginPage = false;
    document.getElementById('google-button').textContent =
        'Sign up with Google';
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Make your Account';
    document.getElementById('sign-up-text').innerText =
        'Already have an account?';
    loginButton.innerText = 'SIGN UP';
    signupButton.innerText = 'LOGIN';
}

/**
 * Checks login state to see if needs to change to sign up mode if alreday in login
 * or login mode if already in sign up.
 */
signupButton.addEventListener('click', () => {
    if (loginPage) {
        setSignUp();
    } else {
        setLogin();
    }
});

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
