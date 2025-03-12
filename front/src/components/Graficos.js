import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import TotalGastos from './TotalGastos';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficos = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [filtros, setFiltros] = useState({ categoria: '', cantidad: '', fechaInicio: '', fechaFin: '' });

    useEffect(() => {
        const fetchData = async () => {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);
            const gastosRes = await axios.get('http://localhost:5000/gastos');
            setGastos(gastosRes.data);
        };
        fetchData();
    }, []);

    const filtrarGastos = () => {
        return gastos.filter((gasto) => {
            const cumpleCategoria = filtros.categoria ? gasto.categoria?._id === filtros.categoria : true;
            const cumpleCantidad = filtros.cantidad ? parseFloat(gasto.cantidad) >= parseFloat(filtros.cantidad) : true;
            const cumpleFecha = (filtros.fechaInicio && filtros.fechaFin) ?
                (new Date(gasto.fecha) >= new Date(filtros.fechaInicio) && new Date(gasto.fecha) <= new Date(filtros.fechaFin))
                : true;
            return cumpleCategoria && cumpleCantidad && cumpleFecha;
        });
    };

    const obtenerDatosGrafico = () => {
        const categoriasNombres = categorias.map((cat) => cat.nombre);
        const categoriasTotales = categorias.map((cat) =>
            filtrarGastos()
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
            <TotalGastos gastos={filtrarGastos()} />

            {/* Gráfico */}
            <Bar data={obtenerDatosGrafico()} />
        </div>
    );
};

export default Graficos;
