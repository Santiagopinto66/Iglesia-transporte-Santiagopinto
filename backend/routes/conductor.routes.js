const express = require('express');
const router = express.Router();

const conductorController = require('../controllers/conductor.controller');

router.get('/', conductorController.obtenerConductores);
router.get('/:id', conductorController.obtenerConductorPorId);
router.post('/', conductorController.crearConductor);
router.put('/:id', conductorController.actualizarConductor);
router.patch('/:id/disponibilidad', conductorController.cambiarDisponibilidad);
router.delete('/:id', conductorController.eliminarConductor);

module.exports = router;
