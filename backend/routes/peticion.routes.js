const express = require('express');
const router = express.Router();

const peticionController = require('../controllers/peticion.controller');

router.get('/', peticionController.obtenerPeticiones);
router.get('/:id', peticionController.obtenerPeticionPorId);
router.post('/', peticionController.crearPeticion);
router.put('/:id', peticionController.actualizarPeticion);
router.patch('/:id/apoyar', peticionController.apoyarPeticion);
router.delete('/:id', peticionController.eliminarPeticion);

module.exports = router;
