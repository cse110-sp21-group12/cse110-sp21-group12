import { db, auth } from '../Backend/FirebaseInit.js';
import {
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
} from '../Backend/firebase-src/firebase-auth.min.js';
import { set, ref } from '../Backend/firebase-src/firebase-database.min.js';

window.onload = () => {
    // login event
    const loginBtn = document.getElementById('login-button');
    if (loginBtn) {
        loginBtn.onclick = signIn;
    }

    // signup event
    const signupBtn = document.getElementById('signup-button');
    if (signupBtn) {
        signupBtn.onclick = signUp;
    }
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

    // validity check
    if (!isValidEmail(userEmail) || !isValidPassword(password)) {
        return;
    }

    let passwordConfirm = prompt('Please retype password:');
    if (!passwordConfirm) {
        return;
    } // user cancels signup

    // ensure password is the same as confirmed password
    if (password !== passwordConfirm) {
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
                    });

                    alert('Successful Sign Up');
                    window.location.replace('../Index/Index.html');
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

export function logout() {
    signOut(auth)
        .then(() => {
            // TODO
            // window.location.replace('./Login.html');
        })
        .catch((error) => {
            alert(error.message);
        });
}

function isValidEmail(userEmail) {
    if (userEmail.indexOf('@') === -1) {
        alert('Invalid email!');
        return false;
    }
    return true;
}

function isValidPassword(password) {
    if (password.length < 6) {
        alert('Password length must be at least six!');
        return false;
    }
    return true;
}
