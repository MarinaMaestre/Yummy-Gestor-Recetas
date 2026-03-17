import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reutilizamos el estilo de login para que sean hermanos

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                nombre,
                email,
                password
            });
            
            // Si todo va bien, mandamos al usuario al login con un mensaje
            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.msg || "Hubo un error al crear la cuenta");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>🥘 Únete a Yummy!</h2>
                <p>Crea tu cuenta y empieza a guardar tus mejores platos</p>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Marina García" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="correo@ejemplo.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login">Registrarme</button>
                </form>

                <p className="login-footer">
                    ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;