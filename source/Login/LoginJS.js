//minimum length values
const MIN_NAME_LENGTH = 2;
const MIN_PIN_LENGTH = 4;

//PIN restriction regex (identify bad PINs)
//const pin_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
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

//password require message
var messgae = document.getElementById('message');

//make the login button redirect to Index
let loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', () => {
    messgae.style.display = 'none';
    message.classList.add('hidden');
    handleLoginButton();
});

// make the reset-password-button redirect to Index
let resetPasswordButton = document.getElementById('reset-password-button');
resetPasswordButton.addEventListener('click', () => {
    messgae.style.display = 'block';
    message.classList.remove('hidden');
    validFormat();
    handleResetPassword();
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

// if (loginState = 'new') {
//     passwordField.onfocus = function () {
//     document.getElementById('message').style.display = 'block';
//     passwordField.classList.add('clicking');
//     validFormat();
//     };
// }

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
    validFormat();
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
    resetPasswordButton.innerHTML = 'Comfirm';

    resetPasswordButton.addEventListener('click', () => {
        loginButton.addEventListener('click', () => {
            resetPasswordButton.innerHTML = 'Reset';
            resetPasswordButton.removeEventListener('click', validFormat);
            handleLoginButton();
        });
        if (loginState == 'returning') {
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
        } else {
            handleSignup(usernameField.value, passwordField.value);
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
    var error = document.getElementById('error');
    //prohibit empty username
    if (newUsername == '') {
        error.textContent = 'Username must not be empty';
        error.style.display = 'block';
        return false;
    }
    //prohibit short names
    else if (newUsername.length < MIN_NAME_LENGTH) {
        error.textContent = 'Username must be at least 2 characters long';
        error.style.display = 'block';
        return false;
    }
    //prohibit invalid characters in username
    else if (name_regex.test(newUsername)) {
        error.textContent = 'Username must not contain special characters';
        error.style.display = 'block';
        return false;
    }

    //prohibit short passwords
    else if (newPassword.length < MIN_PIN_LENGTH) {
        error.innerHTML = 'PIN must be at least 4 digits long';
        error.style.display = 'block';
        return false;
    }
    //prohibit non-numeric PIN
    else if (
        !newPassword.match('.*\\d.*') ||
        !newPassword.match('.*[a-z].*') ||
        !newPassword.match('.*[A-Z].*')
    ) {
        //alert('PIN must contain numbers only');
        error.textContent = 'PIN must Satisfy requirment below';
        error.style.display = 'block';
        return false;
    } else if (name_regex.test(newPassword)) {
        error.textContent = 'PIN must not contain special characters';
        error.style.display = 'block';
        return false;
    }

    //allow otherwise
    else {
        return true;
    }
}

function validFormat() {
    var myInput = document.getElementById('pin');
    var letter = document.getElementById('letter');
    var capital = document.getElementById('capital');
    var number = document.getElementById('number');
    var length = document.getElementById('length');
    var messgae = document.getElementById('message');
    // When the user clicks on the password field, show the message box
    // myInput.onfocus = function () {
    //     messgae.style.display = 'block';
    //     myInput.classList.add('clicking');
    // };
    // When the user clicks outside of the password field, hide the message box

    // When the user starts to type something inside the password field
    myInput.onkeyup = function () {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
            letter.classList.remove('invalid');
            letter.classList.add('valid');
        } else {
            letter.classList.remove('valid');
            letter.classList.add('invalid');
            // return false;
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital.classList.remove('invalid');
            capital.classList.add('valid');
        } else {
            capital.classList.remove('valid');
            capital.classList.add('invalid');
            // return false;
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number.classList.remove('invalid');
            number.classList.add('valid');
        } else {
            number.classList.remove('valid');
            number.classList.add('invalid');
            // return false;
        }

        // Validate length
        if (myInput.value.length >= 4) {
            length.classList.remove('invalid');
            length.classList.add('valid');
        } else {
            length.classList.remove('valid');
            length.classList.add('invalid');
        }
    };
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
        error.textContent = 'Incorrect password!';
        error.style.display = 'block';
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
    resetPasswordButton.removeAttribute('hidden');
    document.getElementById('username').style.display = 'none';
    document.getElementById('US').innerHTML = '';
    document.getElementById('title').innerText = 'Welcome back!';
    loginButton.innerText = 'Sign In';
}

function hide() {
    //document.getElementById('message').setAttribute("hidden", "hidden");
    document.getElementById('message').style.display = 'none';
}
