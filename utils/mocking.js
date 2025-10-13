const bcrypt = require('bcryptjs');

// Datos realistas para mascotas argentinas
const petData = {
  perro: {
    names: ['Luna', 'Max', 'Bella', 'Rocky', 'Milo', 'Lola', 'Bruno', 'Nina', 'Zeus', 'Coco', 'Toby', 'Princesa', 'Simón', 'Maya', 'Chester'],
    breeds: ['Labrador', 'Golden Retriever', 'Pastor Alemán', 'Bulldog Francés', 'Beagle', 'Boxer', 'Dálmata', 'Cocker Spaniel', 'Mestizo', 'Pitbull', 'Chihuahua', 'Poodle'],
    colors: ['negro', 'marrón', 'blanco', 'dorado', 'gris', 'manchado', 'tricolor', 'canela', 'chocolate', 'crema'],
    personalities: ['cariñoso', 'juguetón', 'protector', 'energético', 'obediente']
  },
  gato: {
    names: ['Mishi', 'Felix', 'Garfield', 'Salem', 'Nala', 'Simba', 'Whiskers', 'Shadow', 'Mittens', 'Tiger', 'Smokey', 'Patches', 'Oreo', 'Ginger'],
    breeds: ['Persa', 'Siamés', 'Maine Coon', 'Ragdoll', 'British Shorthair', 'Angora', 'Común Europeo', 'Mestizo', 'Bengalí', 'Russian Blue'],
    colors: ['negro', 'blanco', 'gris', 'naranja', 'atigrado', 'calicó', 'siamés', 'carey', 'plateado'],
    personalities: ['independiente', 'cariñoso', 'juguetón', 'tranquilo', 'curioso']
  },
  ave: {
    names: ['Pico', 'Charlie', 'Kiwi', 'Mango', 'Azul', 'Canela', 'Sunshine', 'Pepper', 'Ruby', 'Oscar'],
    breeds: ['Canario', 'Periquito', 'Loro', 'Cacatúa', 'Jilguero', 'Diamante Mandarín', 'Agapornis', 'Ninfa'],
    colors: ['amarillo', 'verde', 'azul', 'rojo', 'blanco', 'multicolor', 'gris'],
    personalities: ['sociable', 'curioso', 'juguetón', 'tranquilo']
  },
  conejo: {
    names: ['Bunny', 'Cotton', 'Copo', 'Nieve', 'Pelusa', 'Saltarín', 'Orejas', 'Chocolate', 'Caramelo'],
    breeds: ['Holandés', 'Cabeza de León', 'Mini Lop', 'Angora', 'Rex', 'Gigante de Flandes', 'Común'],
    colors: ['blanco', 'gris', 'negro', 'marrón', 'manchado', 'canela', 'chocolate'],
    personalities: ['tranquilo', 'juguetón', 'curioso', 'tímido', 'sociable']
  },
  reptil: {
    names: ['Spike', 'Escamas', 'Verde', 'Sombra', 'Dragón', 'Esmeralda', 'Jade', 'Ruby', 'Ámbar'],
    breeds: ['Iguana Verde', 'Gecko Leopardo', 'Pogona', 'Tortuga Rusa', 'Serpiente del Maíz', 'Gecko Crestado'],
    colors: ['verde', 'marrón', 'amarillo', 'naranja', 'manchado', 'rayado', 'multicolor'],
    personalities: ['tranquilo', 'independiente', 'curioso', 'tímido']
  },
  exotico: {
    names: ['Exo', 'Raro', 'Único', 'Misterio', 'Alien', 'Cosmos', 'Nebula', 'Galaxy', 'Star'],
    breeds: ['Axolote', 'Hurón', 'Chinchilla', 'Cobayo', 'Rata Doméstica', 'Araña Chilena', 'Gecko'],
    colors: ['rosa', 'blanco', 'gris', 'negro', 'dorado', 'plateado', 'albino'],
    personalities: ['independiente', 'curioso', 'tranquilo', 'nocturno', 'sociable']
  }
};

const argentineProvinces = [
  'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 
  'San Juan', 'Corrientes', 'Santiago del Estero', 'San Luis', 'Formosa', 'Neuquén', 'Chaco',
  'Río Negro', 'Catamarca', 'Jujuy', 'La Pampa', 'Santa Cruz', 'La Rioja', 'Chubut', 'Tierra del Fuego'
];

