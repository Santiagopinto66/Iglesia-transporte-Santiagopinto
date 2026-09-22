const Recorrido = require('../models/Recorrido');

// -------------------------------------------------------------
// GET: Obtener todos los recorridos desde MongoDB
// Permite filtrar por origen, destino, días de servicio y estado
// Ej: /api/recorridos?localidadOrigen=Rodeo&diasServicio=habiles
// -------------------------------------------------------------
exports.obtenerRecorridos = async (req, res) => {
  try {
    const { localidadOrigen, localidadDestino, diasServicio, activo } = req.query;

    const filtro = {};
    if (localidadOrigen) filtro.localidadOrigen = localidadOrigen;
    if (localidadDestino) filtro.localidadDestino = localidadDestino;
    if (diasServicio) filtro.diasServicio = diasServicio;
    if (activo) filtro.activo = activo === 'true';

    const recorridos = await Recorrido.find(filtro).sort({ nombreLinea: 1 });

    res.status(200).json({ ok: true, cantidad: recorridos.length, datos: recorridos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// GET: Obtener un recorrido puntual por su ID de MongoDB
// -------------------------------------------------------------
exports.obtenerRecorridoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const recorrido = await Recorrido.findById(id);

    if (!recorrido) {
      return res.status(404).json({ ok: false, mensaje: 'Recorrido no encontrado' });
    }

    res.status(200).json({ ok: true, datos: recorrido });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar la base de datos', error: error.message });
  }
};

// -------------------------------------------------------------
// POST: Cargar un nuevo recorrido de colectivo en MongoDB
// -------------------------------------------------------------
exports.crearRecorrido = async (req, res) => {
  try {
    const {
      nombreLinea, empresa, localidadOrigen, localidadDestino,
      paradas, horariosSalida, diasServicio, frecuenciaMinutos,
      tarifa, observaciones
    } = req.body;

    if (!nombreLinea || !localidadOrigen || !localidadDestino) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El nombre de la línea, el origen y el destino son obligatorios'
      });
    }

    const nuevoRecorrido = new Recorrido({
      nombreLinea,
      empresa,
      localidadOrigen,
      localidadDestino,
      paradas: paradas || [],
      horariosSalida: horariosSalida || [],
      diasServicio: diasServicio || 'diario',
      frecuenciaMinutos,
      tarifa,
      observaciones
    });

    const recorridoGuardado = await nuevoRecorrido.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Recorrido cargado exitosamente en la base de datos',
      datos: recorridoGuardado
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al cargar el recorrido', error: error.message });
  }
};

// -------------------------------------------------------------
// PUT: Actualizar los datos de un recorrido por su ID
// -------------------------------------------------------------
exports.actualizarRecorrido = async (req, res) => {
  try {
    const { id } = req.params;

    const recorridoActualizado = await Recorrido.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!recorridoActualizado) {
      return res.status(404).json({ ok: false, mensaje: 'Recorrido no encontrado' });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Recorrido actualizado correctamente',
      datos: recorridoActualizado
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar el recorrido', error: error.message });
  }
};

// -------------------------------------------------------------
// PATCH: Activar o desactivar un recorrido (ej: si se suspende
// un servicio pero no se quiere borrar la información)
// -------------------------------------------------------------
exports.cambiarEstadoRecorrido = async (req, res) => {
  try {
    const { id } = req.params;
    const recorrido = await Recorrido.findById(id);

    if (!recorrido) {
      return res.status(404).json({ ok: false, mensaje: 'Recorrido no encontrado' });
    }

    recorrido.activo = typeof req.body.activo === 'boolean'
      ? req.body.activo
      : !recorrido.activo;

    await recorrido.save();

    res.status(200).json({
      ok: true,
      mensaje: recorrido.activo ? 'El recorrido figura ahora como activo' : 'El recorrido figura ahora como inactivo',
      datos: recorrido
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al cambiar el estado del recorrido', error: error.message });
  }
};

// -------------------------------------------------------------
// DELETE: Eliminar un recorrido por su ID de MongoDB
// -------------------------------------------------------------
exports.eliminarRecorrido = async (req, res) => {
  try {
    const { id } = req.params;
    const recorridoEliminado = await Recorrido.findByIdAndDelete(id);

    if (!recorridoEliminado) {
      return res.status(404).json({ ok: false, mensaje: 'Recorrido no encontrado' });
    }

    res.status(200).json({ ok: true, mensaje: 'Recorrido eliminado correctamente de la BD' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar el recorrido', error: error.message });
  }
};
