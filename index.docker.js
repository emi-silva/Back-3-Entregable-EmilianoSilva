const express = require('express');
const mongoose = require('mongoose');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();
app.use(express.json());

// Servir archivos estáticos
app.use('/public', express.static(__dirname + '/public'));

// Configuración Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/back3';
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas base

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Importar y usar el router de mocks (versión simplificada sin faker)
import mocksRouterSimple from './routes/mocks.simple.router.js';
app.use('/api/mocks', mocksRouterSimple);

// Importar y usar los routers de usuarios, mascotas y adopciones
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');
const adoptionsRouter = require('./routes/adoption.router');
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);

// Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api-docs`);
  console.log(`Aplicación disponible en: http://localhost:${PORT}`);
});