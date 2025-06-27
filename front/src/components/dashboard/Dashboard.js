import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import * as API_URLS from '../../api/api_urls';

const Resume = () => {
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        const fetchGastos = async () => {
            try {
                const res = await axios.get(`${API_URLS.GASTOS}`);
                setGastos(res.data);
            } catch (error) {
                console.error('Error al cargar los gastos:', error);
            }
        };

        fetchGastos();
    }, []);

    const obtenerResumen = () => {
        const resumen = {};

        gastos.forEach((gasto) => {
            const categoria = gasto.categoria?.nombre || 'Sin categoría';
            const fecha = new Date(gasto.fecha);
            const mes = fecha.getMonth();


            if (!resumen[categoria]) {
                resumen[categoria] = Array(12).fill(0);
            }

            resumen[categoria][mes] += gasto.cantidad;
        });
        return resumen;
    };

    const getColor = (categoria) => {
        return gastos.filter(gasto => gasto.categoria?.nombre === categoria)[0]?.categoria?.color || '';
    }

    return (
        <div className="resumen">
            <h1>Resumen</h1>


            <section>
                <table className="tabla-gastos">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Enero</th>
                            <th>Febrero</th>
                            <th>Marzo</th>
                            <th>Abril</th>
                            <th>Mayo</th>
                            <th>Junio</th>
                            <th>Julio</th>
                            <th>Agosto</th>
                            <th>Septiembre</th>
                            <th>Octubre</th>
                            <th>Noviembre</th>
                            <th>Diciembre</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(obtenerResumen()).map(([categoria, montos], index) => {
                            const total = montos.reduce((acc, val) => acc + val, 0);
                            return (
                                <tr key={index} >
                                    <td style={{ backgroundColor: getColor(categoria) }}>{categoria}</td>
                                    {montos.map((monto, i) => (
                                        <td key={i}>{monto.toFixed(2)}</td>
                                    ))}
                                    <td><strong>{total.toFixed(2)}</strong></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

        </div>
    );
};

export default Resume;
