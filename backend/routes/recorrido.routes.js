const express = require('express');
const router = express.Router();

const recorridoController = require('../controllers/recorrido.controller');

router.get('/', recorridoController.obtenerRecorridos);
router.get('/:id', recorridoController.obtenerRecorridoPorId);
router.post('/', recorridoController.crearRecorrido);
router.put('/:id', recorridoController.actualizarRecorrido);
router.patch('/:id/estado', recorridoController.cambiarEstadoRecorrido);
router.delete('/:id', recorridoController.eliminarRecorrido);

module.exports = router;
