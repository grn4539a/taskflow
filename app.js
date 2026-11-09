let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'toutes';
let currentSort = 'echeance-asc';
let searchQuery = '';

const priorityWeights = { haute: 3, moyenne: 2, basse: 1 };

// 1. Ajouter une tâche
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    id: Date.now(),
    titre: document.getElementById('task-title').value,
    priorite: document.getElementById('task-priority').value,
    categorie: document.getElementById('task-category').value,
    echeance: document.getElementById('task-due-date').value,
    statut: 'a_faire'
  };

  tasks.push(newTask);
  saveAndRender();
  e.target.reset();
});

// 2. Filtrer par statut
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    renderTasks();
  });
});

// 3. Trier par priorité ou échéance
document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderTasks();
});

// 4. Recherche par mot-clé (Bonus)
document.getElementById('search-input').addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
});

function toggleStatus(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, statut: t.statut === 'a_faire' ? 'terminee' : 'a_faire' } : t);
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  // Application du filtre de statut
  let result = tasks.filter(t => {
    if (currentFilter === 'a_faire') return t.statut === 'a_faire';
    if (currentFilter === 'terminee') return t.statut === 'terminee';
    return true;
  });

  // Application de la recherche par mot-clé
  if (searchQuery) {
    result = result.filter(t => t.titre.toLowerCase().includes(searchQuery));
  }

  // Application du tri
  result.sort((a, b) => {
    if (currentSort === 'echeance-asc') return new Date(a.echeance) - new Date(b.echeance);
    if (currentSort === 'echeance-desc') return new Date(b.echeance) - new Date(a.echeance);
    if (currentSort === 'priorite-desc') return priorityWeights[b.priorite] - priorityWeights[a.priorite];
    if (currentSort === 'priorite-asc') return priorityWeights[a.priorite] - priorityWeights[b.priorite];
  });

  // Affichage HTML
  const listEl = document.getElementById('task-list');
  listEl.innerHTML = result.map(t => `
    <li class="task-item ${t.statut === 'terminee' ? 'done' : ''}">
      <div>
        <input type="checkbox" ${t.statut === 'terminee' ? 'checked' : ''} onchange="toggleStatus(${t.id})">
        <span>${escapeHtml(t.titre)}</span>
      </div>
      <div>
        <span class="badge badge-${t.categorie}">${t.categorie}</span>
        <span class="badge badge-${t.priorite}">${t.priorite}</span>
        <small>${formatDate(t.echeance)}</small>
        <button onclick="deleteTask(${t.id})">🗑️</button>
      </div>
    </li>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

renderTasks();
// ==========================================
// 1. SÉLECTION DES ÉLÉMENTS DU DOM
// ==========================================
const loginScreen = document.getElementById('login-screen');
const todoScreen = document.getElementById('todo-screen');
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggleMsg = document.getElementById('auth-toggle-msg');
const authToggleLink = document.getElementById('auth-toggle-link');
const passwordRequirements = document.getElementById('password-requirements');

const reqLength = document.getElementById('req-length');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');

// ==========================================
// 2. ÉTAT DE L'APPLICATION (STATE)
// ==========================================
let isLoginMode = true; // Alterne entre mode Connexion et Inscription
let currentUser = localStorage.getItem('currentUser') || null; 
let tasks = [];

// ==========================================
// 3. LOGIQUE D'AUTHENTIFICATION & ROBUSTESSE
// ==========================================

// Fonction de contrôle de robustesse du mot de passe
function checkPasswordStrength(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    // Mise à jour visuelle des prérequis
    reqLength.className = `req-item ${hasMinLength ? 'valid' : ''}`;
    reqLength.textContent = `${hasMinLength ? '✔' : '❌'} Au moins 8 caractères`;

    reqNumber.className = `req-item ${hasNumber ? 'valid' : ''}`;
    reqNumber.textContent = `${hasNumber ? '✔' : '❌'} Au moins 1 chiffre`;

    reqSpecial.className = `req-item ${hasSpecial ? 'valid' : ''}`;
    reqSpecial.textContent = `${hasSpecial ? '✔' : '❌'} Au moins 1 caractère spécial (@$!%*?&)`;

    return hasMinLength && hasNumber && hasSpecial;
}

// Écouteur en temps réel sur la saisie du mot de passe
passwordInput.addEventListener('input', (e) => {
    if (!isLoginMode) {
        checkPasswordStrength(e.target.value);
    }
});

// Basculer entre Connexion et Inscription
authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    authError.classList.add('hidden');
    authForm.reset();

    if (isLoginMode) {
        authTitle.textContent = "Connexion";
        authSubmitBtn.textContent = "Se connecter";
        authToggleMsg.textContent = "Pas encore de compte ?";
        authToggleLink.textContent = "S'inscrire";
        passwordRequirements.classList.add('hidden');
    } else {
        authTitle.textContent = "Inscription";
        authSubmitBtn.textContent = "Créer le compte";
        authToggleMsg.textContent = "Déjà un compte ?";
        authToggleLink.textContent = "Se connecter";
        passwordRequirements.classList.remove('hidden');
        checkPasswordStrength('');
    }
});

// Soumission du formulaire d'authentification
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    authError.classList.add('hidden');

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (isLoginMode) {
        // Mode Connexion
        if (users[username] && users[username].password === password) {
            login(username);
        } else {
            showAuthError("Identifiant ou mot de passe incorrect.");
        }
    } else {
        // Mode Inscription
        if (users[username]) {
            showAuthError("Cet identifiant existe déjà.");
            return;
        }

        // Validation finale de robustesse
        if (!checkPasswordStrength(password)) {
            showAuthError("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }

        // Enregistrement du nouvel utilisateur
        users[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Connexion automatique après inscription
        login(username);
    }
});

function showAuthError(message) {
    authError.textContent = message;
    authError.classList.remove('hidden');
}

function login(username) {
    currentUser = username;
    localStorage.setItem('currentUser', username);
    authForm.reset();
    initApp();
}

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    initApp();
});


// ==========================================
// 4. LOGIQUE GESTIONNAIRE DE TÂCHES
// ==========================================

function saveToLocalStorage() {
    if (currentUser) {
        // Clé unique par utilisateur pour ne pas mélanger les tâches
        localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = task.text;
        textInput.className = 'task-text';
        textInput.addEventListener('change', (e) => editTask(index, e.target.value));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(textInput);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    saveToLocalStorage(); 
    renderTasks();
}

function editTask(index, newText) {
    if (newText.trim() === '') {
        deleteTask(index);
    } else {
        tasks[index].text = newText.trim();
        saveToLocalStorage();
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
}

// Écouteurs tâches
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});


// ==========================================
// 5. INITIALISATION ET ROUTING
// ==========================================
function initApp() {
    if (currentUser) {
        // Utilisateur connecté : Afficher l'application
        loginScreen.classList.add('hidden');
        todoScreen.classList.remove('hidden');
        
        // Charger les tâches propres à cet utilisateur
        tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        renderTasks();
    } else {
        // Utilisateur déconnecté : Afficher le formulaire d'accès
        loginScreen.classList.remove('hidden');
        todoScreen.classList.add('hidden');
        isLoginMode = true;
        authTitle.textContent = "Connexion";
        authSubmitBtn.textContent = "Se connecter";
        authToggleMsg.textContent = "Pas encore de compte ?";
        authToggleLink.textContent = "S'inscrire";
        passwordRequirements.classList.add('hidden');
    }
}

// Lancement au chargement de la page
initApp();