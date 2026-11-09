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