const firebase = require('firebase');
const config = require('./config');

const firebaseConfig = {
    apiKey: "AIzaSyCf0oZ0TRyGgmaOTYawFKd6rShqYYH5rvw",
    authDomain: "whitehatjr-4b335.firebaseapp.com",
    databaseURL: "https://whitehatjr-4b335-default-rtdb.firebaseio.com",
    projectId: "whitehatjr-4b335",
    storageBucket: "whitehatjr-4b335.appspot.com",
    messagingSenderId: "384527493714",
    appId: "1:384527493714:web:dbd56a36778591b0548d8b",
    measurementId: "G-WYBD18C966"
  };

const db = firebase.initializeApp(firebaseConfig);

module.exports = db;