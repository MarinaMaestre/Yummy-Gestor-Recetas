const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const auth = require('../middleware/auth');

// Todas estas rutas pasan por el "guardián" auth
router.get('/', auth, recetaController.obtenerRecetas);
router.get('/:id', auth, recetaController.obtenerRecetaPorId); 
router.post('/', auth, recetaController.crearReceta);
router.delete('/:id', auth, recetaController.eliminarReceta);

module.exports = router;