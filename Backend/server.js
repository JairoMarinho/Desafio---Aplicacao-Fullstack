// backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let tasks = [];
let nextId = 1;

// Rota para listar todas as tarefas
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }
    const newTask = { id: nextId++, title, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (title) task.title = title;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
