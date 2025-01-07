import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Graficos from './pages/Graficos';

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/graficos">Gráficos</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<h1>Bienvenido al Gestor de Gastos</h1>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/graficos" element={<Graficos />} />
            </Routes>
        </Router>
    );
};

export default App;
