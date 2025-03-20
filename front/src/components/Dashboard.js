import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos
import './Dashboard.css';
import GastoModal from './GastoModal';
import TotalGastos from './TotalGastos';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const [filtros, setFiltros] = useState({ categoria: '', cantidad: '', fechaInicio: '', fechaFin: '' });

    // Función para obtener datos filtrados desde el backend
    const fetchData = async () => {
        try {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);

            const params = new URLSearchParams(filtros).toString(); // Convierte filtros en query string
            const gastosRes = await axios.get(`http://localhost:5000/gastos?${params}`);
            setGastos(gastosRes.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Llamar a fetchData cada vez que cambien los filtros
    useEffect(() => {
        fetchData();
    }, [filtros]);

    // Manejo de archivos CSV
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo CSV.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            setError('');
            setSuccess('');
            const res = await axios.post('http://localhost:5000/cargar-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(`Datos cargados exitosamente: ${res.data.total} registros procesados.`);
            setFile(null);
            fetchData(); // Volver a obtener los datos después de cargar el CSV
        } catch (err) {
            setError(err.response?.data?.error || 'Error desconocido. Verifica el formato del archivo.');
        }
    };

    // Abrir modal para añadir o editar gasto
    const abrirModal = (gasto = null) => {
        setGastoSeleccionado(gasto);
        setModalOpen(true);
    };

    // Cerrar modal
    const cerrarModal = () => {
        setModalOpen(false);
        setGastoSeleccionado(null);
    };

    // Manejo de eliminación
    const handleDeleteGasto = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            try {
                await axios.delete(`http://localhost:5000/gastos/${id}`);
                fetchData(); // Volver a obtener los datos después de eliminar un gasto
            } catch (error) {
                console.error('Error al eliminar el gasto:', error);
            }
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            {/* Sección CSV */}
            <section className='csvGastos'>
                <section>
                    <h2>CSV</h2>
                    <form onSubmit={handleFileUpload}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                                setError('');
                                setSuccess('');
                            }}
                        />
                        <button type="submit">Cargar CSV</button>
                    </form>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                </section>
                <section>
                    <h2>Gastos</h2>
                    <button onClick={() => abrirModal()}>Añadir Gasto</button>
                </section>
            </section>

            {/* Filtros */}
            <section className="filtros">
                <h2>Filtrar Gastos</h2>
                <div className="filtros-container">
                    <label>Categoría:
                        <select value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}>
                            <option value="">Todas</option>
                            {categorias.map((cat) => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
                        </select>
                    </label>
                    <label>Cantidad mínima:
                        <input type="number" value={filtros.cantidad} onChange={(e) => setFiltros({ ...filtros, cantidad: e.target.value })} />
                    </label>
                    <label>Fecha desde:
                        <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
                    </label>
                    <label>Fecha hasta:
                        <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
                    </label>
                </div>
            </section>

            {/* Tabla de gastos */}
            <section className="gastosTotal">
                <TotalGastos gastos={gastos} />
            </section>
            <section>
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
                        {gastos.map((gasto) => (
                            <tr key={gasto._id}>
                                <td>{gasto.descripcion}</td>
                                <td>{gasto.cantidad}</td>
                                <td>{gasto.categoria?.nombre}</td>
                                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                                <td>
                                    <FaEdit className="icono-accion" onClick={() => abrirModal(gasto)} />
                                    <FaTrash className="icono-accion" onClick={() => handleDeleteGasto(gasto._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Modal para añadir/editar gasto */}
            {modalOpen && <GastoModal open={modalOpen} onClose={cerrarModal} gasto={gastoSeleccionado} categorias={categorias} setGastos={setGastos} gastos={gastos} />}
        </div>
    );
};

export default Dashboard;
