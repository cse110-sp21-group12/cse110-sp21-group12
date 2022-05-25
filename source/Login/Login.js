import { db, auth, provider2 } from '../Backend/FirebaseInit.js';
import {
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    signInWithPopup
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

    // login event with Google authentication
    const googleLoginBtn = document.getElementById('login-google-button');
    googleLoginBtn.onclick = () => {
        googleSignIn();
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
                alert('Successfully signed in!');
                window.location.replace('../Index/Index.html');
            })
            .catch((error) => {
                alert('Login Failed: ' + error.message);
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
        alert('Password and re-typed password are different!');
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
                        alert('Successful Sign Up');
                        window.location.replace('../Index/Index.html');
                    });
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

/**
 * Sign in with the Google.
 * Authentication persistence is Session based.
 */
 function googleSignIn() {
    // set session persistence so status unchanged after refreshing
    auth.setPersistence(browserSessionPersistence).then(() => {
        signInWithPopup(auth, provider2)
            .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // switch to homepage
            // TODO
            alert('Successfully signed in!');
            window.location.replace('../Index/Index.html');
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
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
        alert('Invalid email!');
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
        alert('Password length must be at least six!');
        return false;
    }
    return true;
}

/**
 * Modify login page from login mode to signup mode
 */
function setSignUp() {
    document.getElementById('title').innerText = 'Make your Account';

    const passwordField = document.getElementById('pin');

    // create password confirmation field
    let passConfField = document.createElement('input');
    passConfField.type = 'password';
    passConfField.placeholder = 'Confirm Password';
    passConfField.id = 'passConf';
    // insert password confirmation after password field
    passwordField.parentNode.insertBefore(
        passConfField,
        passwordField.nextSibling
    );

    document.getElementById('sign-up-text').innerText =
        'Already have an account?';

    document.getElementById('login-button').innerText = 'SIGN UP';
    document.getElementById('signup-button').innerText = 'LOGIN';
}

function setLogin() {
    document.getElementById('title').innerText = 'Login to your Account';

    document.getElementById('sign-up-text').innerText =
        // eslint-disable-next-line
        "Don't have an account?";

    let passConf = document.getElementById('passConf');
    if (passConf) {
        document.getElementById('login-center').removeChild(passConf);
    }
    document.getElementById('login-button').innerText = 'LOGIN';
    document.getElementById('signup-button').innerText = 'SIGN UP';
}
