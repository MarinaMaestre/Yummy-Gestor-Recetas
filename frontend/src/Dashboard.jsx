import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecetaCard from './components/RecetaCard';
import './Dashboard.css';

const Dashboard = () => {
    const [recetas, setRecetas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(true);

    const obtenerRecetas = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:5000/api/recetas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Datos recibidos de la API:", response.data);
            setRecetas(response.data);
            setCargando(false);
        } catch (error) {
            console.error("Error al cargar recetas:", error);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerRecetas();
    }, []);

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        try {
            const token = localStorage.getItem('userToken');
            // IMPORTANTE: Enviamos 'titulo' porque así está en tu Atlas
            await axios.post('http://localhost:5000/api/recetas', 
                { titulo: nombre }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNombre('');
            obtenerRecetas(); 
        } catch (error) {
            alert("Error al guardar la receta");
        }
    };

    const eliminarReceta = async (id) => {
        if (!window.confirm("¿Seguro que quieres borrar esta receta?")) return;
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:5000/api/recetas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            obtenerRecetas();
        } catch (error) {
            alert("No se pudo eliminar");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="main-header">
                <h1>🥘 Mi Cocina Yummy</h1>
                <button className="btn-logout" onClick={() => { localStorage.removeItem('userToken'); window.location.reload(); }}>
                    Cerrar Sesión
                </button>
            </header>

            <form onSubmit={handleGuardar} className="add-recipe-form">
                <input 
                    type="text"
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder="Nombre de la nueva receta..." 
                    required
                />
                <button type="submit" className="btn-save">Guardar</button>
            </form>

            <section className="list-container">
                {cargando ? (
                    <p>Cocinando datos...</p>
                ) : recetas.length > 0 ? (
                    <div className="recetas-grid">
                        {recetas.map(r => (
                            <RecetaCard key={r._id} receta={r} onEliminar={eliminarReceta} />
                        ))}
                    </div>
                ) : (
                    <p>No hay recetas en la base de datos yummy_db.</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;