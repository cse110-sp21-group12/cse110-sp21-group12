import { db, auth } from '../Backend/FirebaseInit.js';
import {
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
} from '../Backend/firebase-src/firebase-auth.min.js';
import { set, ref } from '../Backend/firebase-src/firebase-database.min.js';

window.onload = () => {
    // login / signup event depending on button texts
    const loginBtn = document.getElementById('login-button');
    loginBtn.onclick = () => {
        if (loginBtn.innerText === 'LOGIN') {
            signIn();
        } else {
            signUp();
        }
    };

    // change view of login and signup
    const signupBtn = document.getElementById('signup-button');
    signupBtn.onclick = () => {
        if (signupBtn.innerText === 'LOGIN') {
            setLogin();
        } else {
            setSignUp();
        }
    };
};

/**
 * Sign in with the email and pin from the user input.
 * Authentication persistence is Session based.
 */
function signIn() {
    let userEmail = document.getElementById('email').value;
    let password = document.getElementById('pin').value;

    // validity check
    if (!isValidEmail(userEmail) || !isValidPassword(password)) {
        return;
    }

    // set session persistence so status unchanged after refreshing
    auth.setPersistence(browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, userEmail, password)
            // eslint-disable-next-line no-unused-vars
            .then((userCredential) => {
                // TODO
                custAlert('Successfully signed in!');
                window.location.replace('../Index/Index.html');
            })
            .catch((error) => {
                custAlert('Login Failed: ' + error.message);
            });
    });
}

/**
 * New user sign up with email and password given.
 */
// eslint-disable-next-line no-unused-vars
function signUp() {
    let userEmail = document.getElementById('email').value;
    let password = document.getElementById('pin').value;
    let passConfirm = document.getElementById('passConf').value;

    // validity check
    if (!isValidEmail(userEmail) || !isValidPassword(password)) {
        return;
    }

    // ensure password is the same as confirmed password
    if (password !== passConfirm) {
        custAlert('Password and re-typed password are different!');
        return;
    }

    auth.setPersistence(browserSessionPersistence).then(() => {
        createUserWithEmailAndPassword(auth, userEmail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user) {
                    let data = {
                        email: userEmail,
                        theme: '#d4ffd4',
                    };

                    // add user data to db
                    // eslint-disable-next-line no-undef
                    set(ref(db, `${user.uid}`), data).then(() => {
                        console.log('Successfully added!');
                        custAlert('Successful Sign Up');
                        window.location.replace('../Index/Index.html');
                    });
                }
            })
            .catch((error) => {
                custAlert(error.message);
            });
    });
}

/**
 * Handle user logout event and redirection to login page.
 */
export function logout() {
    signOut(auth)
        .then(() => {
            // TODO
            window.location.replace('./Login.html');
        })
        .catch((error) => {
            alert(error.message);
        });
}

/**
 * Check if input string is an email
 * @param {String} userEmail
 * @returns true if email is valid
 */
function isValidEmail(userEmail) {
    if (userEmail.indexOf('@') === -1) {
        custAlert('Invalid email!');
        return false;
    }
    return true;
}

/**
 * Check if password length is at least six.
 * @param {String} password
 * @returns true or false
 */
function isValidPassword(password) {
    if (password.length < 6) {
        custAlert('Password length must be at least six!');
        return false;
    }
    return true;
}

/**
 * Make pop up alert with custom css and text that is passed in
 * @param {String} text
 */
function custAlert(text) {
    document.querySelector('.alert').style.display = 'block';
    document.querySelector('.alert').innerHTML =
        '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span>' +
        text;
}

let togPassword = document.querySelector('.right-icons');
let password = document.querySelector('.pass');
/**
 * Show or hide password
 */
togPassword.addEventListener('click', function () {
    let type =
        password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    if (type === 'password') {
        togPassword.setAttribute('src', '../Images/show-pass.png');
    } else {
        togPassword.setAttribute('src', '../Images/hide-pass.png');
    }
});

/**
 * Modify login page from login mode to signup mode
 */
function setSignUp() {
    document.getElementById('title').innerText = 'Make your Account';

    //const passwordField = document.getElementById('pin');

    // // create password confirmation field
    // let passConfField = document.createElement('input');
    // passConfField.type = 'password';
    // passConfField.placeholder = 'Confirm Password';
    // passConfField.id = 'passConf';
    // // insert password confirmation after password field
    // passwordField.parentNode.insertBefore(
    //     passConfField,
    //     passwordField.nextSibling
    // );

    document.getElementById('passConfirm').style.display = 'flex';
    document.getElementById('passReq').style.display = 'flex';
    document.getElementById('sign-in-email-text').innerText =
        'or sign up with email';
    document.getElementById('google-button').innerHTML =
        '<img src="../Images/google.png">Sign up with Google';
    document.getElementById('sign-up-text').innerText =
        'Already have an account?';

    document.getElementById('login-button').innerText = 'SIGN UP';
    document.getElementById('signup-button').innerText = 'LOGIN';
}

function setLogin() {
    document.getElementById('title').innerText = 'Login to your Account';
    document.getElementById('google-button').innerHTML =
        '<img src="../Images/google.png">Sign in with Google';
    document.getElementById('sign-in-email-text').innerText =
        'or sign in with email';
    document.getElementById('sign-up-text').innerText =
        // eslint-disable-next-line
        "Don't have an account?";
    document.getElementById('passConfirm').style.display = 'none';
    document.getElementById('passReq').style.display = 'none';
    // let passConf = document.getElementById('passConf');
    // if (passConf) {
    //     document.getElementById('login-center').removeChild(passConf);
    // }
    document.getElementById('login-button').innerText = 'LOGIN';
    document.getElementById('signup-button').innerText = 'SIGN UP';
}
