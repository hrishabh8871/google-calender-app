'use strict'

const firebase = require('../db')
const Task = require('../models/task')
const UserDetails = require('../models/userDetails')
const firestore = firebase.firestore()

const login = async(req, res, next) => {    
    try {
        const data = req.body;
        const base_provider = firebase.auth.GoogleAuthProvider()
        firebase.auth.signInWithPopup(base_provider).then(response => {
            res.status(200).send({ status: 200, message: "Login Succeessfull", data: response })
        }).catch(err => res.status(404).send({ status: 404, message: err.message }))
        
    } catch(error) {
        res.status(400).send(error.message)
    }
}

const addTask = async(req, res, next) => {
    console.log('Add Task')
    console.log(req.body)    
    try {
        const data = req.body;
        const task = await firestore.collection('task').doc().set(data)
        .then(response => {            
            res.status(200).send({ status: 200, message: "Task Inserted" })
        }).catch(err => console.log(err))
    } catch(error) {
        res.status(400).send(error.message)
    }
}

const getAllTask = async(req, res) => {
    try {        
        const task = await firestore.collection('task')
        const data = await task.get();
        const taskArray = [];
        if(data.empty) {
            res.status(404).send('No task found')
        }else {
            data.forEach(doc => {
                const task = new Task(
                    doc.id,                    
                    doc.data().taskName,
                    doc.data().taskSubject,
                    doc.data().userId,
                    doc.data().status,
                    doc.data().completedAt,                    
                    doc.data().pickedAt,        
                    doc.data().createdAt,
                    doc.data().createdBy,
                );
                if(task.userId === req.body.userId) {
                    taskArray.push(task)
                }
            });            
            res.send(taskArray)
        }
    } catch(error) {
        res.status(400).send(error.message)
    }
}

const pickTask = async(req, res) => {
    try {
        console.log(req.body)
        const pickedId = req.body.pickedId
        const pickingId = req.body.pickingId
        const completedAt = req.body.completedAt
        const pickedAt = req.body.pickedAt
        var id = pickedId
        if(id || pickedId === pickingId) {
            const updateTask = await firestore.collection('task').doc(id);
            await updateTask.update({ status: 3, completedAt: completedAt })
        }
        id = pickingId
        if(!pickedId || pickedId !== pickingId) {
            const updatePickingTask = await firestore.collection('task').doc(id)
            await updatePickingTask.update({ status: 2, pickedAt: pickedAt })
        }
        res.status(200).send({ status: 200, message: 'Task Picked'})
    } catch(error) {
        res.status(400).send({ status: 400, message: error.message }) 
    }
}

const dashboard = async(req, res) => {
    console.log('Dashboard')
    try {
        console.log(req.body)
        const task = await firestore.collection('task')
        const data = await task.get();
        const taskArray = [];
        if(data.empty) {
            res.status(404).send('No task found')
        }else {
            data.forEach(doc => {
                const task = new Task(
                    doc.id,                    
                    doc.data().taskName,
                    doc.data().taskSubject,
                    doc.data().userId,
                    doc.data().status,
                    doc.data().completedAt,                    
                    doc.data().pickedAt,        
                    doc.data().createdAt,
                    doc.data().createdBy,
                );
                console.log(new Date(task.completedAt).getMonth())
                if(task.userId === req.body.userId && task.status === 3 && new Date(task.completedAt).getMonth() === parseInt(req.body.month)) {                    
                    task.completedAt = new Date(task.completedAt)
                    task.pickedAt = new Date(task.pickedAt)
                    taskArray.push(task)
                }
            });
            taskArray.sort((a, b) => {
                return a.completedAt - b.completedAt
            })
            console.log(taskArray)
            let firstWeek = 0;
            let secondWeek = 0;
            let thirdWeek = 0;
            let fourthWeek = 0            
            for(let taskArrayItem of taskArray) {                
                if(taskArrayItem.completedAt.getDate() < 8) {
                    firstWeek += new Date((taskArrayItem.completedAt.getTime() - taskArrayItem.pickedAt.getTime()) / 3600000)
                } else if(taskArrayItem.completedAt.getDate() < 16) {
                    secondWeek += new Date((taskArrayItem.completedAt.getTime() - taskArrayItem.pickedAt.getTime()) / 3600000)
                } else if(taskArrayItem.completedAt.getDate() < 24) {
                    thirdWeek += new Date((taskArrayItem.completedAt.getTime() - taskArrayItem.pickedAt.getTime()) / 3600000)
                }
                else if(taskArrayItem.completedAt.getDate() < 32) {
                    console.log('Here')
                    fourthWeek += (taskArrayItem.completedAt.getTime() - taskArrayItem.pickedAt.getTime()) / 3600000
                }
            }
            let dataValue = {
                firstWeek: firstWeek,
                secondWeek: secondWeek,
                thirdWeek: thirdWeek,
                fourthWeek: fourthWeek
            }
            res.status(200).send({ status: 200, message: 'Data of Task', data: dataValue })
        }
    } catch(error) {
        res.status(400).send({ status: 400, message: error.message }) 
    }
}