const argentineCities = [
  'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán', 'La Plata', 'Mar del Plata',
  'Quilmes', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Neuquén', 'Santiago del Estero', 'Corrientes'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomAge(species) {
  const ageRanges = {
    perro: { min: 0.5, max: 15 },
    gato: { min: 0.5, max: 18 },
    ave: { min: 0.5, max: 12 },
    pez: { min: 0.5, max: 5 },
    hamster: { min: 0.5, max: 3 },
    conejo: { min: 0.5, max: 10 }
  };
  
  const range = ageRanges[species] || { min: 1, max: 10 };
  return Math.round((Math.random() * (range.max - range.min) + range.min) * 10) / 10;
}

function generateWeight(species, size) {
  const weightRanges = {
    perro: { pequeño: [2, 10], mediano: [10, 25], grande: [25, 45], 'extra grande': [45, 80] },
    gato: { pequeño: [2, 4], mediano: [4, 6], grande: [6, 8], 'extra grande': [8, 12] },
    ave: { pequeño: [0.1, 0.5], mediano: [0.5, 1], grande: [1, 2], 'extra grande': [2, 5] }
  };
  
  const speciesRanges = weightRanges[species];
  if (!speciesRanges) return Math.round((Math.random() * 5 + 1) * 100) / 100;
  
  const sizeRange = speciesRanges[size] || speciesRanges.mediano;
  const weight = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
  return Math.round(weight * 100) / 100;
}

function generatePetDescription(pet) {
  const descriptions = [
    `${pet.name} es un${pet.species === 'ave' ? 'a' : pet.species === 'gata' ? 'a gata' : ''} ${pet.species} muy ${pet.personality[0]} que busca una familia amorosa.`,
    `Este hermoso ${pet.species} de ${pet.age} años es perfecto para familias. ${pet.name} es ${pet.personality.join(', ')}.`,
    `${pet.name} es un ${pet.species} ${pet.breed ? `de raza ${pet.breed}` : 'mestizo'} con un corazón enorme. Le encanta ${pet.personality.includes('juguetón') ? 'jugar' : pet.personality.includes('tranquilo') ? 'relajarse' : 'estar acompañado'}.`,
    `Conoce a ${pet.name}, un adorable ${pet.species} ${pet.color} que está buscando su hogar definitivo. Es ${pet.personality.slice(0, 2).join(' y ')}.`,
    `${pet.name} es un ${pet.species} especial que ha sido rescatado y rehabilitado. Ahora está listo para dar mucho amor a su nueva familia.`
  ];
  
  return getRandomElement(descriptions);
}

function generateLifeExpectancy(species) {
  const lifeExpectancies = {
    perro: '10-15 años',
    gato: '12-18 años',
    ave: '5-25 años (varía por especie)',
    pez: '2-10 años',
    hamster: '2-3 años',
    conejo: '8-12 años',
    tortuga: '50-80 años',
    iguana: '15-20 años',
    hurón: '7-10 años',
    chinchilla: '10-20 años',
    serpiente: '15-30 años',
    gecko: '10-25 años',
    cobayo: '4-8 años',
    rata: '2-3 años',
    ratón: '1-3 años',
    axolote: '10-15 años'
  };
  
  return lifeExpectancies[species] || '5-15 años';
}

