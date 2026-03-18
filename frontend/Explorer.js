import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecetaCard from './components/RecetaCard'; // Reutilizamos tu tarjeta
import './Dashboard.css'; // Reutilizamos los estilos para que sea coherente

const Explorar = () => {
    const [recetasPublicas, setRecetasPublicas] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const obtenerRecetasPublicas = async () => {
            try {
                // Llamamos a un endpoint que nos traiga solo lo público
                const res = await axios.get('http://localhost:5000/api/recetas/publicas');
                setRecetasPublicas(res.data);
            } catch (error) {
                console.error("Error al obtener recetas públicas", error);
            }
        };
        obtenerRecetasPublicas();
    }, []);

    const filtradas = recetasPublicas.filter(r => 
        r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Explorar Recetas 🌍</h1>
                    <p>Descubre los secretos culinarios de otros chefs</p>
                </div>
            </header>

            <section className="listado-seccion">
                <div className="controles-listado">
                    <div className="buscador-container">
                        <span className="lupa-icono">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Busca una receta pública..." 
                            className="input-busqueda" 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="recetas-grid">
                    {filtradas.length > 0 ? (
                        filtradas.map(receta => (
                            <RecetaCard 
                                key={receta._id} 
                                receta={receta} 
                                // En explorar no solemos dejar editar o borrar si no somos dueños
                                soloLectura={true} 
                            />
                        ))
                    ) : (
                        <p className="no-recetas-aviso">Todavía no hay recetas compartidas... ¡Sé la primera!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Explorar;