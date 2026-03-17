import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecetaDetalle.css';

const RecetaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receta, setReceta] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerDetalle = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReceta(res.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al obtener la receta", error);
                setCargando(false);
            }
        };
        obtenerDetalle();
    }, [id]);

    if (cargando) return <div className="loading">Cargando receta...</div>;
    if (!receta) return <div className="error">No se encontró la receta.</div>;

    return (
        <div className="detalle-container">
            <button className="btn-volver" onClick={() => navigate(-1)}>← Volver al listado</button>
            
            <header className="detalle-header">
                {receta.foto && <img src={receta.foto} alt={receta.titulo} className="receta-foto-grande" />}
                <h1>{receta.titulo}</h1>
                <p className="descripcion">{receta.descripcion}</p>
                <div className="meta-info">
                    <span className={`badge ${receta.dificultad.toLowerCase()}`}>{receta.dificultad}</span>
                    <span>🕒 {receta.tiempo || '--'} min</span>
                </div>
            </header>

            <div className="detalle-grid">
                <section className="ingredientes">
                    <h3>🍎 Ingredientes</h3>
                    <ul>
                        {receta.ingredientes?.map((ing, index) => (
                            <li key={index}>
                                <strong>{ing.nombre}</strong> {ing.cantidad ? `- ${ing.cantidad}` : ''}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="pasos">
                    <h3>👨‍🍳 Pasos a seguir</h3>
                    <ol>
                        {receta.pasos?.map((paso, index) => (
                            <li key={index}>{paso}</li>
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default RecetaDetalle;