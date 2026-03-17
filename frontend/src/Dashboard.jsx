import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecetaCard from './components/RecetaCard';
import './Dashboard.css';

const Dashboard = () => {
    const [recetas, setRecetas] = useState([]);
    const [nuevaReceta, setNuevaReceta] = useState({
        titulo: '',
        descripcion: '',
        ingredientes: [{ nombre: '', cantidad: '' }],
        pasos: [''],
        dificultad: 'Media',
        tiempo: ''
    });

    const token = localStorage.getItem('userToken');

    useEffect(() => {
        obtenerRecetas();
    }, []);

    const obtenerRecetas = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/recetas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecetas(res.data);
        } catch (error) {
            console.error("Error al obtener recetas", error);
        }
    };

    // --- LÓGICA DE INGREDIENTES ---
    const manejarCambioIngrediente = (index, e) => {
        const nuevosIngredientes = [...nuevaReceta.ingredientes];
        nuevosIngredientes[index][e.target.name] = e.target.value;
        setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes });
    };

    const añadirFilaIngrediente = () => {
        setNuevaReceta({
            ...nuevaReceta, 
            ingredientes: [...nuevaReceta.ingredientes, { nombre: '', cantidad: '' }]
        });
    };

    const eliminarFilaIngrediente = (index) => {
        const nuevosIngredientes = nuevaReceta.ingredientes.filter((_, i) => i !== index);
        setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes });
    };

    // --- LÓGICA DE PASOS ---
    const manejarCambioPaso = (index, e) => {
        const nuevosPasos = [...nuevaReceta.pasos];
        nuevosPasos[index] = e.target.value;
        setNuevaReceta({ ...nuevaReceta, pasos: nuevosPasos });
    };

    const añadirFilaPaso = () => {
        setNuevaReceta({ ...nuevaReceta, pasos: [...nuevaReceta.pasos, ''] });
    };

    const eliminarFilaPaso = (index) => {
        const nuevosPasos = nuevaReceta.pasos.filter((_, i) => i !== index);
        setNuevaReceta({ ...nuevaReceta, pasos: nuevosPasos });
    };

    // --- ACCIONES DE RECETA ---
    const guardarReceta = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/recetas', nuevaReceta, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("¡Receta guardada con éxito!");
            setNuevaReceta({
                titulo: '', descripcion: '', ingredientes: [{ nombre: '', cantidad: '' }],
                pasos: [''], dificultad: 'Media', tiempo: ''
            });
            obtenerRecetas();
        } catch (error) {
            alert("Error al guardar la receta");
        }
    };

    const eliminarReceta = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar toda la receta?")) {
            try {
                await axios.delete(`http://localhost:5000/api/recetas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                obtenerRecetas();
            } catch (error) {
                console.error("Error al eliminar", error);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <section className="formulario-seccion">
                <h2>Nueva Creación 🧑‍🍳</h2>
                <form onSubmit={guardarReceta} className="receta-form">
                    <input 
                        type="text" placeholder="¿Cómo se llama el plato?" 
                        value={nuevaReceta.titulo} onChange={(e) => setNuevaReceta({...nuevaReceta, titulo: e.target.value})}
                        required 
                    />
                    
                    <textarea 
                        placeholder="Una breve descripción..." 
                        value={nuevaReceta.descripcion} onChange={(e) => setNuevaReceta({...nuevaReceta, descripcion: e.target.value})}
                    />

                    <div className="form-group">
                        <label>Ingredientes</label>
                        {nuevaReceta.ingredientes.map((ing, index) => (
                            <div key={index} className="fila-dinamica">
                                <input 
                                    type="text" name="nombre" placeholder="Ingrediente" 
                                    value={ing.nombre} onChange={(e) => manejarCambioIngrediente(index, e)} required
                                />
                                <input 
                                    type="text" name="cantidad" placeholder="Cant." 
                                    value={ing.cantidad} onChange={(e) => manejarCambioIngrediente(index, e)}
                                />
                                {nuevaReceta.ingredientes.length > 1 && (
                                    <button type="button" className="btn-borrar-fila" onClick={() => eliminarFilaIngrediente(index)}>✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={añadirFilaIngrediente} className="btn-add">+ Añadir</button>
                    </div>

                    <div className="form-group">
                        <label>Preparación</label>
                        {nuevaReceta.pasos.map((paso, index) => (
                            <div key={index} className="fila-dinamica-paso">
                                <span className="paso-numero">{index + 1}</span>
                                <input 
                                    type="text" value={paso} onChange={(e) => manejarCambioPaso(index, e)} 
                                    placeholder="Siguiente paso..." required
                                />
                                {nuevaReceta.pasos.length > 1 && (
                                    <button type="button" className="btn-borrar-fila" onClick={() => eliminarFilaPaso(index)}>✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={añadirFilaPaso} className="btn-add">+ Añadir paso</button>
                    </div>

                    <div className="form-row">
                        <select value={nuevaReceta.dificultad} onChange={(e) => setNuevaReceta({...nuevaReceta, dificultad: e.target.value})}>
                            <option value="Fácil">Fácil</option>
                            <option value="Media">Media</option>
                            <option value="Difícil">Difícil</option>
                        </select>
                        <input 
                            type="number" placeholder="Minutos" 
                            value={nuevaReceta.tiempo} onChange={(e) => setNuevaReceta({...nuevaReceta, tiempo: e.target.value})} 
                        />
                    </div>

                    <button type="submit" className="btn-guardar-receta">
                        🚀 Guardar Receta
                    </button>
                </form>
            </section>

            <section className="listado-seccion">
                <h2>Mis Recetas Guardadas</h2>
                <div className="recetas-grid">
                    {recetas.length > 0 ? (
                        recetas.map(receta => (
                            <RecetaCard key={receta._id} receta={receta} onEliminar={eliminarReceta} />
                        ))
                    ) : (
                        <p className="no-recetas">Aún no has guardado ninguna receta. ¡Empieza ahora!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;