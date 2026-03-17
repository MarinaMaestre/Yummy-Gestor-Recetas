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
            // Si todo va bien, redirigimos o refrescamos
            window.location.href = '/'; 
        } catch (err) {
            setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-container">
            <h2>Bienvenida a Yummy</h2>
            <p>Introduce tus datos para gestionar tus recetas</p>
            
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Tu contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                
                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                
                <button type="submit" className="btn-login">
                    Entrar en mi cocina
                </button>
            </form>
        </div>
    );
};

export default Login;