import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti'; // No olvides instalarlo: npm install canvas-confetti
import './RecetaDetalle.css';

const RecetaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receta, setReceta] = useState(null);
    
    const [ingredientesListos, setIngredientesListos] = useState([]);
    const [pasosListos, setPasosListos] = useState([]);
    const [modoLectura, setModoLectura] = useState(false);
    
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const obtenerDetalle = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReceta(res.data);
            } catch (error) {
                console.error("Error al obtener la receta", error);
            }
        };
        obtenerDetalle();
    }, [id, token]);

    const toggleIngrediente = (index) => {
        if (ingredientesListos.includes(index)) {
            setIngredientesListos(ingredientesListos.filter(i => i !== index));
        } else {
            setIngredientesListos([...ingredientesListos, index]);
        }
    };

    const togglePaso = (index) => {
        let nuevosPasosListos;
        if (pasosListos.includes(index)) {
            nuevosPasosListos = pasosListos.filter(i => i !== index);
        } else {
            nuevosPasosListos = [...pasosListos, index];
            if (nuevosPasosListos.length === receta.pasos.length) {
                lanzarConfeti();
            }
        }
        setPasosListos(nuevosPasosListos);
    };

    const lanzarConfeti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ 
                particleCount, 
                spread: 360, 
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ['#ff6b6b', '#ffd93d', '#6bc1ff', '#2ecc71']
            });
        }, 250);
    };

    if (!receta) return <div className="cargando">Cargando tu receta... 👩‍🍳</div>;

    return (
        <div className="detalle-container">
            <button className="btn-volver" onClick={() => navigate(-1)}>← Volver al Dashboard</button>
            
            <header className="detalle-header">
                <h1>{receta.titulo}</h1>
                <div className="detalle-meta">
                    <span className={`badge-dificultad ${receta.dificultad.toLowerCase()}`}>{receta.dificultad}</span>
                    <span className="tiempo-detalle">⏱️ {receta.tiempo} min</span>
                    <button 
                        className={`btn-lectura ${modoLectura ? 'activo' : ''}`} 
                        onClick={() => setModoLectura(!modoLectura)}
                    >
                        {modoLectura ? "👓 Modo Normal" : "🔍 Modo Lectura"}
                    </button>
                </div>
            </header>

            <div className="detalle-grid">
                <aside className="detalle-ingredientes">
                    <h3>Ingredientes</h3>
                    <p className="instruccion-tap">TOCA PARA MARCAR LO QUE YA TIENES</p>
                    <ul>
                        {receta.ingredientes.map((ing, index) => (
                            <li 
                                key={index} 
                                onClick={() => toggleIngrediente(index)}
                                className={ingredientesListos.includes(index) ? 'ingrediente-tachado' : ''}
                            >
                                <span className="check-box">{ingredientesListos.includes(index) ? '✅' : '⬜'}</span>
                                <span className="ing-cantidad">{ing.cantidad}</span>
                                <span className="ing-nombre">{ing.nombre}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="detalle-pasos">
                    <h3>Preparación</h3>
                    <p className="instruccion-tap">TOCA EL NÚMERO AL COMPLETAR EL PASO</p>
                    <ol className={modoLectura ? 'pasos-grandes' : ''}>
                        {receta.pasos.map((paso, index) => (
                            <li 
                                key={index} 
                                className={`paso-item ${pasosListos.includes(index) ? 'paso-completado' : ''}`}
                                onClick={() => togglePaso(index)}
                            >
                                <span className="paso-num">
                                    {pasosListos.includes(index) ? '✓' : index + 1}
                                </span>
                                <p>{paso}</p>
                            </li>
                        ))}
                    </ol>
                    {pasosListos.length === receta.pasos.length && (
                        <div className="mensaje-exito">
                            <p>✨ ¡Receta completada con éxito! ✨</p>
                            <h2>¡Buen provecho, Marina! 🥘🍴</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecetaDetalle;