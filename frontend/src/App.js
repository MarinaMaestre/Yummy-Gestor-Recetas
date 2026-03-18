import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import RecetaDetalle from './RecetaDetalle'; 
// IMPORTAMOS EL EXPLORADOR
import Explorer from './Explorer'; 
import './App.css';

function App() {
    const token = localStorage.getItem('userToken');

    return (
        <Router>
            <div className="App">
                <Navbar /> 
                <Routes>
                    <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
                    
                    {/* CAMBIAMOS ESTA LÍNEA PARA QUE USE EL COMPONENTE */}
                    <Route path="/explorar" element={<Explorer />} />
                    
                    <Route path="/receta/:id" element={token ? <RecetaDetalle /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;