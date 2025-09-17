const express = require('express');
const router = express.Router();

// Endpoint /mockingpets migrado aquí
router.get('/mockingpets', (req, res) => {
  // Aquí irá la lógica original de mockingpets
  res.json({ message: 'Endpoint /mockingpets funcionando en mocks.router.js' });
});

// Endpoint GET /mockingusers y POST /generateData se agregarán aquí

const { generateMockUsers } = require('../utils/mocking');

// GET /mockingusers: genera 50 usuarios mock
router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50);
  res.json(users);
});

module.exports = router;

const User = require('../models/User');
const Pet = require('../models/Pet');

// POST /generateData: genera e inserta usuarios y mascotas
router.post('/generateData', async (req, res) => {
  const { users = 0, pets = 0 } = req.body;
  // Validación de parámetros
  if (typeof users !== 'number' || typeof pets !== 'number' || users < 0 || pets < 0) {
    return res.status(400).json({ error: 'Parámetros inválidos: users y pets deben ser números positivos.' });
  }
  try {
    // Generar usuarios
    const mockUsers = generateMockUsers(users);
    const createdUsers = await User.insertMany(mockUsers);

    // Generar mascotas
    const mockPets = [];
    for (let i = 0; i < pets; i++) {
      const owner = createdUsers.length > 0 ? createdUsers[Math.floor(Math.random() * createdUsers.length)]._id : null;
      mockPets.push({
        name: `Pet${i + 1}`,
        species: 'dog',
        owner
      });
    }
    const createdPets = await Pet.insertMany(mockPets);

    res.json({ message: 'Datos generados e insertados correctamente.', users: createdUsers.length, pets: createdPets.length });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar o insertar datos.', detalle: error.message });
  }
});
