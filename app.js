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

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');

// ==========================================
// 2. ÉTAT DE L'APPLICATION (STATE)
// ==========================================
let isLoginMode = true;
let currentUser = localStorage.getItem('currentUser') || null; 
let tasks = [];
let currentFilter = 'toutes';
let currentSort = 'echeance-asc';
let searchQuery = '';

const priorityWeights = { haute: 3, moyenne: 2, basse: 1 };

// ==========================================
// 3. LOGIQUE D'AUTHENTIFICATION & ROBUSTESSE
// ==========================================
function checkPasswordStrength(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    reqLength.className = `req-item ${hasMinLength ? 'valid' : ''}`;
    reqLength.textContent = `${hasMinLength ? '✔' : '❌'} Au moins 8 caractères`;

    reqNumber.className = `req-item ${hasNumber ? 'valid' : ''}`;
    reqNumber.textContent = `${hasNumber ? '✔' : '❌'} Au moins 1 chiffre`;

    reqSpecial.className = `req-item ${hasSpecial ? 'valid' : ''}`;
    reqSpecial.textContent = `${hasSpecial ? '✔' : '❌'} Au moins 1 caractère spécial (@$!%*?&)`;

    return hasMinLength && hasNumber && hasSpecial;
}

passwordInput.addEventListener('input', (e) => {
    if (!isLoginMode) checkPasswordStrength(e.target.value);
});

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

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    authError.classList.add('hidden');

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (isLoginMode) {
        if (users[username] && users[username].password === password) {
            login(username);
        } else {
            showAuthError("Identifiant ou mot de passe incorrect.");
        }
    } else {
        if (users[username]) {
            showAuthError("Cet identifiant existe déjà.");
            return;
        }
        if (!checkPasswordStrength(password)) {
            showAuthError("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }
        users[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(users));
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
function saveAndRender() {
    if (currentUser) {
        localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
        renderTasks();
    }
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    titre: document.getElementById('task-title').value.trim(),
    priorite: document.getElementById('task-priority').value,
    categorie: document.getElementById('task-category').value,
    echeance: document.getElementById('task-due-date').value,
    statut: 'a_faire'
  };
  tasks.push(newTask);
  saveAndRender();
  e.target.reset();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    renderTasks();
  });
});

sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderTasks();
});

searchInput.addEventListener('input', (e) => {
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

function editTaskTitle(id, newTitle) {
    if (newTitle.trim() === '') {
        deleteTask(id);
    } else {
        tasks = tasks.map(t => t.id === id ? { ...t, titre: newTitle.trim() } : t);
        saveAndRender();
    }
}

function renderTasks() {
  taskList.innerHTML = '';

  // 1. Filtrage statut
  let result = tasks.filter(t => {
    if (currentFilter === 'a_faire') return t.statut === 'a_faire';
    if (currentFilter === 'terminee') return t.statut === 'terminee';
    return true;
  });

  // 2. Filtrage recherche
  if (searchQuery) {
    result = result.filter(t => t.titre.toLowerCase().includes(searchQuery));
  }

  // 3. Tri
    result.sort((a, b) => {
    if (currentSort === 'echeance-asc') return new Date(a.echeance) - new Date(b.echeance);
    if (currentSort === 'echeance-desc') return new Date(b.echeance) - new Date(a.echeance);
    if (currentSort === 'priorite-desc') return priorityWeights[b.priorite] - priorityWeights[a.priorite];
    if (currentSort === 'priorite-asc') return priorityWeights[a.priorite] - priorityWeights[b.priorite];
    });

  // 4. Génération du DOM
    result.forEach(t => {
    const li = document.createElement('li');
    li.className = `task-item ${t.statut === 'terminee' ? 'done' : ''}`;

    // Partie gauche (Checkbox + Titre)
    const leftDiv = document.createElement('div');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.statut === 'terminee';
    checkbox.addEventListener('change', () => toggleStatus(t.id));

    const textSpan = document.createElement('span');
    textSpan.textContent = t.titre;
    textSpan.title = "Double-cliquez pour modifier";

    // 🔴 LOGIQUE DE MODIFICATION : Double-clic pour éditer le titre
    textSpan.addEventListener('dblclick', () => {
        if (t.statut === 'terminee') return; // Optionnel : empêche d'éditer une tâche finie

        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.value = t.titre;
        inputEdit.className = 'task-inline-edit'; // Vous pouvez ajouter du style spécifique en CSS si besoin

        // Sauvegarde lors de la validation
        const saveEdit = () => {
            editTaskTitle(t.id, inputEdit.value);
        };

        inputEdit.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') renderTasks(); // Annule
        });

        inputEdit.addEventListener('blur', saveEdit);

        // Remplacement temporaire du texte par le champ de saisie
        leftDiv.replaceChild(inputEdit, textSpan);
        inputEdit.focus();
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(textSpan);

    // Partie droite (Badges + Date + Bouton)
    const rightDiv = document.createElement('div');

    const catBadge = document.createElement('span');
    catBadge.className = `badge badge-${t.categorie}`;
    catBadge.textContent = t.categorie;

    const prioBadge = document.createElement('span');
    prioBadge.className = `badge badge-${t.priorite}`;
    prioBadge.textContent = t.priorite;

    const dateEl = document.createElement('small');
    dateEl.textContent = formatDate(t.echeance);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTask(t.id));

    rightDiv.appendChild(catBadge);
    rightDiv.appendChild(prioBadge);
    rightDiv.appendChild(dateEl);
    rightDiv.appendChild(deleteBtn);

    // Assemblage final
    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    taskList.appendChild(li);
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
}
// ==========================================
// 5. INITIALISATION ET ROUTING
// ==========================================
function initApp() {
    if (currentUser) {
        loginScreen.classList.add('hidden');
        todoScreen.classList.remove('hidden');
        tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        renderTasks();
    } else {
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

initApp();