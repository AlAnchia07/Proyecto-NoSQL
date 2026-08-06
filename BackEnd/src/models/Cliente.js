// src/models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  id_usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true,
    unique: true 
  },
  telefono: { 
    type: String, 
    default: '' 
  },
  direccion: { 
    type: String, 
    default: '' 
  }
}, {
  timestamps: true
});

// Forzamos el nombre de la colección tal como lo tienes mapeado
module.exports = mongoose.model('Clientes', clienteSchema, 'Clientes');