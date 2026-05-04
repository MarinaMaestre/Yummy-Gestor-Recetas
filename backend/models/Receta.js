const mongoose = require('mongoose');

const recetaSchema = mongoose.Schema({
    titulo: { type: String, required: true }, // añadimos true al título para que siempre sea obligatorio.
    descripcion: { type: String },
    ingredientes: [{
        nombre: { type: String, required: true },
        cantidad: { type: String }
    }],
    pasos: [{ type: String, required: true }],
    dificultad: { type: String, enum: ['Fácil', 'Media', 'Difícil'], default: 'Media' }, // usamos enum por lo que el user solo podrá elegir entre las opciones dadas, sin añadir ninguna nueva.
    tiempo: { type: Number },
   
    categoria: { 
        type: String, 
        enum: ['Entrante', 'Plato Principal', 'Postre', 'Desayuno/Merienda'], 
        default: 'Entrante' 
    },
    esPublica: { type: Boolean, default: false }, 
    
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false }, // guarda el ID del autor para saber a qué usuario pertenece cada receta.
    foto: { type: String }
}, { timestamps: true }); // usamos timestamps para que de manera automática el sistema nos guarde fecha y hora de creación o edición de la receta.

module.exports = mongoose.model('Receta', recetaSchema);

// es la clase que define como deben ser los datos que guardamos (en este caso de la receta.)