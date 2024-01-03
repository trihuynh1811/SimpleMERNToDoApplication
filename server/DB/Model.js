const mongoose = require('mongoose')

const schema = mongoose.Schema;

const taskSchema = new schema({
    name: {
        type: String,
        required: [true, 'must provide a name'],
        maxlength: [100, 'name cannot be over 100 character'],
        trim: true,
    },
    finish: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Task", taskSchema)