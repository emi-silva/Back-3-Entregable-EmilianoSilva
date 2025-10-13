const mongoose = require('mongoose');

beforeAll(async () => {
  // Conectar a una base de datos de prueba
  const testDbUrl = 'mongodb://localhost:27017/back3_test';
  await mongoose.connect(testDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  // Limpiar y cerrar la conexión de la base de datos
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  // Limpiar todas las colecciones después de cada test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});