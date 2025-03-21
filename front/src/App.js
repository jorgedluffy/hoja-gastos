import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Categorias from './components/categorias/Categorias';
import Dashboard from './components/dashboard/Dashboard';
import Graficos from './components/graficos/Graficos';
import Navbar from './components/navbar/Navbar';

const App = () => {
    return (
        <Router>
            <nav>
                <Navbar />
            </nav>
            <Routes>
                <Route path="/" element={<h1>Bienvenido al Gestor de Gastos</h1>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/graficos" element={<Graficos />} />
                <Route path="/categorias" element={<Categorias />} />
            </Routes>
        </Router>
    );
};

export default App;