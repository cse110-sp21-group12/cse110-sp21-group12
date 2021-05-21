//store current page state
var loginState = 'returning';

//make the login button redirect to Index
var login_button = document.getElementById('login-button');
login_button.addEventListener('click', goHome);

//make the toggle button change the page state
var switch_button = document.getElementById('switch-screen');
switch_button.addEventListener('click', toggleView);

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
    document.getElementById('username').style.display = 'none';
    document.getElementById('title').innerText = 'Create your login!';
    switch_button.innerText = 'Returning user?';
    login_button.innerText = 'Sign-Up';
}

/**
 * Change the login screen to the "Returning User" mode
 * Show username, update text
 */
function setReturningUser() {
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Welcome back!';
    switch_button.innerText = 'New user?';
    login_button.innerText = 'Sign-In';
}
