const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const auth = require('../middleware/auth');

// Obtener todas las recetas públicas (de todos los usuarios)
router.get('/publicas', recetaController.obtenerRecetasPublicas);

// Todas estas rutas pasan por el "guardián" auth
router.get('/', auth, recetaController.obtenerRecetas);
router.get('/:id', auth, recetaController.obtenerRecetaPorId); 
router.post('/', auth, recetaController.crearReceta);
router.delete('/:id', auth, recetaController.eliminarReceta);
router.put('/:id', auth, recetaController.actualizarReceta);

module.exports = router;