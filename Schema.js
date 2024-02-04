const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

const Todo = mongoose.model('Todo', Schema)

module.exports = Todo