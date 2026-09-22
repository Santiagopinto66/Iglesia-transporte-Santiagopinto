const Conductor = require('../models/Conductor');

// -------------------------------------------------------------
// GET: Obtener todos los conductores desde MongoDB
// Permite filtrar por localidad, tipo de servicio y disponibilidad
// Ej: /api/conductores?localidad=Rodeo&disponible=true
// -------------------------------------------------------------
exports.obtenerConductores = async (req, res) => {
  try {
    const { localidad, tipoServicio, disponible } = req.query;

    const filtro = {};
    if (localidad) filtro.localidad = localidad;
    if (tipoServicio) filtro.tipoServicio = tipoServicio;
    if (disponible) filtro.disponible = disponible === 'true';

    const conductores = await Conductor.find(filtro).sort({ disponible: -1, ultimaActividad: -1 });

    res.status(200).json({ ok: true, cantidad: conductores.length, datos: conductores });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// GET: Obtener un conductor puntual por su ID de MongoDB
// -------------------------------------------------------------
exports.obtenerConductorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findById(id);

    if (!conductor) {
      return res.status(404).json({ ok: false, mensaje: 'Conductor no encontrado' });
    }

    res.status(200).json({ ok: true, datos: conductor });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// POST: Inscribir un nuevo conductor en MongoDB
// -------------------------------------------------------------
exports.crearConductor = async (req, res) => {
  try {
    const { nombre, telefono, localidad, tipoServicio, vehiculo, capacidad, zonasCubiertas } = req.body;

    if (!nombre || !telefono || !localidad) {
      return res.status(400).json({ ok: false, mensaje: 'Nombre, teléfono y localidad son obligatorios' });
    }

    const existente = await Conductor.findOne({ telefono });
    if (existente) {
      return res.status(409).json({ ok: false, mensaje: 'Ya existe un conductor inscripto con ese teléfono' });
    }

    const nuevoConductor = new Conductor({
      nombre,
      telefono,
      localidad,
      tipoServicio: tipoServicio || 'remis',
      vehiculo,
      capacidad,
      zonasCubiertas: zonasCubiertas || []
    });

    const conductorGuardado = await nuevoConductor.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Conductor inscripto exitosamente en la base de datos',
      datos: conductorGuardado
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al inscribir el conductor', error: error.message });
  }
};

// -------------------------------------------------------------
// PUT: Actualizar los datos de un conductor por su ID
// -------------------------------------------------------------
exports.actualizarConductor = async (req, res) => {
  try {
    const { id } = req.params;

    const conductorActualizado = await Conductor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!conductorActualizado) {
      return res.status(404).json({ ok: false, mensaje: 'Conductor no encontrado' });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Conductor actualizado correctamente',
      datos: conductorActualizado
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar el conductor', error: error.message });
  }
};

// -------------------------------------------------------------
// PATCH: Cambiar el estado de disponibilidad (activo / no activo)
// -------------------------------------------------------------
exports.cambiarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findById(id);

    if (!conductor) {
      return res.status(404).json({ ok: false, mensaje: 'Conductor no encontrado' });
    }

    conductor.disponible = typeof req.body.disponible === 'boolean'
      ? req.body.disponible
      : !conductor.disponible;

    conductor.ultimaActividad = new Date();
    await conductor.save();

    res.status(200).json({
      ok: true,
      mensaje: conductor.disponible ? 'El conductor figura ahora como disponible' : 'El conductor figura ahora como no disponible',
      datos: conductor
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al cambiar la disponibilidad', error: error.message });
  }
};

// -------------------------------------------------------------
// DELETE: Dar de baja un conductor por su ID de MongoDB
// -------------------------------------------------------------
exports.eliminarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductorEliminado = await Conductor.findByIdAndDelete(id);

    if (!conductorEliminado) {
      return res.status(404).json({ ok: false, mensaje: 'Conductor no encontrado' });
    }

    res.status(200).json({ ok: true, mensaje: 'Conductor dado de baja correctamente de la BD' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar el conductor', error: error.message });
  }
};
