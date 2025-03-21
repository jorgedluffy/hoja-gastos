import axios from 'axios';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale, // Para gráficos de líneas y radar
    LineElement,
    PointElement, // Para gráficos de pastel (Pie)
    RadialLinearScale,
    Title,
    Tooltip
} from 'chart.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import TotalGastos from '../gastos/TotalGastos';
import './Graficos.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Tooltip,
    Legend
);
// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficos = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [filtros, setFiltros] = useState({ categoria: '', cantidad: '', fechaInicio: '', fechaFin: '' });

    // Función para obtener datos filtrados desde el backend
    const fetchData = useCallback(async () => {
        try {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);

            const params = new URLSearchParams(filtros).toString();
            const gastosRes = await axios.get(`http://localhost:5000/gastos?${params}`);
            setGastos(gastosRes.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }, [filtros]);

    // Llamar a fetchData cada vez que cambien los filtros
    useEffect(() => {
        fetchData();
    }, [filtros, fetchData]);


    // Generar datos para el gráfico

    const obtenerDatosPie = () => {
        const categoriasNombres = categorias.map(cat => cat.nombre);
        const categoriasTotales = categorias.map(cat =>
            gastos.filter(g => g.categoria?._id === cat._id)
                .reduce((sum, g) => sum + parseFloat(g.cantidad), 0)
        );
        return {
            labels: categoriasNombres,
            datasets: [{
                data: categoriasTotales,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverOffset: 4
            }]
        };
    };

    const obtenerDatosLinea = () => {
        const fechas = [...new Set(gastos.map(g => new Date(g.fecha).toLocaleDateString()))].sort();
        const totalPorFecha = fechas.map(fecha =>
            gastos.filter(g => new Date(g.fecha).toLocaleDateString() === fecha)
                .reduce((sum, g) => sum + parseFloat(g.cantidad), 0)
        );
        return {
            labels: fechas,
            datasets: [{
                label: 'Gastos en el tiempo',
                data: totalPorFecha,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        };
    };


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
            <section className='grafico'>
                <section>
                    <h2>Gastos por Categoría</h2>
                    <Bar data={obtenerDatosGrafico()} />
                </section>
                <section>
                    <h2>Gastos en el Tiempo</h2>
                    <Line data={obtenerDatosLinea()} />
                </section>
            </section>
            <section className='grafico'>
                <section>
                    <h2>Distribución de Gastos</h2>
                    <Pie data={obtenerDatosPie()} />
                </section>
                <section>
                    <h2>Radar</h2>
                    <Radar data={obtenerDatosPie()} />
                </section>
            </section>
        </div>
    );
};

export default Graficos;
