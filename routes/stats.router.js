const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Obtener estadísticas completas del refugio
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Estadísticas del refugio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPets:
 *                   type: number
 *                 totalUsers:
 *                   type: number
 *                 totalAdoptions:
 *                   type: number
 *                 petsAvailable:
 *                   type: number
 *                 petsAdopted:
 *                   type: number
 *                 speciesDistribution:
 *                   type: object
 *                 adoptionsByMonth:
 *                   type: array
 *                 healthStatus:
 *                   type: object
 *                 ageDistribution:
 *                   type: object
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Estadísticas básicas
    const totalPets = await Pet.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdoptions = await Adoption.countDocuments();
    const petsAvailable = await Pet.countDocuments({ adoptionStatus: 'disponible' });
    const petsAdopted = await Pet.countDocuments({ adoptionStatus: 'adoptado' });

    // Distribución por especies
    const speciesDistribution = await Pet.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Distribución por estado de salud
    const healthDistribution = await Pet.aggregate([
      { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
    ]);

    // Distribución por edad (rangos)
    const ageDistribution = await Pet.aggregate([
      {
        $addFields: {
          ageRange: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 1] }, then: 'Cachorro/Bebé (0-1 año)' },
                { case: { $lt: ['$age', 3] }, then: 'Joven (1-3 años)' },
                { case: { $lt: ['$age', 7] }, then: 'Adulto (3-7 años)' },
                { case: { $gte: ['$age', 7] }, then: 'Senior (7+ años)' }
              ],
              default: 'No especificado'
            }
          }
        }
      },
      { $group: { _id: '$ageRange', count: { $sum: 1 } } }
    ]);

    // Adopciones por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const adoptionsByMonth = await Adoption.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top 5 razas más populares
    const popularBreeds = await Pet.aggregate([
      { $match: { breed: { $ne: null, $ne: '' } } },
      { $group: { _id: '$breed', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Mascotas por ubicación
    const locationStats = await Pet.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Estadísticas de personalidad
    const personalityStats = await Pet.aggregate([
      { $unwind: '$personality' },
      { $group: { _id: '$personality', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: {
        totalPets,
        totalUsers,
        totalAdoptions,
        petsAvailable,
        petsAdopted,
        adoptionRate: totalPets > 0 ? Math.round((petsAdopted / totalPets) * 100) : 0
      },
      distributions: {
        species: speciesDistribution,
        health: healthDistribution,
        age: ageDistribution,
        breeds: popularBreeds,
        locations: locationStats,
        personalities: personalityStats
      },
      trends: {
        adoptionsByMonth
      },
      lastUpdated: new Date()
    });

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas', details: error.message });
  }
});

/**
 * @swagger
 * /api/stats/pets/search:
 *   get:
 *     summary: Búsqueda avanzada de mascotas con filtros
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filtrar por especie
 *       - in: query
 *         name: age_min
 *         schema:
 *           type: number
 *         description: Edad mínima
 *       - in: query
 *         name: age_max
 *         schema:
 *           type: number
 *         description: Edad máxima
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filtrar por tamaño
 *       - in: query
 *         name: personality
 *         schema:
 *           type: string
 *         description: Filtrar por personalidad
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Solo mascotas disponibles
 *     responses:
 *       200:
 *         description: Lista de mascotas filtradas
 */
router.get('/pets/search', async (req, res) => {
  try {
    const { species, age_min, age_max, size, personality, city, available } = req.query;
    
    let filter = {};
    
    if (species) filter.species = species;
    if (size) filter.size = size;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (available === 'true') filter.adoptionStatus = 'disponible';
    if (personality) filter.personality = { $in: [personality] };
    
    if (age_min || age_max) {
      filter.age = {};
      if (age_min) filter.age.$gte = Number(age_min);
      if (age_max) filter.age.$lte = Number(age_max);
    }

    const pets = await Pet.find(filter)
                          .populate('owner', 'first_name last_name email')
                          .sort({ createdAt: -1 });

    res.json({
      count: pets.length,
      filters: req.query,
      pets
    });

  } catch (error) {
    res.status(500).json({ error: 'Error en búsqueda', details: error.message });
  }
});

module.exports = router;