import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@mui/material';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importar iconos
import './Dashboard.css';

const Dashboard = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', cantidad: '', categoria: '' });
    const [editarGasto, setEditarGasto] = useState(null);
    const [filtros, setFiltros] = useState({ categoria: '', cantidad: '', fecha: '' });

    const [dialogGastoOpen, setDialogGastoOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);
            const gastosRes = await axios.get('http://localhost:5000/gastos');
            setGastos(gastosRes.data);
        };
        fetchData();
    }, []);

    // Añadir nuevo gasto
    const handleAddGasto = async () => {
        if (!nuevoGasto.descripcion.trim() || parseFloat(nuevoGasto.cantidad) <= 0 || !nuevoGasto.categoria) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const categoriaSeleccionada = categorias.find((cat) => cat._id === nuevoGasto.categoria);
        if (!categoriaSeleccionada) {
            alert('La categoría seleccionada no es válida.');
            return;
        }

        try {
            const gastoData = { ...nuevoGasto, categoria: categoriaSeleccionada._id };
            const res = await axios.post('http://localhost:5000/gastos', gastoData);
            setGastos([...gastos, { ...res.data, categoria: categoriaSeleccionada }]);
            setNuevoGasto({ descripcion: '', cantidad: '', categoria: '' });
            setDialogGastoOpen(false);
        } catch (error) {
            console.error('Error al agregar el gasto:', error);
        }
    };

    // Editar gasto
    const handleEditGasto = async () => {
        if (!editarGasto.descripcion.trim() || parseFloat(editarGasto.cantidad) <= 0 || !editarGasto.categoria) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const categoriaSeleccionada = categorias.find((cat) => cat._id === editarGasto.categoria);
        if (!categoriaSeleccionada) {
            alert('La categoría seleccionada no es válida.');
            return;
        }

        try {
            const gastoData = { ...editarGasto, categoria: categoriaSeleccionada._id };
            const res = await axios.put(`http://localhost:5000/gastos/${editarGasto._id}`, gastoData);
            setGastos(
                gastos.map((gasto) =>
                    gasto._id === editarGasto._id ? { ...res.data, categoria: categoriaSeleccionada } : gasto
                )
            );
            setEditarGasto(null);
        } catch (error) {
            console.error('Error al editar el gasto:', error);
        }
    };

    // Eliminar gasto
    const handleDeleteGasto = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            try {
                await axios.delete(`http://localhost:5000/gastos/${id}`);
                setGastos(gastos.filter((gasto) => gasto._id !== id));
            } catch (error) {
                console.error('Error al eliminar el gasto:', error);
            }
        }
    };

    const filtrarGastos = () => {
        return gastos.filter((gasto) => {
            const cumpleCategoria = filtros.categoria ? gasto.categoria?._id === filtros.categoria : true;
            const cumpleCantidad = filtros.cantidad ? parseFloat(gasto.cantidad) >= parseFloat(filtros.cantidad) : true;
            const cumpleFecha = filtros.fecha ? new Date(gasto.fecha).toLocaleDateString() === filtros.fecha : true;
            return cumpleCategoria && cumpleCantidad && cumpleFecha;
        });
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarGastos().map((gasto) => (
                            <tr key={gasto._id}>
                                <td>{gasto.descripcion}</td>
                                <td>{gasto.cantidad}</td>
                                <td>{gasto.categoria?.nombre}</td>
                                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                                <td>
                                    <FaEdit
                                        className="icono-accion"
                                        onClick={() => setEditarGasto({ ...gasto })}
                                    />
                                    <FaTrash
                                        className="icono-accion"
                                        onClick={() => handleDeleteGasto(gasto._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Dialogo para editar gasto */}
            {editarGasto && (
                <Dialog open={!!editarGasto} onClose={() => setEditarGasto(null)}>
                    <div className="dialog">
                        <h3>Editar Gasto</h3>
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={editarGasto.descripcion}
                            onChange={(e) => setEditarGasto({ ...editarGasto, descripcion: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={editarGasto.cantidad}
                            onChange={(e) => setEditarGasto({ ...editarGasto, cantidad: e.target.value })}
                        />
                        <select
                            value={editarGasto.categoria}
                            onChange={(e) => setEditarGasto({ ...editarGasto, categoria: e.target.value })}
                        >
                            <option value="">Seleccione Categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="dialog-buttons">
                            <button onClick={() => setEditarGasto(null)}>Cancelar</button>
                            <button onClick={handleEditGasto}>Aceptar</button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default Dashboard;
