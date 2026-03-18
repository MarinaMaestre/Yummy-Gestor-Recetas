const Receta = require('../models/Receta');

// 1. OBTENER TODAS LAS RECETAS DEL USUARIO
exports.obtenerRecetas = async (req, res) => {
    try {
        const usuarioId = req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : null;
        if (!usuarioId) return res.status(401).json({ msg: 'No autorizado' });

        const recetas = await Receta.find({ usuario: usuarioId }).sort({ createdAt: -1 });
        res.json(recetas);
    } catch (error) {
        res.status(500).send('Error al obtener recetas');
    }
};

// 2. OBTENER UNA SOLA RECETA POR ID
exports.obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id);
        if (!receta) return res.status(404).json({ msg: 'Receta no encontrada' });

        const usuarioId = req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : null;
        if (receta.usuario.toString() !== usuarioId) {
            return res.status(401).json({ msg: 'No tienes permiso para ver esta receta' });
        }

        res.json(receta);
    } catch (error) {
        res.status(500).send('Error al buscar la receta');
    }
};

// 3. CREAR RECETA
exports.crearReceta = async (req, res) => {
    try {
        const { titulo, descripcion, ingredientes, pasos, dificultad, tiempo } = req.body;
        const usuarioId = req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : null;

        const nuevaReceta = new Receta({
            titulo,
            descripcion,
            ingredientes,
            pasos,
            dificultad,
            tiempo,
            usuario: usuarioId
        });

        await nuevaReceta.save();
        res.status(201).json(nuevaReceta);
    } catch (error) {
        res.status(500).send('Error al guardar la receta');
    }
};

// 4. ELIMINAR RECETA
exports.eliminarReceta = async (req, res) => {
    try {
        const usuarioId = req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : null;
        const receta = await Receta.findById(req.params.id);

        if (!receta) return res.status(404).json({ msg: 'No encontrada' });
        if (receta.usuario.toString() !== usuarioId) return res.status(401).json({ msg: 'No autorizado' });

        await Receta.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Receta eliminada' });
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
};

// 5. EDITAR RECETA (ACTUALIZAR)
exports.actualizarReceta = async (req, res) => {
    try {
        const { titulo, descripcion, ingredientes, pasos, dificultad, tiempo } = req.body;
        let receta = await Receta.findById(req.params.id);

        if (!receta) {
            return res.status(404).json({ msg: "Receta no encontrada" });
        }

        // Usamos la misma lógica de usuarioId que en las otras funciones
        const usuarioId = req.user ? (req.user.usuario ? req.user.usuario.id : req.user.id) : null;
        
        if (receta.usuario.toString() !== usuarioId) {
            return res.status(401).json({ msg: "No autorizado para editar esta receta" });
        }

        const nuevaInformacion = {
            titulo,
            descripcion,
            ingredientes,
            pasos,
            dificultad,
            tiempo
        };

        receta = await Receta.findByIdAndUpdate(
            req.params.id,
            { $set: nuevaInformacion },
            { new: true }
        );

        res.json(receta);
    } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al actualizar la receta");
    }
};