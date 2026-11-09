// Sélection des éléments du DOM
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Tableau pour stocker les tâches
let tasks = [];

// Fonction pour afficher les tâches
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Case à cocher pour terminer la tâche
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        // Texte de la tâche (input modifiable)
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = task.text;
        textInput.className = 'task-text';
        textInput.addEventListener('change', (e) => editTask(index, e.target.value));

        // Bouton pour supprimer la tâche
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        // Assemblage des éléments
        li.appendChild(checkbox);
        li.appendChild(textInput);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Fonction pour ajouter une tâche
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = '';
    renderTasks();
}

// Fonction pour modifier le texte d'une tâche
function editTask(index, newText) {
    if (newText.trim() === '') {
        deleteTask(index);
    } else {
        tasks[index].text = newText.trim();
        renderTasks();
    }
}

// Fonction pour basculer l'état (terminé / en cours)
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Fonction pour supprimer une tâche
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Écouteurs d'événements
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Premier rendu initial
renderTasks();