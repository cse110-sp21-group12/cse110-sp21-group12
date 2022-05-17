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
    if (loginBtn !== null) {
        loginBtn.onclick = () => {
            signIn();
        };
    }
};

/**
 * Sign in with the email and pin from the user input.
 * Authentication persistence is Session based.
 */
function signIn() {
    let userEmail = document.getElementById('email').value;
    let password = document.getElementById('pin').value;

    if (userEmail.indexOf('@') !== -1 && password.length !== 0) {
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
}

/**
 * New user sign up with email and password given.
 */
// eslint-disable-next-line no-unused-vars
function signUp() {
    let userEmail = document.getElementById('email').value;
    let userPassword = document.getElementById('pin').value;
    let passwordConfirm = document.getElementById('pin-conf').value;

    //ensure password === confirm password
    if (userPassword !== passwordConfirm) {
        alert('Password and re-typed password are different!');
        return;
    }

    auth.setPersistence(browserSessionPersistence).then(() => {
        createUserWithEmailAndPassword(auth, userEmail, userPassword)
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
