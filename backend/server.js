const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/insert', async (req, res) => {
  const { title, description, status } = req.body;

  const task = new Task({
    title,
    description,
    status
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


