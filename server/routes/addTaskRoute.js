const express = require('express');
const { login, addTask, getAllTask, pickTask, dashboard, userDetails, getUserDetails } = require('../controller/addTaskController')

const router = express.Router();

router.post('/login', login)
router.post('/addTask', addTask)
router.post('/listTask', getAllTask)
router.post('/pickTask', pickTask)
router.post('/dashboard', dashboard)
router.post('/userDetails', userDetails)
router.post('/getUserDetails', getUserDetails)

module.exports = {
    routes: router
}