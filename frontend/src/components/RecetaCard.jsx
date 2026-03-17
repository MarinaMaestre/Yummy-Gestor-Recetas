import React from 'react';
import { Link } from 'react-router-dom'; // <--- Importante para navegar
import './RecetaCard.css';

const RecetaCard = ({ receta, onEliminar }) => {
    // Extraemos los datos de la receta con valores por defecto por si falta algo
    const { 
        titulo = "Sin título", 
        dificultad = "Media", 
        tiempo = "--", 
        _id 
    } = receta;

    return (
        <div className="receta-card">
            {/* Decoración visual superior */}
            <div className="card-accent"></div>
            
            <div className="card-body">
                <div className="card-header">
                    <h3>{titulo}</h3>
                    <button 
                        className="btn-borrar" 
                        onClick={() => onEliminar(_id)}
                        title="Eliminar receta"
                    >
                        🗑️
                    </button>
                </div>

                <div className="receta-info">
                    {/* Convertimos a minúsculas para que el CSS de colores funcione */}
                    <span className={`badge-dificultad ${dificultad.toLowerCase()}`}>
                        {dificultad}
                    </span>
                    <span className="receta-tiempo">
                        🕒 {tiempo} min
                    </span>
                </div>

                <div className="card-footer">
                    <p className="receta-id">ID: {_id ? _id.substring(0, 8) : '...'}...</p>
                    
                    {/* CAMBIO CLAVE: El botón ahora es un Link que apunta a la ruta de detalle */}
                    <Link to={`/receta/${_id}`} className="btn-detalle">
                        Ver preparación
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecetaCard;