const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const adoptionRouter = require('../routes/adoption.router');

// Configurar aplicación Express para testing
const app = express();
app.use(express.json());
app.use('/api/adoptions', adoptionRouter);

describe('Adoption Router Tests', () => {
  let testUser, testPet, testAdoption;

  beforeEach(async () => {
    // Crear datos de prueba
    testUser = await User.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@test.com',
      password: 'hashedpassword123',
      role: 'user'
    });

    testPet = await Pet.create({
      name: 'Buddy',
      species: 'perro',
      owner: null
    });
  });

  describe('GET /api/adoptions', () => {
    it('should return all adoptions', async () => {
      // Crear adopción de prueba
      await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'pending'
      });

      const response = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].user.email).toBe('john.doe@test.com');
      expect(response.body[0].pet.name).toBe('Buddy');
      expect(response.body[0].status).toBe('pending');
    });

    it('should return empty array when no adoptions exist', async () => {
      const response = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/adoptions/:id', () => {
    it('should return adoption by id', async () => {
      const adoption = await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'approved',
        notes: 'Great match!'
      });

      const response = await request(app)
        .get(`/api/adoptions/${adoption._id}`)
        .expect(200);

      expect(response.body._id).toBe(adoption._id.toString());
      expect(response.body.status).toBe('approved');
      expect(response.body.notes).toBe('Great match!');
    });

    it('should return 404 for non-existent adoption', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Adopción no encontrada');
    });

    it('should return 500 for invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/adoptions/invalid-id')
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/adoptions', () => {
    it('should create a new adoption successfully', async () => {
      const adoptionData = {
        user: testUser._id.toString(),
        pet: testPet._id.toString(),
        notes: 'Perfect match for this family'
      };

      const response = await request(app)
        .post('/api/adoptions')
        .send(adoptionData)
        .expect(201);

      expect(response.body.user._id).toBe(testUser._id.toString());
      expect(response.body.pet._id).toBe(testPet._id.toString());
      expect(response.body.status).toBe('pending');
      expect(response.body.notes).toBe('Perfect match for this family');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const adoptionData = {
        user: fakeUserId.toString(),
        pet: testPet._id.toString()
      };

      const response = await request(app)
        .post('/api/adoptions')
        .send(adoptionData)
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });

    it('should return 404 for non-existent pet', async () => {
      const fakePetId = new mongoose.Types.ObjectId();
      const adoptionData = {
        user: testUser._id.toString(),
        pet: fakePetId.toString()
      };

      const response = await request(app)
        .post('/api/adoptions')
        .send(adoptionData)
        .expect(404);

      expect(response.body.error).toBe('Mascota no encontrada');
    });

    it('should return 400 for duplicate adoption', async () => {
      // Crear primera adopción
      await Adoption.create({
        user: testUser._id,
        pet: testPet._id
      });

      // Intentar crear adopción duplicada
      const adoptionData = {
        user: testUser._id.toString(),
        pet: testPet._id.toString()
      };

      const response = await request(app)
        .post('/api/adoptions')
        .send(adoptionData)
        .expect(400);

      expect(response.body.error).toBe('Ya existe una adopción para este usuario y mascota');
    });

    it('should create adoption without notes', async () => {
      const adoptionData = {
        user: testUser._id.toString(),
        pet: testPet._id.toString()
      };

      const response = await request(app)
        .post('/api/adoptions')
        .send(adoptionData)
        .expect(201);

      expect(response.body.notes).toBe('');
    });
  });

  describe('PUT /api/adoptions/:id', () => {
    beforeEach(async () => {
      testAdoption = await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'pending'
      });
    });

    it('should update adoption status successfully', async () => {
      const updateData = {
        status: 'approved',
        notes: 'Adoption approved after home visit'
      };

      const response = await request(app)
        .put(`/api/adoptions/${testAdoption._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('approved');
      expect(response.body.notes).toBe('Adoption approved after home visit');
    });

    it('should update only status', async () => {
      const updateData = { status: 'rejected' };

      const response = await request(app)
        .put(`/api/adoptions/${testAdoption._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('rejected');
    });

    it('should update only notes', async () => {
      const updateData = { notes: 'Updated notes' };

      const response = await request(app)
        .put(`/api/adoptions/${testAdoption._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.notes).toBe('Updated notes');
      expect(response.body.status).toBe('pending'); // Should remain unchanged
    });

    it('should return 404 for non-existent adoption', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { status: 'approved' };

      const response = await request(app)
        .put(`/api/adoptions/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Adopción no encontrada');
    });
  });

  describe('DELETE /api/adoptions/:id', () => {
    beforeEach(async () => {
      testAdoption = await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'pending'
      });
    });

    it('should delete adoption successfully', async () => {
      const response = await request(app)
        .delete(`/api/adoptions/${testAdoption._id}`)
        .expect(200);

      expect(response.body.message).toBe('Adopción eliminada exitosamente');

      // Verify deletion
      const deletedAdoption = await Adoption.findById(testAdoption._id);
      expect(deletedAdoption).toBeNull();
    });

    it('should return 404 for non-existent adoption', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Adopción no encontrada');
    });
  });

  describe('GET /api/adoptions/user/:userId', () => {
    it('should return adoptions for specific user', async () => {
      // Crear segunda mascota y usuario para tener más adopciones
      const testPet2 = await Pet.create({
        name: 'Luna',
        species: 'gato'
      });

      const testUser2 = await User.create({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@test.com',
        password: 'hashedpassword456',
        role: 'user'
      });

      // Crear adopciones
      await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'approved'
      });

      await Adoption.create({
        user: testUser._id,
        pet: testPet2._id,
        status: 'pending'
      });

      await Adoption.create({
        user: testUser2._id,
        pet: testPet2._id,
        status: 'rejected'
      });

      const response = await request(app)
        .get(`/api/adoptions/user/${testUser._id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(adoption => {
        expect(adoption.user._id).toBe(testUser._id.toString());
      });
    });

    it('should return empty array for user with no adoptions', async () => {
      const response = await request(app)
        .get(`/api/adoptions/user/${testUser._id}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/adoptions/pet/:petId', () => {
    it('should return adoptions for specific pet', async () => {
      const testUser2 = await User.create({
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@test.com',
        password: 'hashedpassword789',
        role: 'user'
      });

      // Crear múltiples adopciones para la misma mascota
      await Adoption.create({
        user: testUser._id,
        pet: testPet._id,
        status: 'rejected'
      });

      await Adoption.create({
        user: testUser2._id,
        pet: testPet._id,
        status: 'approved'
      });

      const response = await request(app)
        .get(`/api/adoptions/pet/${testPet._id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(adoption => {
        expect(adoption.pet._id).toBe(testPet._id.toString());
      });
    });

    it('should return empty array for pet with no adoptions', async () => {
      const response = await request(app)
        .get(`/api/adoptions/pet/${testPet._id}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Simular error de conexión cerrando mongoose
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/adoptions')
        .expect(500);

      expect(response.body.error).toBeDefined();

      // Reconectar para otros tests
      await mongoose.connect('mongodb://localhost:27017/back3_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    });
  });
});