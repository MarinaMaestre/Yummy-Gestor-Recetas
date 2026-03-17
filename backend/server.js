const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- Importante para conectar con React
const conectarDB = require('./config/db');

// 1. Importamos las rutas
const authRoutes = require('./routes/authRoutes');
const recetaRoutes = require('./routes/recetaRoutes');

dotenv.config();
const app = express();

// 2. Middlewares
app.use(cors()); // <--- Permite que React (puerto 3000) hable con Node (puerto 5000)
app.use(express.json()); // Vital para que el servidor entienda los datos que enviamos

// 3. Definición de las Rutas
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetaRoutes);

// Ruta de cortesía para verificar que el servidor vive
app.get('/', (req, res) => {
    res.send('🚀 Servidor de Yummy! funcionando correctamente');
});

// 4. Configuración del Puerto
const PORT = process.env.PORT || 5000;

// 5. Conexión a la Base de Datos y arranque del servidor
conectarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
    });
}).catch(error => {
    console.error('❌ Error al conectar la base de datos:', error);
});