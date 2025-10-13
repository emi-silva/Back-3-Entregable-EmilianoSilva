const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const User = require('../models/User');
const Pet = require('../models/Pet');

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtener todas las adopciones
 *     tags: [Adoptions]
 *     description: Retorna una lista de todas las adopciones con información de usuario y mascota
 *     responses:
 *       200:
 *         description: Lista de adopciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adoption'
 *             example:
 *               - _id: "68ed203fccfff6e5ea6cdd95"
 *                 user:
 *                   _id: "68ed203fccfff6e5ea6cdd75"
 *                   first_name: "María"
 *                   last_name: "González"
 *                   email: "maria.gonzalez@email.com"
 *                 pet:
 *                   _id: "68ed203fccfff6e5ea6cdd85"
 *                   name: "Luna"
 *                   species: "perro"
 *                 status: "pending"
 *                 notes: "Usuario interesado en adoptar a Luna."
 *                 createdAt: "2025-10-13T15:52:31.813Z"
 *               - _id: "68ed203fccfff6e5ea6cdd96"
 *                 user:
 *                   _id: "68ed203fccfff6e5ea6cdd76"
 *                   first_name: "Carlos"
 *                   last_name: "Rodríguez"
 *                   email: "carlos.rodriguez@email.com"
 *                 pet:
 *                   _id: "68ed203fccfff6e5ea6cdd86"
 *                   name: "Mishi"
 *                   species: "gato"
 *                 status: "approved"
 *                 adoptionDate: "2025-10-15T10:30:00.000Z"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   get:
 *     summary: Obtener una adopción por ID
 *     tags: [Adoptions]
 *     description: Retorna una adopción específica basada en su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la adopción
 *     responses:
 *       200:
 *         description: Adopción encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');
    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' });
    }
    res.json(adoption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Crear una nueva adopción
 *     tags: [Adoptions]
 *     description: Crea una nueva solicitud de adopción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - pet
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID del usuario adoptante
 *               pet:
 *                 type: string
 *                 description: ID de la mascota a adoptar
 *               notes:
 *                 type: string
 *                 description: Notas adicionales sobre la adopción
 *     responses:
 *       201:
 *         description: Adopción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: Datos de entrada inválidos o adopción duplicada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario o mascota no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  try {
    const { user, pet, notes } = req.body;

    // Validar que el usuario existe
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Validar que la mascota existe
    const petExists = await Pet.findById(pet);
    if (!petExists) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Crear la adopción
    const adoption = new Adoption({
      user,
      pet,
      notes: notes || ''
    });

    const savedAdoption = await adoption.save();
    const populatedAdoption = await Adoption.findById(savedAdoption._id)
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');

    res.status(201).json(populatedAdoption);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Ya existe una adopción para este usuario y mascota' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   put:
 *     summary: Actualizar una adopción
 *     tags: [Adoptions]
 *     description: Actualiza el estado o notas de una adopción existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la adopción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: Nuevo estado de la adopción
 *               notes:
 *                 type: string
 *                 description: Notas actualizadas
 *     responses:
 *       200:
 *         description: Adopción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    )
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');

    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' });
    }

    res.json(adoption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adoptions/{id}:
 *   delete:
 *     summary: Eliminar una adopción
 *     tags: [Adoptions]
 *     description: Elimina una adopción del sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único de la adopción
 *     responses:
 *       200:
 *         description: Adopción eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Adopción eliminada exitosamente
 *       404:
 *         description: Adopción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findByIdAndDelete(req.params.id);
    if (!adoption) {
      return res.status(404).json({ error: 'Adopción no encontrada' });
    }
    res.json({ message: 'Adopción eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adoptions/user/{userId}:
 *   get:
 *     summary: Obtener adopciones por usuario
 *     tags: [Adoptions]
 *     description: Retorna todas las adopciones de un usuario específico
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Adopciones del usuario obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adoption'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ user: req.params.userId })
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adoptions/pet/{petId}:
 *   get:
 *     summary: Obtener adopciones por mascota
 *     tags: [Adoptions]
 *     description: Retorna todas las adopciones de una mascota específica
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Adopciones de la mascota obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adoption'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/pet/:petId', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ pet: req.params.petId })
      .populate('user', 'first_name last_name email')
      .populate('pet', 'name species');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;