function generateMockUsers(count = 1) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Diego', 'Sofía', 'Miguel', 'Valentina', 'Mateo', 'Camila', 'Santiago', 'Isabella', 'Nicolás', 'Martina'];
    const lastNames = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno'];
    
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const role = Math.random() < 0.3 ? 'admin' : 'user';
    const password = bcrypt.hashSync('coder123', 10);
    
    users.push({
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@email.com`,
      password,
      role,
      pets: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  return users;
}

function generateMockPets(count = 1, ownerId = null) {
  const pets = [];
  
  for (let i = 0; i < count; i++) {
    // Solo usar especies que están en el enum del modelo
    const validSpecies = ['perro', 'gato', 'ave', 'conejo'];
    const species = getRandomElement(validSpecies);
    const speciesData = petData[species];
    const name = getRandomElement(speciesData.names);
    const breed = getRandomElement(speciesData.breeds);
    const color = getRandomElement(speciesData.colors);
    const age = generateRandomAge(species);
    const size = getRandomElement(['pequeño', 'mediano', 'grande']);
    const weight = generateWeight(species, size);
    const personality = getRandomElements(speciesData.personalities, Math.floor(Math.random() * 3) + 1);
    const city = getRandomElement(argentineCities);
    const province = getRandomElement(argentineProvinces);
    
    const pet = {
      name,
      species,
      breed,
      age,
      color,
      size,
      weight,
      personality,
      isVaccinated: Math.random() > 0.3,
      isNeutered: Math.random() > 0.4,
      healthStatus: getRandomElement(['excelente', 'excelente', 'bueno', 'bueno', 'regular']),
      adoptionStatus: getRandomElement(['disponible', 'disponible', 'disponible', 'en proceso']),
      goodWithKids: Math.random() > 0.2,
      goodWithPets: Math.random() > 0.3,
      location: {
        city,
        province,
        country: 'Argentina'
      },
      owner: ownerId,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    pet.description = generatePetDescription(pet);
    
    // Agregar características adicionales
    pet.characteristics = {
      energyLevel: getRandomElement(['muy bajo', 'bajo', 'moderado', 'alto', 'muy alto']),
      groomingNeeds: getRandomElement(['mínimo', 'bajo', 'moderado', 'alto', 'muy alto']),
      trainability: getRandomElement(['muy difícil', 'difícil', 'moderado', 'fácil', 'muy fácil']),
      lifeExpectancy: generateLifeExpectancy(species)
    };
    
    // Agregar microchip ocasionalmente
    if (Math.random() > 0.3) {
      pet.microchipId = `MC${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    
    // Agregar fecha de rescate aleatoria
    pet.rescueDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    // Agregar historial médico ocasionalmente
    if (Math.random() > 0.6) {
      pet.medicalHistory = [{
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        treatment: getRandomElement(['Vacunación', 'Desparasitación', 'Castración', 'Tratamiento dental', 'Chequeo general']),
        veterinarian: getRandomElement(['Dr. García', 'Dra. Rodríguez', 'Dr. López', 'Dra. Martínez']),
        notes: 'Tratamiento exitoso, sin complicaciones',
        cost: Math.floor(Math.random() * 5000) + 1000
      }];
    }
    
    // Agregar necesidades especiales ocasionalmente
    if (Math.random() < 0.1) {
      const specialNeeds = [
        'Requiere medicación diaria',
        'Necesita dieta especial',
        'Mejor como única mascota',
        'Requiere ejercicio moderado por condición médica',
        'Necesita cuidados especiales por edad avanzada'
      ];
      pet.specialNeeds = getRandomElement(specialNeeds);
    }
    
    pets.push(pet);
  }
  
  return pets;
}

function generateMockAdoptions(count = 1, userIds = [], petIds = []) {
  const adoptions = [];
  
  for (let i = 0; i < count; i++) {
    const userId = userIds.length > 0 ? getRandomElement(userIds) : null;
    const petId = petIds.length > 0 ? getRandomElement(petIds) : null;
    const status = getRandomElement(['pending', 'approved', 'rejected', 'completed']);
    
    adoptions.push({
      user: userId,
      pet: petId,
      status,
      adoptionDate: status === 'completed' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
      notes: `Solicitud de adopción ${status === 'approved' ? 'aprobada' : status === 'rejected' ? 'rechazada' : 'en proceso'}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return adoptions;
}

// Para compatibilidad con Docker (sin faker)
function generateSimpleMockData() {
  return {
    users: [{
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@email.com',
      password: bcrypt.hashSync('coder123', 10),
      role: 'admin',
      pets: []
    }],
    pets: [{
      name: 'Luna',
      species: 'perro',
      breed: 'Labrador',
      age: 3,
      color: 'dorado',
      size: 'grande',
      weight: 28.5,
      description: 'Luna es una perra muy cariñosa que busca una familia amorosa.',
      personality: ['cariñoso', 'juguetón'],
      isVaccinated: true,
      isNeutered: true,
      healthStatus: 'excelente',
      adoptionStatus: 'disponible',
      goodWithKids: true,
      goodWithPets: true,
      location: {
        city: 'Buenos Aires',
        province: 'Buenos Aires',
        country: 'Argentina'
      }
    }]
  };
}

module.exports = { 
  generateMockUsers, 
  generateMockPets, 
  generateMockAdoptions,
  generateSimpleMockData 
};
