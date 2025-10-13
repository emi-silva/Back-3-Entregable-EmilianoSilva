const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['perro', 'gato', 'ave', 'pez', 'hamster', 'conejo', 'tortuga', 'iguana', 'hurón', 'chinchilla', 'serpiente', 'gecko', 'cobayo', 'rata', 'ratón', 'axolote', 'araña', 'escorpión']
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 30
  },
  color: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['pequeño', 'mediano', 'grande', 'extra grande']
  },
  weight: {
    type: Number,
    min: 0.1,
    max: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  personality: [{
    type: String,
    enum: ['cariñoso', 'juguetón', 'tranquilo', 'energético', 'protector', 'independiente', 'sociable', 'tímido', 'curioso', 'obediente']
  }],
  isVaccinated: {
    type: Boolean,
    default: false
  },
  isNeutered: {
    type: Boolean,
    default: false
  },
  healthStatus: {
    type: String,
    enum: ['excelente', 'bueno', 'regular', 'necesita cuidados especiales'],
    default: 'bueno'
  },
  adoptionStatus: {
    type: String,
    enum: ['disponible', 'en proceso', 'adoptado', 'no disponible'],
    default: 'disponible'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x300/4299E1/FFFFFF?text=🐾'
  },
  specialNeeds: {
    type: String,
    maxlength: 200
  },
  medicalHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    treatment: String,
    veterinarian: String,
    notes: String,
    cost: Number
  }],
  characteristics: {
    energyLevel: {
      type: String,
      enum: ['muy bajo', 'bajo', 'moderado', 'alto', 'muy alto'],
      default: 'moderado'
    },
    groomingNeeds: {
      type: String,
      enum: ['mínimo', 'bajo', 'moderado', 'alto', 'muy alto'],
      default: 'moderado'
    },
    trainability: {
      type: String,
      enum: ['muy difícil', 'difícil', 'moderado', 'fácil', 'muy fácil'],
      default: 'moderado'
    },
    lifeExpectancy: {
      type: String,
      default: 'No especificado'
    }
  },
  microchipId: {
    type: String,
    unique: true,
    sparse: true // Permite valores null únicos
  },
  rescueDate: {
    type: Date,
    default: Date.now
  },
  fosterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  goodWithKids: {
    type: Boolean,
    default: true
  },
  goodWithPets: {
    type: Boolean,
    default: true
  },
  location: {
    city: String,
    province: String,
    country: {
      type: String,
      default: 'Argentina'
    }
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para calcular la edad en formato legible
petSchema.virtual('ageDescription').get(function() {
  if (!this.age) return 'Edad no especificada';
  if (this.age < 1) return 'Cachorro/Bebé';
  if (this.age < 2) return 'Joven';
  if (this.age < 7) return 'Adulto';
  return 'Senior';
});

// Índices para mejorar las consultas
petSchema.index({ species: 1, adoptionStatus: 1 });
petSchema.index({ location: 1 });
petSchema.index({ size: 1, age: 1 });

module.exports = mongoose.model('Pet', petSchema);
