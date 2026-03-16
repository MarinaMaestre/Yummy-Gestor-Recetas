const mongoose = require('mongoose');

const recetaSchema = mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    ingredientes: [{
        nombre: { type: String, required: true },
        cantidad: { type: String }
    }],
    pasos: [{ type: String, required: true }],
    dificultad: { type: String, enum: ['Fácil', 'Media', 'Difícil'], default: 'Media' },
    tiempo: { type: Number }, // En minutos
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
    foto: { type: String } // URL de la imagen
}, { timestamps: true });

module.exports = mongoose.model('Receta', recetaSchema);