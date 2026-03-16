const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const auth = require('../middleware/auth'); // Nuestro particular guardián

// Ruta para crear una receta
// POST /api/recetas
router.post('/', auth, recetaController.crearReceta);

module.exports = router;