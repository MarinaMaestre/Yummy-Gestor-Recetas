import React from 'react';
import { Link } from 'react-router-dom';
import './RecetaCard.css';

// 1. Añadimos soloLectura aquí
const RecetaCard = ({ receta, onEliminar, onEditar, soloLectura }) => {
    
    const obtenerIcono = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'fácil': return '🍳';
            case 'difícil': return '🧑‍🍳';
            default: return '🥘'; 
        }
    };

    return (
        <div className="receta-card">
            <div className={`card-accent ${receta.dificultad?.toLowerCase()}`}>
                <span className="icono-dificultad">{obtenerIcono(receta.dificultad)}</span>
            </div>
            
            <div className="card-body">
                <div className="card-header">
                    <h3>{receta.titulo}</h3>
                    
                    {/* 2. ENVOLVEMOS LAS ACCIONES: Solo se ven si NO es soloLectura */}
                    {!soloLectura && (
                        <div className="card-actions">
                            <button className="btn-icon edit" onClick={() => onEditar(receta)} title="Editar">✏️</button>
                            <button className="btn-icon delete" onClick={() => onEliminar(receta._id)} title="Eliminar">🗑️</button>
                        </div>
                    )}
                </div>

                <p className="descripcion-corta">{receta.descripcion}</p>

                <div className="receta-info">
                    <span className={`badge-dificultad ${receta.dificultad?.toLowerCase()}`}>
                        {receta.dificultad}
                    </span>
                    <span className="tiempo-tag">⏱️ {receta.tiempo || '--'} min</span>
                </div>

                <div className="card-footer">
                    <Link to={`/receta/${receta._id}`} className="btn-detalle">
                        Ver preparación
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecetaCard;