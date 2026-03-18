import React from 'react';
import { Link } from 'react-router-dom'; // Importante para la navegación
import './RecetaCard.css';

const RecetaCard = ({ receta, onEliminar, onEditar }) => {
    // Función para elegir un icono según la dificultad
    const obtenerIcono = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'fácil': return '🍳';
            case 'difícil': return '🧑‍🍳';
            default: return '🥘'; // Media
        }
    };

    return (
        <div className="receta-card">
            {/* Cabecera minimalista con el color de dificultad */}
            <div className={`card-accent ${receta.dificultad?.toLowerCase()}`}>
                <span className="icono-dificultad">{obtenerIcono(receta.dificultad)}</span>
            </div>
            
            <div className="card-body">
                <div className="card-header">
                    <h3>{receta.titulo}</h3>
                    <div className="card-actions">
                        <button className="btn-icon edit" onClick={() => onEditar(receta)} title="Editar">✏️</button>
                        <button className="btn-icon delete" onClick={() => onEliminar(receta._id)} title="Eliminar">🗑️</button>
                    </div>
                </div>

                <p className="descripcion-corta">{receta.descripcion}</p>

                <div className="receta-info">
                    <span className={`badge-dificultad ${receta.dificultad?.toLowerCase()}`}>
                        {receta.dificultad}
                    </span>
                    <span className="tiempo-tag">⏱️ {receta.tiempo || '--'} min</span>
                </div>

                <div className="card-footer">
                    {/* Convertimos el botón en un Link que apunta al ID de la receta */}
                    <Link to={`/receta/${receta._id}`} className="btn-detalle">
                        Ver preparación
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecetaCard;