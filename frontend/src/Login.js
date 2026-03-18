import React, { useState } from 'react';
import { login } from './services/authService';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            // Si todo va bien, redirigimos
            window.location.href = '/'; 
        } catch (err) {
            setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>¡Bienvenid@ a Yummy! 🥘</h1>
                    <p>Introduce tus datos para gestionar tus recetas</p>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="mini-label">Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="tu@email.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="mini-label">Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" className="btn-login">
                        Entrar en mi cocina
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿Eres nuev@? <a href="/register">Crea una cuenta aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;