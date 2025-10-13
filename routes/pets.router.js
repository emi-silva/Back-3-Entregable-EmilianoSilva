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
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().populate('owner');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
