import { initializeApp } from './firebase-src/firebase-app.min.js';
import { getDatabase } from './firebase-src/firebase-database.min.js';
import { getAuth } from './firebase-src/firebase-auth.min.js';
import { GoogleAuthProvider } from './firebase-src/firebase-auth.min.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyArqOXre1W52S00EIs-54ozkaGsMQdxD80',
    authDomain: 'stegosource-9lives.firebaseapp.com',
    databaseURL: 'https://stegosource-9lives-default-rtdb.firebaseio.com',
    projectId: 'stegosource-9lives',
    storageBucket: 'stegosource-9lives.appspot.com',
    messagingSenderId: '364705687263',
    appId: '1:364705687263:web:8fbe6fb72389425043eb6a',
    measurementId: 'G-ZFDM7MHPBX',
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app);

/**
 * get current user's id
 * @returns user id. null if no user is signed in or the
 * user is not signed in (i.e bypassing the authentication).
 */
export function getUserID() {
    let user_id = null;
    auth.onAuthStateChanged((u) => {
        if (u) {
            user_id = u.uid;
        } else {
            // no user signed in or not signed in
        }
    });
    return user_id;
}
