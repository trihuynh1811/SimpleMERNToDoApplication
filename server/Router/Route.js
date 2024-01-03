const express = require('express')

const {
    getAllTasks,
    addTask,
    deleteAllTasks,
    deleteTask,
    editTask
} = require('../Controller/Controller')

const rounter = express.Router()

rounter.get("/tasks", getAllTasks)
rounter.post("/task", addTask)
rounter.delete("/tasks", deleteAllTasks).delete("/task", deleteTask)
rounter.put("/task", editTask)

module.exports = rounter