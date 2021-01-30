'use strict'
const functions = require("firebase-functions");
const http = require('http');
const express =  require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
// const config = require('../config')
const addTask = require('./routes/addTaskRoute')
// app config
const app = express();

app.use(cors());
app.use(express.json())
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    next();
});

app.use('/api', addTask.routes);

// listen
app.listen(8000, () => console.log(`Listening on url localhost ${8000}`))
exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
