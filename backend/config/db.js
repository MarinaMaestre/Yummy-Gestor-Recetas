const mongoose = require('mongoose'); // llamamos a Mongoose para que traduzca. Es la librería que se usa para poner orden.

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // usamos async y await porque necesitamos que la app espere a que la base de datos responda
        console.log('✅ Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;


// es la clase que se encarga de conectar mi servidor con la base de datos en la nube con ayuda de mongoose.