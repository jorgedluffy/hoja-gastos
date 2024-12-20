// Frontend: React
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@mui/material';
import './App.css';

const App = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', cantidad: '', categoria: '' });
    const [filtros, setFiltros] = useState({ categoria: '', cantidad: '', fecha: '' });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    const [dialogGastoOpen, setDialogGastoOpen] = useState(false);

    // Load data from backend
    useEffect(() => {
        const fetchData = async () => {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);
            const gastosRes = await axios.get('http://localhost:5000/gastos');
            setGastos(gastosRes.data);
        };
        fetchData();
    }, []);

    // Handlers for adding data
    const handleAddCategoria = async () => {
        if (!nuevaCategoria.trim()) {
            alert('El nombre de la categoría no puede estar vacío.');
            return;
        }
        const res = await axios.post('http://localhost:5000/categorias', { nombre: nuevaCategoria });
        setCategorias([...categorias, res.data]);
        setNuevaCategoria('');
        setDialogOpen(false);
    };

    const handleAddGasto = async () => {
        if (!nuevoGasto.descripcion.trim() || parseFloat(nuevoGasto.cantidad) <= 0 || !nuevoGasto.categoria) {
            alert('Por favor, completa todos los campos correctamente: descripción no vacía, cantidad mayor a 0 y categoría seleccionada.');
            return;
        }

        // Ensure categoria ID is correctly set
        const categoriaSeleccionada = categorias.find(cat => cat._id === nuevoGasto.categoria);
        if (!categoriaSeleccionada) {
            alert('La categoría seleccionada no es válida.');
            return;
        }

        const gastoData = {
            ...nuevoGasto,
            categoria: categoriaSeleccionada._id // Send only the ID to backend
        };

        const res = await axios.post('http://localhost:5000/gastos', gastoData);
        setGastos([...gastos, { ...res.data, categoria: categoriaSeleccionada }]); // Save full category info for display
        setNuevoGasto({ descripcion: '', cantidad: '', categoria: '' });
        setDialogGastoOpen(false);
    };

    // Filtrar gastos según criterios
    const filtrarGastos = () => {
        return gastos.filter((gasto) => {
            const cumpleCategoria = filtros.categoria ? gasto.categoria?._id === filtros.categoria : true;
            const cumpleCantidad = filtros.cantidad ? parseFloat(gasto.cantidad) >= parseFloat(filtros.cantidad) : true;
            const cumpleFecha = filtros.fecha ? new Date(gasto.fecha).toLocaleDateString() === filtros.fecha : true;
            return cumpleCategoria && cumpleCantidad && cumpleFecha;
        });
    };

    const handleCantidadFiltro = (e) => {
        const value = e.target.value;
        setFiltros({ ...filtros, cantidad: value >= 1 ? value : 1 });
    };

    return (
        <div className="app">
            <h1 className="titulo">Gestor de Gastos del Hogar</h1>

            <section className="categorias">
                <h2>Categorías</h2>
                <button onClick={() => setDialogOpen(true)}>Añadir Categoría</button>
                <ul>
                    {categorias.map((cat) => (
                        <li key={cat._id}>{cat.nombre}</li>
                    ))}
                </ul>
            </section>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <div className="dialog">
                    <h3>Nueva Categoría</h3>
                    <input
                        type="text"
                        placeholder="Nueva categoría"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                    />
                    <div className="dialog-buttons">
                        <button onClick={() => setDialogOpen(false)}>Cancelar</button>
                        <button onClick={handleAddCategoria}>Aceptar</button>
                    </div>
                </div>
            </Dialog>

            <section className="filtros">
                <h2>Filtrar Gastos</h2>
                <div className="filtros-container">
                    <div>
                        <label>Categoría:</label>
                        <select
                            value={filtros.categoria}
                            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                        >
                            <option value="">Todas</option>
                            {categorias.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Cantidad mínima:</label>
                        <input
                            type="number"
                            placeholder="Cantidad mínima"
                            value={filtros.cantidad}
                            onChange={handleCantidadFiltro}
                        />
                    </div>
                    <div>
                        <label>Fecha:</label>
                        <input
                            type="date"
                            value={filtros.fecha}
                            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            <section className="gastos">
                <h2>Gastos</h2>
                <button onClick={() => setDialogGastoOpen(true)}>Añadir Gasto</button>

                <Dialog open={dialogGastoOpen} onClose={() => setDialogGastoOpen(false)}>
                    <div className="dialog">
                        <h3>Nuevo Gasto</h3>
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={nuevoGasto.descripcion}
                            onChange={(e) => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={nuevoGasto.cantidad}
                            onChange={(e) => setNuevoGasto({ ...nuevoGasto, cantidad: e.target.value })}
                        />
                        <select
                            value={nuevoGasto.categoria}
                            onChange={(e) => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
                        >
                            <option value="">Seleccione Categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="dialog-buttons">
                            <button onClick={() => setDialogGastoOpen(false)}>Cancelar</button>
                            <button onClick={handleAddGasto}>Aceptar</button>
                        </div>
                    </div>
                </Dialog>

                <table className="tabla-gastos">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarGastos().map((gasto) => (
                            <tr key={gasto._id}>
                                <td>{gasto.descripcion}</td>
                                <td>{gasto.cantidad}</td>
                                <td>{gasto.categoria?.nombre}</td>
                                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default App;
