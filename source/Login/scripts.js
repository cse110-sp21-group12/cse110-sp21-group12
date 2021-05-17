var loginState = 'returning';

var login_button = document.getElementById('login-button');
login_button.addEventListener('click', goHome);

var switch_button = document.getElementById('switch-screen');

switch_button.addEventListener('click', toggleView);

function toggleView() {
    if (loginState == 'returning') {
        loginState = 'new';
        setNewUser();
    } else if (loginState == 'new') {
        loginState = 'returning';
        setReturningUser();
    }
}

function goHome() {
    //alert('login');
    window.location.href = '../Index/index.html';
}

function setNewUser() {
    document.getElementById('username').style.display = 'none';
    document.getElementById('title').innerText = 'Create your login!';
    switch_button.innerText = 'Returning user?';
    login_button.innerText = 'Sign-Up';
}

function setReturningUser() {
    document.getElementById('username').style.display = 'flex';
    document.getElementById('title').innerText = 'Welcome back!';
    switch_button.innerText = 'New user?';
    login_button.innerText = 'Sign-In';
}
