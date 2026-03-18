import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecetaCard from './components/RecetaCard';
import './Dashboard.css';

const CATEGORIAS = ['Entrante', 'Plato Principal', 'Postre', 'Desayuno/Merienda'];

const recetaVacia = {
    titulo: '',
    descripcion: '',
    ingredientes: [{ nombre: '', cantidad: '' }],
    pasos: [''],
    dificultad: 'Media',
    tiempo: '',
    categoria: 'Entrante',
    esPublica: false
};

const Dashboard = () => {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [recetaIdActual, setRecetaIdActual] = useState(null);
    const [nuevaReceta, setNuevaReceta] = useState(recetaVacia);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('userToken');

    const obtenerRecetas = useCallback(async () => {
        setCargando(true);
        try {
            const res = await axios.get('http://localhost:5000/api/recetas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecetas(res.data);
        } catch (err) {
            console.error("Error al obtener recetas", err);
            setError('No se pudieron cargar las recetas.');
        } finally {
            setCargando(false);
        }
    }, [token]);

    useEffect(() => {
        obtenerRecetas();
    }, [obtenerRecetas]);

    // FIX: comparación sin toLowerCase para evitar bugs con acentos y espacios,
    // usando trim() en ambos lados y comparando los valores exactos del array CATEGORIAS.
    const recetasFiltradas = recetas.filter(receta => {
        const busquedaLower = busqueda.toLowerCase();
        const coincideBusqueda =
            (receta.titulo || '').toLowerCase().includes(busquedaLower) ||
            (receta.ingredientes || []).some(ing =>
                (ing.nombre || '').toLowerCase().includes(busquedaLower)
            );

        const catReceta = (receta.categoria || 'Entrante').trim();
        const coincideCategoria =
            filtroCategoria === 'Todas' ||
            catReceta === filtroCategoria;

        return coincideBusqueda && coincideCategoria;
    });

    const prepararEdicion = (receta) => {
        setNuevaReceta({
            titulo: receta.titulo || '',
            descripcion: receta.descripcion || '',
            ingredientes: receta.ingredientes?.length
                ? receta.ingredientes
                : [{ nombre: '', cantidad: '' }],
            pasos: receta.pasos?.length ? receta.pasos : [''],
            dificultad: receta.dificultad || 'Media',
            tiempo: receta.tiempo || '',
            // FIX: garantizamos que la categoría guardada coincide exactamente
            // con uno de los valores del array CATEGORIAS
            categoria: CATEGORIAS.includes(receta.categoria?.trim())
                ? receta.categoria.trim()
                : 'Entrante',
            esPublica: receta.esPublica || false
        });
        setEditando(true);
        setMostrarFormulario(true);
        setRecetaIdActual(receta._id);
    };

    const manejarCambioIngrediente = (index, e) => {
        const nuevosIngredientes = [...nuevaReceta.ingredientes];
        nuevosIngredientes[index] = {
            ...nuevosIngredientes[index],
            [e.target.name]: e.target.value
        };
        setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes });
    };

    const manejarCambioPaso = (index, e) => {
        const nuevosPasos = [...nuevaReceta.pasos];
        nuevosPasos[index] = e.target.value;
        setNuevaReceta({ ...nuevaReceta, pasos: nuevosPasos });
    };

    const limpiarFormulario = () => {
        setNuevaReceta(recetaVacia);
        setEditando(false);
        setMostrarFormulario(false);
        setRecetaIdActual(null);
        setError('');
    };

    const guardarReceta = async (e) => {
        e.preventDefault();
        setError('');
        // FIX: enviamos la categoría con trim() para evitar espacios accidentales
        const recetaAGuardar = {
            ...nuevaReceta,
            categoria: nuevaReceta.categoria.trim()
        };
        try {
            if (editando) {
                await axios.put(
                    `http://localhost:5000/api/recetas/${recetaIdActual}`,
                    recetaAGuardar,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/recetas',
                    recetaAGuardar,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            limpiarFormulario();
            obtenerRecetas();
        } catch (err) {
            setError('Error al guardar la receta. Inténtalo de nuevo.');
        }
    };

    const eliminarReceta = async (id, titulo) => {
        if (window.confirm(`¿Seguro que quieres borrar "${titulo}"?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/recetas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                obtenerRecetas();
            } catch (err) {
                console.error("Error al eliminar", err);
            }
        }
    };

    const abrirFormularioNuevo = () => {
        setNuevaReceta(recetaVacia);
        setEditando(false);
        setMostrarFormulario(true);
    };

    // Cerrar modal con Escape
    useEffect(() => {
        const manejarEscape = (e) => {
            if (e.key === 'Escape' && mostrarFormulario) limpiarFormulario();
        };
        document.addEventListener('keydown', manejarEscape);
        return () => document.removeEventListener('keydown', manejarEscape);
    }, [mostrarFormulario]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Mis Recetas 🥘</h1>
                    <p>
                        Hola Marina, tienes{' '}
                        <strong>{recetas.length}</strong>{' '}
                        {recetas.length === 1 ? 'receta guardada' : 'recetas guardadas'}.
                    </p>
                </div>
                <button
                    className="btn-nueva-receta"
                    onClick={abrirFormularioNuevo}
                    aria-label="Añadir nueva receta"
                >
                    + Nueva Receta
                </button>
            </header>

            {/* ── MODAL FORMULARIO ── */}
            {mostrarFormulario && (
                <div
                    className="formulario-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-formulario"
                    onClick={(e) => { if (e.target === e.currentTarget) limpiarFormulario(); }}
                >
                    <div className="formulario-card">
                        <button
                            className="btn-cerrar-modal"
                            onClick={limpiarFormulario}
                            aria-label="Cerrar formulario"
                        >
                            ✕
                        </button>
                        <h2 id="titulo-formulario">
                            {editando ? 'Editar Receta ✏️' : 'Nueva Receta 🧑‍🍳'}
                        </h2>

                        {error && (
                            <p className="mensaje-error" role="alert">{error}</p>
                        )}

                        <form onSubmit={guardarReceta} className="receta-form" noValidate>

                            {/* Título */}
                            <div className="campo-grupo">
                                <label htmlFor="titulo" className="mini-label">Título</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={nuevaReceta.titulo}
                                    onChange={(e) => setNuevaReceta({ ...nuevaReceta, titulo: e.target.value })}
                                    required
                                    placeholder="Título de la receta"
                                    aria-required="true"
                                />
                            </div>

                            {/* Descripción */}
                            <div className="campo-grupo">
                                <label htmlFor="descripcion" className="mini-label">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    rows={3}
                                    value={nuevaReceta.descripcion}
                                    onChange={(e) => setNuevaReceta({ ...nuevaReceta, descripcion: e.target.value })}
                                    placeholder="Descripción breve de la receta..."
                                />
                            </div>

                            {/* Ingredientes */}
                            <fieldset className="campo-grupo campo-fieldset">
                                <legend className="mini-label">Ingredientes</legend>
                                {nuevaReceta.ingredientes.map((ing, index) => (
                                    <div key={index} className="fila-dinamica">
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre"
                                            value={ing.nombre}
                                            onChange={(e) => manejarCambioIngrediente(index, e)}
                                            required
                                            aria-label={`Nombre del ingrediente ${index + 1}`}
                                        />
                                        <input
                                            type="text"
                                            name="cantidad"
                                            placeholder="Cantidad"
                                            value={ing.cantidad}
                                            onChange={(e) => manejarCambioIngrediente(index, e)}
                                            aria-label={`Cantidad del ingrediente ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="btn-borrar-fila"
                                            onClick={() => setNuevaReceta({
                                                ...nuevaReceta,
                                                ingredientes: nuevaReceta.ingredientes.filter((_, i) => i !== index)
                                            })}
                                            aria-label={`Eliminar ingrediente ${index + 1}`}
                                            disabled={nuevaReceta.ingredientes.length === 1}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn-add-simple"
                                    onClick={() => setNuevaReceta({
                                        ...nuevaReceta,
                                        ingredientes: [...nuevaReceta.ingredientes, { nombre: '', cantidad: '' }]
                                    })}
                                >
                                    + Ingrediente
                                </button>
                            </fieldset>

                            {/* Pasos */}
                            <fieldset className="campo-grupo campo-fieldset">
                                <legend className="mini-label">Pasos</legend>
                                {nuevaReceta.pasos.map((paso, index) => (
                                    <div key={index} className="fila-dinamica-paso">
                                        <span className="paso-numero" aria-hidden="true">{index + 1}</span>
                                        <input
                                            type="text"
                                            value={paso}
                                            onChange={(e) => manejarCambioPaso(index, e)}
                                            required
                                            placeholder="Siguiente paso..."
                                            aria-label={`Paso ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="btn-borrar-fila"
                                            onClick={() => setNuevaReceta({
                                                ...nuevaReceta,
                                                pasos: nuevaReceta.pasos.filter((_, i) => i !== index)
                                            })}
                                            aria-label={`Eliminar paso ${index + 1}`}
                                            disabled={nuevaReceta.pasos.length === 1}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn-add-simple"
                                    onClick={() => setNuevaReceta({
                                        ...nuevaReceta,
                                        pasos: [...nuevaReceta.pasos, '']
                                    })}
                                >
                                    + Paso
                                </button>
                            </fieldset>

                            {/* Categoría + Dificultad */}
                            <div className="form-grid-ajustado">
                                <div className="sub-campo">
                                    <label htmlFor="categoria" className="mini-label">Categoría</label>
                                    <select
                                        id="categoria"
                                        value={nuevaReceta.categoria}
                                        onChange={(e) => setNuevaReceta({ ...nuevaReceta, categoria: e.target.value })}
                                    >
                                        {CATEGORIAS.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sub-campo">
                                    <label htmlFor="dificultad" className="mini-label">Dificultad</label>
                                    <select
                                        id="dificultad"
                                        value={nuevaReceta.dificultad}
                                        onChange={(e) => setNuevaReceta({ ...nuevaReceta, dificultad: e.target.value })}
                                    >
                                        <option value="Fácil">Fácil</option>
                                        <option value="Media">Media</option>
                                        <option value="Difícil">Difícil</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tiempo */}
                            <div className="campo-grupo">
                                <label htmlFor="tiempo" className="mini-label">Tiempo (minutos)</label>
                                <input
                                    id="tiempo"
                                    type="number"
                                    min="1"
                                    value={nuevaReceta.tiempo}
                                    onChange={(e) => setNuevaReceta({ ...nuevaReceta, tiempo: e.target.value })}
                                    placeholder="Ej: 30"
                                />
                            </div>

                            {/* Privacidad */}
                            <div className="privacidad-container">
                                <label className="switch" aria-label="Receta pública o privada">
                                    <input
                                        type="checkbox"
                                        checked={nuevaReceta.esPublica}
                                        onChange={(e) => setNuevaReceta({ ...nuevaReceta, esPublica: e.target.checked })}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={`privacidad-texto ${nuevaReceta.esPublica ? 'publica' : 'privada'}`}>
                                    {nuevaReceta.esPublica ? '🌍 Receta Pública' : '🔒 Receta Privada'}
                                </span>
                            </div>

                            <button type="submit" className="btn-guardar-principal">
                                {editando ? 'Actualizar Receta' : 'Guardar Receta'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── LISTADO ── */}
            <section className="listado-seccion" aria-label="Listado de recetas">
                <div className="controles-listado">
                    <nav className="categorias-filtros" aria-label="Filtrar por categoría">
                        {['Todas', ...CATEGORIAS].map(cat => (
                            <button
                                key={cat}
                                className={`btn-filtro ${filtroCategoria === cat ? 'activo' : ''}`}
                                onClick={() => setFiltroCategoria(cat)}
                                aria-pressed={filtroCategoria === cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>

                    <div className="buscador-container" role="search">
                        <span className="lupa-icono" aria-hidden="true">🔍</span>
                        <label htmlFor="buscador" className="sr-only">
                            Buscar recetas por título o ingrediente
                        </label>
                        <input
                            id="buscador"
                            type="search"
                            placeholder="Busca por título o ingrediente..."
                            className="input-busqueda"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {cargando ? (
                    <p className="estado-aviso" role="status" aria-live="polite">
                        Cargando recetas...
                    </p>
                ) : (
                    <div
                        className="recetas-grid"
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        {recetasFiltradas.length > 0 ? (
                            recetasFiltradas.map(receta => (
                                <RecetaCard
                                    key={receta._id}
                                    receta={receta}
                                    onEliminar={() => eliminarReceta(receta._id, receta.titulo)}
                                    onEditar={prepararEdicion}
                                />
                            ))
                        ) : (
                            <p className="no-recetas-aviso" role="status">
                                No hay recetas en esta categoría. 🥘
                            </p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;