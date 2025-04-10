import { Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';

const GastoModal = ({ open, onClose, gasto, categorias, setGastos, gastos }) => {
    const [formData, setFormData] = useState({ descripcion: '', cantidad: '', categoria: '' });

    useEffect(() => {
        if (gasto) {
            setFormData({
                descripcion: gasto.descripcion ?? '',
                cantidad: gasto.cantidad ?? '',
                categoria: gasto.categoria?._id ?? ''
            });
        } else {
            setFormData({ descripcion: '', cantidad: '', categoria: '' });
        }
    }, [gasto]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.descripcion.trim() || parseFloat(formData.cantidad) <= 0 || !formData.categoria) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        try {
            let res;
            if (gasto) {
                // Editar gasto existente
                res = await fetch(`http://localhost:5000/gastos/${gasto._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                // Añadir nuevo gasto
                res = await fetch('http://localhost:5000/gastos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error desconocido al guardar el gasto.');
            }

            const updatedGasto = await res.json();

            if (gasto) {
                setGastos(gastos.map(g => g._id === gasto._id ? updatedGasto : g));
            } else {
                setGastos([...gastos, updatedGasto]);
            }

            onClose();
        } catch (error) {
            alert(`Error al procesar el gasto: ${error.message}`);
            console.error('Error al procesar el gasto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="dialog">
                <h3>{gasto ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
                <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                />
                <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                >
                    <option value="">Seleccione Categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
                <div className="dialog-buttons">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSubmit}>Aceptar</button>
                </div>
            </div>
        </Dialog>
    );
};

export default GastoModal;
