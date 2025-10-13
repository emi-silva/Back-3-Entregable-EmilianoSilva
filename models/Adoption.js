const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  adoptionDate: { 
    type: Date 
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Índice compuesto para evitar duplicados de adopción
adoptionSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model('Adoption', adoptionSchema);