const userDetails = async(req, res, next) => {
    console.log('userDetails')
    console.log(req.body)
    // const data = req.body;
    try {
        const userDetail = await firestore.collection('userDetails')
        const data = await userDetail.get();
        const userDetailArray = [];
        await data.forEach(doc => {
            const userDetailDoc = new UserDetails(
                doc.id,            
                doc.data().name,
                doc.data().email,
                doc.data().userId,
                doc.data().startingDayTime,
                doc.data().endingDayTime,
                doc.data().lunchStartTime,        
                doc.data().lunchEndTime,            
                doc.data().createdAt
            );
            // console.log(userDetailDoc)
            if(userDetailDoc.userId === req.body.userId) {
                userDetailArray.push(userDetailDoc)
            }
        });                       
        if(userDetailArray.length > 0) {
            console.log('Update data')
            // console.log(userDetailArray)
            var id = req.body.id
            console.log(id)
            const updateUserDetail = await firestore.collection('userDetails').doc(id);
            await updateUserDetail.update({ name: req.body.name, email: req.body.email, userId: req.body.userId, startingDayTime: req.body.startingDayTime, endingDayTime: req.body.endingDayTime, lunchStartTime: req.body.lunchStartTime, lunchEndTime: req.body.lunchEndTime })
            res.status(200).send({ status : 200, message: 'User detail updated'})
        }
        else {
            console.log('Create data')
            try {
                const data = req.body;        
                const userDetail = await firestore.collection('userDetails').doc().set({ name: req.body.name, email: req.body.email, userId: req.body.userId, startingDayTime: req.body.startingDayTime, endingDayTime: req.body.endingDayTime, lunchStartTime: req.body.lunchStartTime, lunchEndTime: req.body.lunchEndTime })
                .then(response => {            
                    res.status(200).send({ status: 200, message: "User Details Inserted" })
                }).catch(err => console.log(err))
            } catch(error) {
                console.log(error)
                res.status(400).send(error.message)
            }
        }
    }
    
   catch(error) {
       console.log(error)
        res.status(400).send(error.message)
    }
}

const getUserDetails = async(req, res, next) => {
    console.log('get user details')
    try {
        const userDetails = await firestore.collection('userDetails')
        const data = await userDetails.get();
        const userDetailArray = [];        
        if(data.empty) {
            res.status(404).send('No User Details found')
        }else {
            data.forEach(doc => {
                const userDetail = new UserDetails(
                    doc.id,           
                    doc.data().name,
                    doc.data().email,
                    doc.data().userId,
                    doc.data().startingDayTime,
                    doc.data().endingDayTime,
                    doc.data().lunchStartTime,        
                    doc.data().lunchEndTime,            
                    doc.data().createdAt
                );
                console.log(userDetail)
                if(userDetail.userId === req.body.userId) {
                    userDetailArray.push(userDetail)
                }
            });            
            res.send(userDetailArray)
        }
    }
    
   catch(error) {
       console.log(error)
        res.status(400).send(error.message)
    }
}


const {google} = require('googleapis');
require('dotenv').config();

