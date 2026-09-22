const mongoose = require('mongoose');
const { LOCALIDADES } = require('./Conductor');

// Días en los que puede circular un colectivo
const DIAS_SERVICIO = ['diario', 'habiles', 'fines_semana'];

// Definimos la estructura (esquema) de los recorridos de colectivos
// que circulan dentro del Departamento Iglesia
const recorridoSchema = new mongoose.Schema({
  nombreLinea: {
    type: String,
    required: [true, 'El nombre de la línea es obligatorio'],
    trim: true
  },
  empresa: {
    type: String,
    trim: true,
    default: 'Sin especificar'
  },
  localidadOrigen: {
    type: String,
    required: [true, 'La localidad de origen es obligatoria'],
    enum: LOCALIDADES
  },
  localidadDestino: {
    type: String,
    required: [true, 'La localidad de destino es obligatoria'],
    enum: LOCALIDADES
  },
  // Localidades o paradas intermedias, en el orden en que las recorre el colectivo
  paradas: {
    type: [String],
    default: []
  },
  // Horarios de salida desde el origen, en formato "HH:MM"
  horariosSalida: {
    type: [String],
    default: [],
    validate: {
      validator: function (horarios) {
        return horarios.every((h) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(h));
      },
      message: 'Los horarios deben tener el formato HH:MM (ej: 07:30)'
    }
  },
  diasServicio: {
    type: String,
    required: [true, 'Los días de servicio son obligatorios'],
    enum: DIAS_SERVICIO,
    default: 'diario'
  },
  // Si el colectivo pasa cada tanto en vez de tener horarios fijos
  frecuenciaMinutos: {
    type: Number,
    min: [0, 'La frecuencia no puede ser negativa']
  },
  tarifa: {
    type: String,
    trim: true,
    default: ''
  },
  observaciones: {
    type: String,
    trim: true,
    default: ''
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recorrido', recorridoSchema);
module.exports.DIAS_SERVICIO = DIAS_SERVICIO;
