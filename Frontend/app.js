// frontend/js/app.js

const API_URL = 'http://localhost:3000/tasks';

// Carregar tarefas ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Função para carregar tarefas da API
function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = createTaskItem(task);
                taskList.appendChild(taskItem);
            });
        });
}

// Função para criar o item da tarefa na lista
function createTaskItem(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
        <span>${task.title}</span>
        <div>
            <span class="edit" onclick="editTask(${task.id})">Editar</span>
            <span class="delete" onclick="deleteTask(${task.id})">Excluir</span>
        </div>
    `;
    return li;
}

// Adicionar nova tarefa
document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input');
    const title = taskInput.value;

    if (!title) return;

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    })
        .then(response => response.json())
        .then(newTask => {
            const taskList = document.getElementById('task-list');
            const taskItem = createTaskItem(newTask);
            taskList.appendChild(taskItem);
            taskInput.value = ''; // Limpa o campo de texto
        });
});

// Editar tarefa
function editTask(id) {
    const newTitle = prompt('Edite o título da tarefa:');
    if (!newTitle) return;

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
    }).then(() => {
        loadTasks(); // Recarrega as tarefas após a edição
    });
}

// Excluir tarefa
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    }).then(() => {
        loadTasks(); // Recarrega as tarefas após a exclusão
    });
}
