const Tasks = require('../DB/Model')

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find()
        return res.status(200).json({ tasks: tasks })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addTask = async (req, res) => {
    const task = new Tasks(req.body)

    try{
        const newTask = await task.save()
        return res.status(201).json({newTask: newTask})
    }catch(err){
        console.log(err)
        return res.status(418).json({message: err.message})
    }
}

const deleteAllTasks = async(req, res) => {
    try{
        const tasks = await Tasks.deleteMany({})
        return res.status(200).json({tasks: tasks})
    }catch(err){
        return res.status(418).json({message: err.message})
    }
}

const deleteTask = async(req, res) => {
    try{
        const id = req.body.taskID
        console.log(id)
        const task = await Tasks.findOneAndDelete({_id: id});
        if(!task){
            return res.status(400).json({message: `no id ${id}`})
        }
        return res.status(200).json(task)
    }catch(err){
        console.log(err)
        return res.status(418).json({message: err.message})
    }
}

const editTask = async(req, res) => {
    try{
        const name = req.body.name
        const finish = req.body.finish
        const id = req.body.id
        console.log(req.body)
        const task = await Tasks.findOneAndUpdate({_id: id}, {name: name, finish: finish}, {new: true, runValidators: true})
        console.log(task)
        if(!task){
            return res.status(400).json({message: `task with id: ${id} don't exist`})
        }
        return res.status(200).json({task: task})
    }catch(err){
        console.log(err)
        return res.status(418).json({message: err.message})
    }
}

module.exports = {getAllTasks, addTask, deleteAllTasks, deleteTask, editTask}