const express = require('express');
const mongoose = require('mongoose');
const open = require('open').default;

const app = express();
app.use(express.json());

// Servir archivos estáticos
app.use('/public', express.static(__dirname + '/public'));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/back3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'));

// Rutas base

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Importar y usar el router de mocks
const mocksRouter = require('./routes/mocks.router');
app.use('/api/mocks', mocksRouter);

// Importar y usar los routers de usuarios y mascotas
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

// Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  setTimeout(() => open(`http://localhost:${PORT}`), 1000);
});
