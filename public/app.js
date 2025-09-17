async function fetchUsers() {
  const res = await fetch('/api/users');
  return res.json();
}

async function fetchPets() {
  const res = await fetch('/api/pets');
  return res.json();
}

function renderUsers(users) {
  const ul = document.getElementById('users-list');
  ul.innerHTML = '';
  const role = document.getElementById('role-filter').value;
  const filtered = role === 'all' ? users : users.filter(u => u.role === role);
  filtered.forEach(user => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${user.first_name} ${user.last_name} (${user.role})`;
    ul.appendChild(li);
  });
}

function renderPets(pets) {
  const ul = document.getElementById('pets-list');
  ul.innerHTML = '';
  pets.forEach(pet => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${pet.name} (${pet.species}) - Dueño: ${pet.owner?.first_name || 'Sin dueño'}`;
    ul.appendChild(li);
  });
}

async function main() {
  const users = await fetchUsers();
  renderUsers(users);
  const pets = await fetchPets();
  renderPets(pets);
}



main();

// Filtro por rol
document.getElementById('role-filter').addEventListener('change', async function() {
  const users = await fetchUsers();
  renderUsers(users);
});

// Manejo del formulario para generar datos
document.getElementById('generate-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const users = parseInt(document.getElementById('users').value);
  const pets = parseInt(document.getElementById('pets').value);
  const messageDiv = document.getElementById('form-message');
  messageDiv.textContent = '';
  try {
    const res = await fetch('/api/mocks/generateData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users, pets })
    });
    const data = await res.json();
    if (res.ok) {
      messageDiv.textContent = data.message || 'Datos generados correctamente.';
      await main();
    } else {
      messageDiv.textContent = data.error || 'Error al generar datos.';
      messageDiv.classList.remove('text-success');
      messageDiv.classList.add('text-danger');
    }
  } catch (err) {
    messageDiv.textContent = 'Error de conexión.';
    messageDiv.classList.remove('text-success');
    messageDiv.classList.add('text-danger');
  }
});