// Provide the required configuration
const CREDENTIALS = {
    "type": "service_account",
    "project_id": "whitehatjr-303302",
    "private_key_id": "3021d9e7b4fc7e30e1f16d2b4ee99538be23c636",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIHYPL2dFtLoGp\nh6dsc0SVmwU5HYRx72ho/NMc/jnKVTLkIFXfm4CMclO99uE/JUy/xOj5EtQc76v7\nRP4SGtwCfH1TFg0Rdn24s6+psEBppr2wG50tAKTKxYRjZSohDg/G0Y+YOw0o/Yzf\nzZEXJEduOO5lmfl9PekAZ5fDPi2dlUz6QHTETl9CCgWn8Gv3sqhhLFlRSidRBUMJ\ntTyljr7lm64yiefq9aTmAVMaeQ+OCZHkV4tDmIke0KUQHeDQrkVu8c5usfSVLByW\ngqH8dd2zL92U6KH1eaUK1FrUpOQk52yKIWymnFlvG3IyJ/QxHuHOW6UQSWrfDHcu\nMQbyfdSDAgMBAAECggEAA0qtwg68TM8D0TwaIJ1MTlijznlNkBHvoZ55gm85WyIH\n4T/cucDqebc8MgYz52m+HCQB4wx+Qz67QiF88jiUdMre6bteuJC+hfVhkAft6HUW\nkyts7FPYgJMvOS//1+haF49mq03g+2t2ku3eBztZzVmoPwBQpvtvdiVowMl9+clq\nhCXsybjDrhEA3zGFExTlf2oRVCDVAOqoRqfq1nYF92PxLcTqaI75fVbo1zbduhHM\nE8q7bO7s+N+G8WsEB9O5O4INX1MWD/HFAb0vYH2bQXHYQ2c4AeQNru4pkYokO3+0\n4sGAG0c0r9gXQSy0YeU3XRooeGf75HV3flRF6XJlQQKBgQD4TRjfYOMHNLhLPTzM\nRRiJYD6z8DTrubNvD2N2huiAPLmyRSDGekHolkKNLdVfBb2Ec1mEmINqg/MB7UD1\nMXcKZAZASHOaISCm7bQUSuaQ0dJcEQcwri1vpqO783g3FYZi/QNivMNVn4GzxTJ/\nFb0icYqRY17RoujJvtRhsU3CwwKBgQDOUfCfwc1EjTu50OKooTBNk3YEBv3/Qm46\nXeMei2kS0NhOCWYJBU7Tt+UQpzy/khKshUA6nknpXOt3LtwC0BAvtS//g8iFU50A\nbmToXD/NS4lTmgVISHE8jDH+rf6nrwIjZjowbNXRPA8iFWuwEoEMmGIKq5H9h4Nz\nuKkMaAsLQQKBgDyCdVRChTEFXQAg7UcOc5tO1Bj/qbXkbGDdTCzfVZuisNJL3F/h\n/VvT+mXzTHM6r+OuRJt2m1gCzd6jVdgq9MqYc5mIzns6JX3ooaDsW+Hg8DW1hJ4N\nZE84OeCcxagO29AVvpR6UdP06iPII7UqtAvHxbAGml3WKIq5sYIZNk0HAoGBAIe/\nggKbEOO5yUJJHdi1tYJVM6ESuKvqmXvtqjG+qDOpFajCpk/pHiRPKnf6kQ26nm7E\nfa4T162jZYnVWwy+uOeq3xnPK3ANw481E0+O4qvAt2o6PJ+Cin67/2kCMjtB+rYv\n3Llf4o74ZTyXu3Ltudr/qAI9QKD/OI47QX7YNewBAoGBAJMa1LQeDbFbw9wfMzIO\n+ZMfDqO3+wzhIkGY5s/Iy5NkYwB3TFFzpiYfT52+4K5aDYZHw6hVV1PT/zRXJM+u\nDYadf9fWrVn4BAQzY2su96GyORMbweT0kVnhD+Q+hYz4YDXjfOakvmVPVPgv/25D\nofLujOj0CJF0+lDXy8lemuhK\n-----END PRIVATE KEY-----\n",
    "client_email": "whithatjrgc@whitehatjr-303302.iam.gserviceaccount.com",
    "client_id": "112143311896062356037",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/whithatjrgc%40whitehatjr-303302.iam.gserviceaccount.com"
  }
const calendarId = "7d9aqdlt3rjfqn06285bu5h7gg@group.calendar.google.com"

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:30';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// let dateTime = dateTimeForCalander();

// // Event for Google Calendar
// let event = {
//     'summary': `This is the summary.`,
//     'description': `This is the description.`,
//     'start': {
//         'dateTime': dateTime['start'],
//         'timeZone': 'Asia/Kolkata'
//     },
//     'end': {
//         'dateTime': dateTime['end'],
//         'timeZone': 'Asia/Kolkata'
//     }
// };

// insertEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Get all the events between two dates
const getEvents = async (req, res) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: req.body.dateTimeStart,
            timeMax: req.body.dateTimeEnd,
            timeZone: 'Asia/Kolkata'
        });
    
        let items = response['data']['items'];
        res.status(200).send({ data: items })
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        res.status(400).send({ status: 400, message: error.message })
    }
};

// let start = '2020-10-03T00:00:00.000Z';
// let end = '2020-10-04T00:00:00.000Z';

// getEvents(start, end)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

module.exports = {
    addTask,
    getAllTask,    
    login,
    pickTask,
    dashboard,
    userDetails,
    getUserDetails,
    getEvents
}