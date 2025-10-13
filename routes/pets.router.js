const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas con información del dueño
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de todas las mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *             example:
 *               - _id: "68ed203fccfff6e5ea6cdd85"
 *                 name: "Luna"
 *                 species: "perro"
 *                 breed: "Labrador"
 *                 age: 3.5
 *                 color: "dorado"
 *                 size: "grande"
 *                 weight: 28.5
 *                 description: "Luna es una perra muy cariñosa que busca una familia amorosa."
 *                 personality: ["cariñoso", "protector", "juguetón"]
 *                 isVaccinated: true
 *                 isNeutered: true
 *                 healthStatus: "excelente"
 *                 adoptionStatus: "disponible"
 *                 goodWithKids: true
 *                 goodWithPets: true
 *                 location:
 *                   city: "Buenos Aires"
 *                   province: "Buenos Aires"
 *                   country: "Argentina"
 *                 owner:
 *                   _id: "68ed203fccfff6e5ea6cdd75"
 *                   first_name: "María"
 *                   last_name: "González"
 *                   email: "maria.gonzalez@email.com"
 *               - _id: "68ed203fccfff6e5ea6cdd86"
 *                 name: "Mishi"
 *                 species: "gato"
 *                 breed: "Siamés"
 *                 age: 2.0
 *                 color: "gris"
 *                 size: "mediano"
 *                 weight: 4.5
 *                 description: "Mishi es un gato muy independiente y cariñoso."
 *                 personality: ["independiente", "cariñoso"]
 *                 isVaccinated: true
 *                 isNeutered: false
 *                 healthStatus: "bueno"
 *                 adoptionStatus: "disponible"
 *                 location:
 *                   city: "Córdoba"
 *                   province: "Córdoba"
 *                   country: "Argentina"
 *                 owner: null
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/pets/count/species:
 *   get:
 *     summary: Obtener conteo de mascotas por especie
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Conteo de mascotas agrupadas por especie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 perro: 8
 *                 gato: 6
 *                 conejo: 8
 *                 ave: 3
 *       500:
 *         description: Error interno del servidor
 */
router.get('/count/species', async (req, res) => {
  try {
    const counts = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const result = {};
    counts.forEach(item => {
      result[item._id] = item.count;
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - color
 *               - size
 *               - weight
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               weight:
 *                 type: number
 *               description:
 *                 type: string
 *               personality:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVaccinated:
 *                 type: boolean
 *               isNeutered:
 *                 type: boolean
 *               healthStatus:
 *                 type: string
 *               adoptionStatus:
 *                 type: string
 *               goodWithKids:
 *                 type: boolean
 *               goodWithPets:
 *                 type: boolean
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   province:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      color,
      size,
      weight,
      description,
      personality = [],
      isVaccinated = false,
      isNeutered = false,
      healthStatus = 'bueno',
      adoptionStatus = 'disponible',
      goodWithKids = true,
      goodWithPets = true,
      location = { city: '', province: '', country: 'Argentina' }
    } = req.body;

    // Validaciones básicas
    if (!name || !species || !breed || !age || !color || !size || !weight) {
      return res.status(400).json({
        error: 'Los campos name, species, breed, age, color, size y weight son obligatorios'
      });
    }

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      color,
      size,
      weight,
      description: description || `${name} es un ${species} muy especial que busca una familia amorosa.`,
      personality,
      isVaccinated,
      isNeutered,
      healthStatus,
      adoptionStatus,
      goodWithKids,
      goodWithPets,
      location,
      imageUrl: "https://via.placeholder.com/300x300/4299E1/FFFFFF?text=🐾",
      rescueDate: new Date(),
      medicalHistory: []
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta GET general (debe ir al final para no interferir con rutas específicas)
router.get('/', async (req, res) => {
  try {
    const { species, adoptionStatus } = req.query;
    let filter = {};
    
    if (species) {
      filter.species = species;
    }
    if (adoptionStatus) {
      filter.adoptionStatus = adoptionStatus;
    }
    
    const pets = await Pet.find(filter).populate('owner');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
