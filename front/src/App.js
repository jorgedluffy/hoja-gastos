import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Graficos from './components/Graficos';
import Categorias from './components/Categorias';
import Navbar from './components/Navbar';

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