const mongoose = require('mongoose');

// Definimos la estructura (esquema) de las peticiones sobre el servicio de colectivos
const peticionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título de la petición es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de petición es obligatorio'],
    enum: ['cambio_horario', 'nuevo_recorrido', 'mas_frecuencia', 'otro']
  },
  origen: {
    type: String,
    required: [true, 'El origen del recorrido es obligatorio'],
    trim: true
  },
  destino: {
    type: String,
    required: [true, 'El destino del recorrido es obligatorio'],
    trim: true
  },
  horarioActual: {
    type: String,
    trim: true,
    default: ''
  },
  horarioSugerido: {
    type: String,
    trim: true,
    default: ''
  },
  autor: {
    type: String,
    required: [true, 'El nombre de quien presenta la petición es obligatorio'],
    trim: true
  },
  apoyos: {
    type: Number,
    default: 0,
    min: [0, 'Los apoyos no pueden ser negativos']
  },
  estado: {
    type: String,
    enum: ['abierta', 'en_revision', 'resuelta', 'rechazada'],
    default: 'abierta'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Peticion', peticionSchema);
