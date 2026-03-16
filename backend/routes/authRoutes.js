const express = require('express');
const router = express.Router();
// Importamos las dos funciones del controlador
const { registrarUsuario, autenticarUsuario } = require('../controllers/authController');

// Ruta para registrarse: POST /api/auth/register
router.post('/register', registrarUsuario);

// Ruta para iniciar sesión (Login): POST /api/auth
router.post('/login', autenticarUsuario);

module.exports = router;