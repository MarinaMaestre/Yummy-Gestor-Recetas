import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecetaCard from './components/RecetaCard';
import './Dashboard.css'; // Usamos los mismos estilos

const Explorar = () => {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerPublicas = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/recetas/publicas');
                setRecetas(res.data);
            } catch (err) {
                console.error("Error en Explorar", err);
            } finally {
                setCargando(false);
            }
        };
        obtenerPublicas();
    }, []);

    const filtradas = recetas.filter(r => 
        (r.titulo || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        (r.categoria || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Explorar Comunidad 🌍</h1>
                    <p>Descubre qué están cocinando otros usuarios</p>
                </div>
            </header>

            <div className="controles-listado">
                <div className="buscador-container">
                    <span className="lupa-icono">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Busca por nombre o categoría..." 
                        className="input-busqueda"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {cargando ? (
                <p className="no-recetas-aviso">Cocinando la lista de recetas...</p>
            ) : (
                <div className="recetas-grid">
                    {filtradas.length > 0 ? (
                        filtradas.map(receta => (
                            <RecetaCard 
                                key={receta._id} 
                                receta={receta} 
                                soloLectura={true} // Para que no salgan botones de editar/borrar
                            />
                        ))
                    ) : (
                        <p className="no-recetas-aviso">Nadie ha compartido recetas todavía. ¡Sé la primera! 🥘</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Explorar;