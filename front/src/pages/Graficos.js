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

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficos = () => {
    const [categorias, setCategorias] = useState([]);
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const categoriasRes = await axios.get('http://localhost:5000/categorias');
            setCategorias(categoriasRes.data);
            const gastosRes = await axios.get('http://localhost:5000/gastos');
            setGastos(gastosRes.data);
        };
        fetchData();
    }, []);

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
            <Bar data={obtenerDatosGrafico()} />
        </div>
    );
};

export default Graficos;
