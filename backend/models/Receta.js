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
    tiempo: { type: Number },
   
    categoria: { 
        type: String, 
        enum: ['Entrante', 'Plato Principal', 'Postre', 'Desayuno/Merienda'], 
        default: 'Entrante' 
    },
    esPublica: { type: Boolean, default: false },
    
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
    foto: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Receta', recetaSchema);