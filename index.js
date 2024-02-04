const express = require('express');
const PORT = 5000;
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();

const Todo = require('./Schema')

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())

const MONGODB_URL = process.env.MONGODB_URL

app.get('/api/todos', async (req, res) => {
    
    try {
        const todos = await Todo.find()
        res.status(200).json(todos)
    } catch (error) {
        return res.status(500).json({Error: error.message})
    }
});


app.get('/api/todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id)

        return res.status(200).json(todo)
    } catch (error) {
        return res.status(500).json({Error: error.message})
    }
})

app.post('/api/todos/post', async (req,res) => {
    try {
        const {name} = req.body;

        const newTodo = new Todo({name:name})

        const saveTodo = await newTodo.save();
        return res.status(201).json(saveTodo)

    } catch (error) {
        return res.status(500).json({Error: error.message})
    }
})


app.put('/api/todos/:id', async (req,res) => {
    try {
        const updatedTodo = req.body

        const updatedResult = await Todo.findByIdAndUpdate(req.params.id, updatedTodo, { new: true });

        if(!updatedResult){
            return res.status(404).json({Error: "Todo not found."})
        }
        return res.status(200).json(updatedResult)

    } catch (error) {
        return res.status(500).json({Error: error.message})

    }
})


app.delete('/api/todos/:id', async (req,res) => {
    try {

        if(! mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({Error: "Invalid Id Format"})
        }
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)

        if(!deletedTodo){
            return res.status(404).json({Error: "Not Found"})
        }
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({Error: error.message})
    }
})

mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log({ Error: err.message });
    });
