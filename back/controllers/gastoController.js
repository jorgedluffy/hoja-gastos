const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

const exportarCSV = async (req, res) => {

    const Gasto = require('../models/Gasto.js');
    try {
        const gastos = await Gasto.find().populate('categoria');
        const dataProcesada = gastos.map(gasto => ({
            descripcion: gasto.descripcion,
            cantidad: gasto.cantidad,
            categoria: gasto.categoria ? gasto.categoria.nombre : "Sin categoría",
            fecha: new Date(gasto.fecha).toLocaleDateString('es-ES')
        }));

        const csv = Papa.unparse(dataProcesada, { delimiter: ";" });
        const filePath = path.join(__dirname, '../temp/gastos.csv');

        fs.writeFileSync(filePath, "\uFEFF" + csv, 'utf8');

        res.download(filePath, 'gastos.csv', (err) => {
            if (err) console.error('Error al descargar el archivo CSV:', err);
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error al generar CSV:', error);
        res.status(500).json({ error: 'Error al generar el CSV' });
    }
};

module.exports = { exportarCSV };