// Frontend: React
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', cantidad: '', categoria: '' });

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
    };

    const handleAddGasto = async () => {
        if (!nuevoGasto.descripcion.trim() || parseFloat(nuevoGasto.cantidad) <= 0 || !nuevoGasto.categoria) {
            alert('Por favor, completa todos los campos correctamente: descripción no vacía, cantidad mayor a 0 y categoría seleccionada.');
            return;
        }
        const res = await axios.post('http://localhost:5000/gastos', nuevoGasto);
        setGastos([...gastos, res.data]);
        setNuevoGasto({ descripcion: '', cantidad: '', categoria: '' });
    };


    return (
        <div>
            <h1>Gestor de Gastos del Hogar</h1>

            <section>
                <h2>Categorías</h2>
                <input
                    type="text"
                    placeholder="Nueva categoría"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                />
                <button onClick={handleAddCategoria}>Añadir Categoría</button>
                <ul>
                    {categorias.map((cat) => (
                        <li key={cat._id}>{cat.nombre}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Gastos</h2>
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
                <button onClick={handleAddGasto}>Añadir Gasto</button>

                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto) => (
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
