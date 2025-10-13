const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Adoption = require('./models/Adoption');
const { generateMockUsers, generateMockPets, generateMockAdoptions, generateSimpleMockData } = require('./utils/mocking');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando proceso de sembrado de base de datos...');
    
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/backend-3-entregable';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Adoption.deleteMany({});
    console.log('🧹 Base de datos limpiada');

    let users, pets, adoptions;

    try {
      // Intentar usar datos completos (si faker está disponible)
      console.log('📊 Generando datos realistas...');
      
      // Generar usuarios
      users = generateMockUsers(15);
      const savedUsers = await User.insertMany(users);
      console.log(`👥 ${savedUsers.length} usuarios creados`);

      // Generar mascotas
      pets = generateMockPets(25);
      
      // Asignar algunos dueños a las mascotas
      pets.forEach((pet, index) => {
        if (index < 15) { // Primeras 15 mascotas tienen dueño
          pet.owner = savedUsers[index % savedUsers.length]._id;
        }
      });
      
      const savedPets = await Pet.insertMany(pets);
      console.log(`🐕 ${savedPets.length} mascotas creadas`);

      // Actualizar usuarios con sus mascotas
      for (let i = 0; i < 15; i++) {
        const user = savedUsers[i];
        const userPets = savedPets.filter(pet => pet.owner && pet.owner.toString() === user._id.toString());
        user.pets = userPets.map(pet => pet._id);
        await user.save();
      }

      // Generar adopciones
      adoptions = generateMockAdoptions(
        12, 
        savedUsers.map(u => u._id), 
        savedPets.filter(p => !p.owner).map(p => p._id) // Solo mascotas sin dueño
      );
      const savedAdoptions = await Adoption.insertMany(adoptions);
      console.log(`📋 ${savedAdoptions.length} adopciones creadas`);

    } catch (error) {
      console.log('⚠️ Error con datos completos, usando datos simplificados:', error.message);
      
      // Fallback a datos simplificados
      const simpleData = generateSimpleMockData();
      
      const savedUsers = await User.insertMany(simpleData.users);
      const savedPets = await Pet.insertMany(simpleData.pets);
      
      console.log(`👥 ${savedUsers.length} usuarios creados (modo simple)`);
      console.log(`🐕 ${savedPets.length} mascotas creadas (modo simple)`);
    }

    console.log('🎉 ¡Base de datos sembrada exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`👥 Usuarios: ${await User.countDocuments()}`);
    console.log(`🐕 Mascotas: ${await Pet.countDocuments()}`);
    console.log(`📋 Adopciones: ${await Adoption.countDocuments()}`);
    
    // Mostrar algunos ejemplos
    console.log('\n🔍 Ejemplos de mascotas creadas:');
    const samplePets = await Pet.find().limit(3).populate('owner', 'first_name last_name');
    samplePets.forEach(pet => {
      console.log(`  • ${pet.name} (${pet.species} ${pet.breed || 'mestizo'}) - ${pet.age} años - ${pet.color}`);
      console.log(`    ${pet.description.substring(0, 80)}...`);
      console.log(`    Dueño: ${pet.owner ? `${pet.owner.first_name} ${pet.owner.last_name}` : 'Sin dueño (disponible para adopción)'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error sembrado base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };