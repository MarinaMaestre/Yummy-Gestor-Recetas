const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Leer el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    // 3. Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- AQUÍ ESTÁ EL TRUCO ---
        // Si tu JWT guarda el usuario dentro de 'usuario', lo extraemos.
        // Si lo guarda directo, lo usamos directo.
        req.user = cifrado.usuario ? cifrado.usuario : cifrado;
        
        // Forzamos que req.user.id exista siempre (para el controlador)
        if (req.user._id && !req.user.id) req.user.id = req.user._id;

        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};