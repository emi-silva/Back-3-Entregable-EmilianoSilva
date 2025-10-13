const express = require('express');
const router = express.Router();

// Endpoints de mocking para la aplicación

const { generateMockUsers, generateMockPets, generateSimpleMockData } = require('../utils/mocking');

// GET /mockingusers: genera 50 usuarios mock
router.get('/mockingusers', (req, res) => {
  try {
    const users = generateMockUsers(50);
    res.json(users);
  } catch (error) {
    // Fallback para entorno Docker
    const simpleData = generateSimpleMockData();
    res.json(Array(50).fill(simpleData.users[0]));
  }
});

// GET /mockingpets: genera mascotas mock realistas
router.get('/mockingpets', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const pets = generateMockPets(count);
    res.json(pets);
  } catch (error) {
    // Fallback para entorno Docker
    const simpleData = generateSimpleMockData();
    res.json(Array(10).fill(simpleData.pets[0]));
  }
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
    let mockPets = [];
    try {
      mockPets = generateMockPets(pets);
      // Asignar algunos owners aleatorios
      mockPets.forEach(pet => {
        if (createdUsers.length > 0 && Math.random() > 0.3) {
          pet.owner = createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
        }
      });
    } catch (error) {
      // Fallback simple
      for (let i = 0; i < pets; i++) {
        const owner = createdUsers.length > 0 ? createdUsers[Math.floor(Math.random() * createdUsers.length)]._id : null;
        mockPets.push({
          name: `Pet${i + 1}`,
          species: 'perro',
          owner
        });
      }
    }
    const createdPets = await Pet.insertMany(mockPets);

    res.json({ message: 'Datos generados e insertados correctamente.', users: createdUsers.length, pets: createdPets.length });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar o insertar datos.', detalle: error.message });
  }
});
