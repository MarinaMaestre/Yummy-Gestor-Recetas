import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// revisa si hay token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        // Si hay token, lo añade a la cabecera
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;