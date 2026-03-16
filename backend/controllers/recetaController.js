const Receta = require('../models/Receta');

// Crear una nueva receta
exports.crearReceta = async (req, res) => {
    try {
        const { titulo, descripcion, ingredientes, pasos, dificultad, tiempo } = req.body;
        
        const nuevaReceta = new Receta({
            titulo,
            descripcion,
            ingredientes,
            pasos,
            dificultad,
            tiempo,
            usuario: req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : "6980ec34cf17a49d7ad35819"
        });

        await nuevaReceta.save();
        res.status(201).json({ msg: '¡Receta guardada con éxito!', nuevaReceta });
    } catch (error) {
        res.status(500).send('Hubo un error al guardar la receta');
    }
};