import axios from 'axios';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import TotalGastos from './TotalGastos';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficos = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
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

    // Generar datos para el gráfico
    const obtenerDatosGrafico = () => {
        const categoriasNombres = categorias.map((cat) => cat.nombre);
        const categoriasTotales = categorias.map((cat) =>
            gastos
                .filter((gasto) => gasto.categoria?._id === cat._id)
                .reduce((sum, gasto) => sum + parseFloat(gasto.cantidad), 0)
        );

        return {
            labels: categoriasNombres,
            datasets: [
                {
                    label: 'Gastos por Categoría',
                    data: categoriasTotales,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };
    };

    return (
        <div className="graficos">
            <h1>Gráficos de Gastos</h1>

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

            {/* Total Gastos */}
            <TotalGastos gastos={gastos} />

            {/* Gráfico */}
            <Bar data={obtenerDatosGrafico()} />
        </div>
    );
};

export default Graficos;
