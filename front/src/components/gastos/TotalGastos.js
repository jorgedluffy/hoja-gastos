import React from 'react';

const TotalGastos = ({ gastos }) => {
    const total = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.cantidad), 0);

    return (
        <div className="total-gastos">
            <h2>Total Gastos</h2>
            <p>${total.toFixed(2)}</p>
        </div>
    );
};

export default TotalGastos;
