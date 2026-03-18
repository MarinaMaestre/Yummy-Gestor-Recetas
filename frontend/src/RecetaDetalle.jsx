import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti'; 
import './RecetaDetalle.css';

const RecetaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receta, setReceta] = useState(null);
    
    // Estados para el progreso
    const [ingredientesListos, setIngredientesListos] = useState([]);
    const [pasosListos, setPasosListos] = useState([]);
    const [modoLectura, setModoLectura] = useState(false);
    
    // Referencia para bajar la pantalla automáticamente al final
    const mensajeFinalRef = useRef(null);
    
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const obtenerDetalle = async () => {
            try {
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, config);
                setReceta(res.data);
            } catch (error) {
                console.error("Error al obtener la receta", error);
            }
        };
        obtenerDetalle();
    }, [id, token]);

    // Efecto para hacer scroll suave cuando se termina la receta
    useEffect(() => {
        if (receta && pasosListos.length === receta.pasos.length && pasosListos.length > 0) {
            setTimeout(() => {
                mensajeFinalRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [pasosListos, receta]);

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

    if (!receta) return <div className="cargando-screen">Preparando los fogones... 👩‍🍳</div>;

    return (
        <div className={`detalle-container ${modoLectura ? 'modo-lectura-activo' : ''}`}>
            
            <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>
            
            <header className="detalle-header">
                {receta.categoria && <div className="categoria-tag">{receta.categoria}</div>}
                <h1>{receta.titulo}</h1>
                <div className="detalle-meta">
                    <span className={`badge-dificultad ${receta.dificultad.toLowerCase()}`}>{receta.dificultad}</span>
                    <span className="tiempo-detalle">⏱️ {receta.tiempo || '--'} min</span>
                    <button 
                        className={`btn-lectura ${modoLectura ? 'activo' : ''}`} 
                        onClick={() => setModoLectura(!modoLectura)}
                    >
                        {modoLectura ? "👓 Ver Normal" : "🔍 Modo Lectura"}
                    </button>
                </div>
            </header>

            <div className="detalle-grid">
                <aside className="detalle-ingredientes">
                    <h3>Ingredientes</h3>
                    <p className="instruccion-tap">MARCA LOS QUE TENGAS LISTOS</p>
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
                    <h3>Pasos a seguir</h3>
                    <p className="instruccion-tap">TOCA EL PASO AL TERMINARLO</p>
                    <div className={modoLectura ? 'pasos-en-foco' : 'pasos-lista'}>
                        {receta.pasos.map((paso, index) => (
                            <div 
                                key={index} 
                                className={`paso-item ${pasosListos.includes(index) ? 'paso-completado' : ''}`}
                                onClick={() => togglePaso(index)}
                            >
                                <span className="paso-num">
                                    {pasosListos.includes(index) ? '✓' : index + 1}
                                </span>
                                <p>{paso}</p>
                            </div>
                        ))}
                    </div>
                    
                    {pasosListos.length === receta.pasos.length && (
                        <div className="mensaje-exito" ref={mensajeFinalRef}>
                            <p>✨ ¡Receta completada! ✨</p>
                            <h2>¡Buen provecho, {receta.usuario?.nombre || 'Chef'}! 🥘🍴</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecetaDetalle;