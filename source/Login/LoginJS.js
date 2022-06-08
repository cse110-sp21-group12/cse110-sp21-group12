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
    handleLoginButton();
});
// make the reset-password-button redirect to Index
let resetPasswordButton = document.getElementById('reset-password-button');

resetPasswordButton.addEventListener('click', () => {
    handleResetPassword();
});

window.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        if (document.activeElement != resetPasswordButton) {
            loginButton.click();
        } else {
            resetPasswordButton.click();
        }
    }
});
window.onload = getLoginState();

/**
 * Connects to the database, and sees if
 * the user is new or returning
 */
function getLoginState() {
    // eslint-disable-next-line no-undef
    let dbPromise = initDB();
    dbPromise.onsuccess = function (e) {
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
 * handle reset password functionaliy of the associated
 */
function handleResetPassword() {
    resetPasswordButton.innerHTML = 'Confirm';
    resetPasswordButton.addEventListener('click', () => {
        // update settings
        if (verifyValidInputs(settingObj.username, passwordField.value)) {
            let userObject = {
                username: settingObj.username,
                password: passwordField.value,
                theme: '#d4ffd4',
            };
            // eslint-disable-next-line no-undef
            updateSettings(userObject);
            settingObj.password = passwordField.value;

            // log the user in
            sessionStorage.setItem('loggedIn', 'true');
            goHome();
        }
    });
}

/*function verifyValidInputs(newUsername, newPassword){
 * Helper function called from handleSignup()
 * Checks that username and PIN comply with length requirements and don't contain prohibited characters.
 * @param {String} newUsername Username to check
 * @param {String} newPassword password to check
 */
function verifyValidInputs(newUsername, newPassword) {
    var error = document.getElementById('errM');
    var errorU = document.getElementById('errU');

    //prohibit empty username
    if (newUsername.length == 0) {
        errorU.textContent = 'Please provide a username';
        passwordField.style.border = '1px solid Red';
        usernameField.style.border = '1px solid Red';
        errorU.style.display = 'block';
        return false;
    }
    //prohibit short names
    else if (newUsername.length < MIN_NAME_LENGTH) {
        errorU.textContent = 'Username must be at least 2 characters long';
        errorU.style.display = 'block';
        usernameField.style.border = '1px solid Red';
        return false;
    }
    //prohibit invalid characters in username
    else if (name_regex.test(newUsername)) {
        errorU.textContent = 'Username must not contain special characters';
        errorU.style.display = 'block';
        usernameField.style.border = '1px solid Red';

        return false;
    }

    //prohibit short passwords
    else if (newPassword.length < MIN_PIN_LENGTH) {
        errorU.style.display = 'none';
        error.textContent = 'PIN must be at least 4 digits long';
        error.style.display = 'block';
        usernameField.style.border = '';
        passwordField.style.border = '1px solid Red';
        return false;
    }
    //prohibit non-numeric PIN
    else if (pin_regex.test(newPassword)) {
        errorU.style.display = 'none';
        error.textContent = 'PIN must contain numbers only';
        error.style.display = 'block';
        usernameField.style.border = '';
        passwordField.style.border = '1px solid Red';
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
    var errM = document.getElementById('errM');
    if (correctPassword === password) {
        sessionStorage.setItem('loggedIn', 'true');
        goHome();
    } else {
        errM.textContent = 'Incorrect password!';
        passwordField.style.border = '1px solid Red';
        errM.style.display = 'block';
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
    resetPasswordButton.setAttribute('hidden', 'hidden');
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
    resetPasswordButton.removeAttribute('hidden');
    document.getElementById('title').innerText = 'Welcome back!';
    loginButton.innerText = 'Sign In';
}
