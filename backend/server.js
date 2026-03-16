const express = require('express');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');

// 1. Importamos las rutass
const authRoutes = require('./routes/authRoutes');
const recetaRoutes = require('./routes/recetaRoutes');

dotenv.config();
const app = express();

// 2. Middleware para leer JSON (Vital para Postman)
app.use(express.json());

// 3. Definición de las Rutas (solo una vez)
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetaRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Servidor de Yummy! funcionando correctamente');
});

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
    });
});