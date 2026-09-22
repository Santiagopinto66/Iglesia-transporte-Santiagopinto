const mongoose = require('mongoose');

// Localidades del Departamento Iglesia (San Juan)
const LOCALIDADES = [
  'Rodeo',
  'Villa Iglesia',
  'Las Flores',
  'Bella Vista',
  'Angualasto',
  'Tudcum',
  'Pismanta',
  'Colangüil',
  'Malimán',
  'Otra'
];

// Definimos la estructura (esquema) que tendrán los documentos en MongoDB
const conductorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del conductor es obligatorio'],
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    unique: true,
    trim: true
  },
  localidad: {
    type: String,
    required: [true, 'La localidad base es obligatoria'],
    enum: LOCALIDADES
  },
  tipoServicio: {
    type: String,
    required: [true, 'El tipo de servicio es obligatorio'],
    enum: ['remis', 'viaje_largo', 'flete', 'moto'],
    default: 'remis'
  },
  vehiculo: {
    type: String,
    trim: true,
    default: 'Sin especificar'
  },
  capacidad: {
    type: Number,
    default: 4,
    min: [1, 'La capacidad debe ser de al menos 1 pasajero']
  },
  zonasCubiertas: {
    type: [String],
    default: []
  },
  disponible: {
    type: Boolean,
    default: true
  },
  ultimaActividad: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conductor', conductorSchema);
module.exports.LOCALIDADES = LOCALIDADES;
