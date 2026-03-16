const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        // Encriptar contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordHasheada
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: '✅ Usuario creado con éxito' });
    } catch (error) {
        res.status(400).json({ mensaje: '❌ Error al registrar', error: error.message });
    }
};

// Autenticar usuario (Login)
const autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ mensaje: 'Usuario no existe' });

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

        const payload = { usuario: { id: usuario.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
            if (error) throw error;
            res.json({ token });
        });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};

// Exportamos AMBAS funciones para que authRoutes las encuentre
module.exports = { registrarUsuario, autenticarUsuario };