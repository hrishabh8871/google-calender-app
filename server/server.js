'use strict'
const http = require('http');
const express =  require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const config = require('./config')
const addTask = require('./routes/addTaskRoute')
const cronPickingEvent = require('./controller/addTaskController').cronPickingEvent
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

var cron = setInterval(async() => {
    await cronPickingEvent()    
}, 1000)

setTimeout(() => {
    clearInterval(cron)
}, 30000)

app.use('/api', addTask.routes);

// listen
app.listen(config.port, () => console.log(`Listening on url localhost ${config.port}`))