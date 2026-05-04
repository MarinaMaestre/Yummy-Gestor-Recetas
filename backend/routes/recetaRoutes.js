const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const auth = require('../middleware/auth');

// Obtener todas las recetas públicas (de todos los usuarios)
router.get('/publicas', recetaController.obtenerRecetasPublicas);

// Todas estas rutas pasan por el "guardián" auth
router.get('/', auth, recetaController.obtenerRecetas); // obtener todas las recetas de mi listado
router.get('/:id', auth, recetaController.obtenerRecetaPorId); // obtener una receta por su ID
router.post('/', auth, recetaController.crearReceta); // crear receta nueva
router.delete('/:id', auth, recetaController.eliminarReceta); // borrar una receta
router.put('/:id', auth, recetaController.actualizarReceta); // actualizar una receta

module.exports = router;

// Este es el Router, es el mapa de mi API. Aquí defino qué 'puertas' dejo abiertas para todo el mundo y cuáles protejo con seguridad para que cada usuario solo gestione lo suyo.