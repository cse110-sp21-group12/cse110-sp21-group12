// Import the functions you need from the SDKs you need
// const { initializeApp } = require("https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js");
// // import { } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
// const { getDatabase, get, query, ref, remove, update } = require("https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js");

import { initializeApp } from './firebase-src/firebase-app.min.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArqOXre1W52S00EIs-54ozkaGsMQdxD80",
  authDomain: "stegosource-9lives.firebaseapp.com",
  databaseURL: "https://stegosource-9lives-default-rtdb.firebaseio.com",
  projectId: "stegosource-9lives",
  storageBucket: "stegosource-9lives.appspot.com",
  messagingSenderId: "364705687263",
  appId: "1:364705687263:web:8fbe6fb72389425043eb6a",
  measurementId: "G-ZFDM7MHPBX"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

// module.exports = {
//   app,
//   getDatabase,
//   get,
//   query,
//   ref,
//   remove,
//   update
// }