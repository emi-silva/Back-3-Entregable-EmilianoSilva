const express = require('express');
const mongoose = require('mongoose');
const { swaggerUi, specs } = require('./config/swagger');

// Solo importar 'open' si no estamos en un contenedor Docker
let open = null;
if (!process.env.DOCKER_ENV) {
  try {
    open = require('open').default;
  } catch (e) {
    console.log('Módulo open no disponible - ejecutándose en contenedor');
  }
}

const app = express();
app.use(express.json());

// Servir archivos estáticos
app.use('/public', express.static(__dirname + '/public'));

// Configuración Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-3-entregable';
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas base

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Importar y usar los routers de usuarios, mascotas y adopciones
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');
const adoptionsRouter = require('./routes/adoption.router');
const statsRouter = require('./routes/stats.router');
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/stats', statsRouter);

// Router de mocks simplificado para Docker (sin faker)
if (process.env.DOCKER_ENV) {
  const simpleMocksRouter = require('express').Router();
  
  simpleMocksRouter.get('/mockingusers', (req, res) => {
    const users = Array.from({ length: 50 }, (_, i) => ({
      _id: `mock_user_${i}`,
      first_name: `Usuario${i}`,
      last_name: `Test${i}`,
      email: `usuario${i}@test.com`,
      password: '$2a$10$hashed_password_example',
      role: i % 2 === 0 ? 'user' : 'admin',
      pets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    res.json(users);
  });

  simpleMocksRouter.get('/mockingpets', (req, res) => {
    const count = parseInt(req.query.count) || 10;
    const petNames = ['Luna', 'Max', 'Bella', 'Rocky', 'Milo', 'Lola', 'Bruno', 'Nina', 'Zeus', 'Coco'];
    const breeds = ['Labrador', 'Golden Retriever', 'Pastor Alemán', 'Bulldog Francés', 'Beagle', 'Boxer'];
    const colors = ['negro', 'marrón', 'blanco', 'dorado', 'gris', 'manchado'];
    const personalities = ['cariñoso', 'juguetón', 'tranquilo', 'energético', 'protector'];
    const cities = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'];
    
    const pets = Array.from({ length: count }, (_, i) => ({
      _id: `mock_pet_${i}`,
      name: petNames[i % petNames.length],
      species: 'perro',
      breed: breeds[i % breeds.length],
      age: Math.floor(Math.random() * 12) + 1,
      color: colors[i % colors.length],
      size: ['pequeño', 'mediano', 'grande'][i % 3],
      weight: Math.round((Math.random() * 30 + 5) * 100) / 100,
      description: `${petNames[i % petNames.length]} es un perro muy ${personalities[i % personalities.length]} que busca una familia amorosa.`,
      personality: [personalities[i % personalities.length], personalities[(i + 1) % personalities.length]],
      isVaccinated: Math.random() > 0.3,
      isNeutered: Math.random() > 0.4,
      healthStatus: 'bueno',
      adoptionStatus: 'disponible',
      goodWithKids: true,
      goodWithPets: true,
      location: {
        city: cities[i % cities.length],
        province: 'Buenos Aires',
        country: 'Argentina'
      },
      imageUrl: 'https://via.placeholder.com/300x300/4299E1/FFFFFF?text=🐾',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    res.json(pets);
  });
  
  simpleMocksRouter.post('/generateData', (req, res) => {
    const { users = 0, pets = 0 } = req.body;
    res.json({ 
      message: 'Datos simulados generados (Docker mode)', 
      users, 
      pets,
      note: 'En Docker se usa generación simplificada sin faker'
    });
  });
  
  app.use('/api/mocks', simpleMocksRouter);
} else {
  // Router de mocks completo para desarrollo local
  const mocksRouter = require('./routes/mocks.router');
  app.use('/api/mocks', mocksRouter);
}

// Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api-docs`);
  
  // Solo abrir navegador si no estamos en Docker y open está disponible
  if (open && !process.env.DOCKER_ENV) {
    setTimeout(() => open(`http://localhost:${PORT}`), 1000);
  }
});
