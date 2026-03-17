import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');

    const cerrarSesion = () => {
        localStorage.removeItem('userToken');
        navigate('/'); // Nos manda al login
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🥘 Yummy!</Link>
            </div>
            <div className="navbar-links">
                {token ? (
                    <>
                        <Link to="/dashboard">Mis Recetas</Link>
                        <Link to="/explorar">Explorar</Link>
                        <button onClick={cerrarSesion} className="btn-logout-nav">Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/">Login</Link>
                        <Link to="/register">Registro</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;