// Frontend: React
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', monto: '', categoria: '' });

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
        const res = await axios.post('http://localhost:5000/categorias', { nombre: nuevaCategoria });
        setCategorias([...categorias, res.data]);
        setNuevaCategoria('');
    };

    const handleAddGasto = async () => {
        const res = await axios.post('http://localhost:5000/gastos', nuevoGasto);
        setGastos([...gastos, res.data]);
        setNuevoGasto({ descripcion: '', monto: '', categoria: '' });
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
                    placeholder="Monto"
                    value={nuevoGasto.monto}
                    onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
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
                            <th>Monto</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto) => (
                            <tr key={gasto._id}>
                                <td>{gasto.descripcion}</td>
                                <td>{gasto.monto}</td>
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
