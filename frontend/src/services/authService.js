import axios from 'axios';

// La URL de la API (Asegúrate de que el backend esté en el puerto 5000)
const API_URL = 'http://localhost:5000/api/auth';

// Función para hacer Login
export const login = async (email, password) => {
    try {
        // Añadimos /login para que la ruta sea http://localhost:5000/api/auth/login
        const response = await axios.post(`${API_URL}/login`, { email, password });
        
        // Si el servidor nos devuelve un token, lo guardamos
        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        // Si el servidor responde con un error, lo lanzamos para que Login.js lo capture
        console.error('Error en el servicio de login:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('userToken');
    // Opcional: podrías redirigir al login aquí
    window.location.href = '/login';
};

// Función para obtener el token guardado
export const getToken = () => {
    return localStorage.getItem('userToken');
};