const Peticion = require('../models/Peticion');

// -------------------------------------------------------------
// GET: Obtener todas las peticiones desde MongoDB
// Permite filtrar por tipo y estado
// Ej: /api/peticiones?tipo=cambio_horario&estado=abierta
// -------------------------------------------------------------
exports.obtenerPeticiones = async (req, res) => {
  try {
    const { tipo, estado } = req.query;

    const filtro = {};
    if (tipo) filtro.tipo = tipo;
    if (estado) filtro.estado = estado;

    const peticiones = await Peticion.find(filtro).sort({ apoyos: -1, createdAt: -1 });

    res.status(200).json({ ok: true, cantidad: peticiones.length, datos: peticiones });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// GET: Obtener una petición puntual por su ID de MongoDB
// -------------------------------------------------------------
exports.obtenerPeticionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const peticion = await Peticion.findById(id);

    if (!peticion) {
      return res.status(404).json({ ok: false, mensaje: 'Petición no encontrada' });
    }

    res.status(200).json({ ok: true, datos: peticion });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// POST: Guardar una nueva petición en MongoDB
// -------------------------------------------------------------
exports.crearPeticion = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, origen, destino, horarioActual, horarioSugerido, autor } = req.body;

    if (!titulo || !descripcion || !tipo || !origen || !destino || !autor) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Título, descripción, tipo, origen, destino y autor son obligatorios'
      });
    }

    const nuevaPeticion = new Peticion({
      titulo,
      descripcion,
      tipo,
      origen,
      destino,
      horarioActual,
      horarioSugerido,
      autor
    });

    const peticionGuardada = await nuevaPeticion.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Petición creada exitosamente en la base de datos',
      datos: peticionGuardada
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al guardar la petición', error: error.message });
  }
};

// -------------------------------------------------------------
// PUT: Actualizar una petición por su ID de MongoDB
// -------------------------------------------------------------
exports.actualizarPeticion = async (req, res) => {
  try {
    const { id } = req.params;

    const datos = { ...req.body };
    delete datos.apoyos;

    const peticionActualizada = await Peticion.findByIdAndUpdate(id, datos, { new: true, runValidators: true });

    if (!peticionActualizada) {
      return res.status(404).json({ ok: false, mensaje: 'Petición no encontrada' });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Petición actualizada correctamente',
      datos: peticionActualizada
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar la petición', error: error.message });
  }
};

// -------------------------------------------------------------
// PATCH: Sumar un apoyo de un vecino a la petición
// -------------------------------------------------------------
exports.apoyarPeticion = async (req, res) => {
  try {
    const { id } = req.params;

    const peticion = await Peticion.findByIdAndUpdate(id, { $inc: { apoyos: 1 } }, { new: true });

    if (!peticion) {
      return res.status(404).json({ ok: false, mensaje: 'Petición no encontrada' });
    }

    res.status(200).json({
      ok: true,
      mensaje: `La petición ahora cuenta con ${peticion.apoyos} apoyo(s)`,
      datos: peticion
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar el apoyo', error: error.message });
  }
};

// -------------------------------------------------------------
// DELETE: Eliminar una petición por su ID de MongoDB
// -------------------------------------------------------------
exports.eliminarPeticion = async (req, res) => {
  try {
    const { id } = req.params;
    const peticionEliminada = await Peticion.findByIdAndDelete(id);

    if (!peticionEliminada) {
      return res.status(404).json({ ok: false, mensaje: 'Petición no encontrada' });
    }

    res.status(200).json({ ok: true, mensaje: 'Petición eliminada correctamente de la BD' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar la petición', error: error.message });
  }
};
