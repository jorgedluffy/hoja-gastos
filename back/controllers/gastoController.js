const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const descargarCsv = async (req, res) => {

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
}
const cargarCsv = async (req, res) => {
    console.log("Archivo recibido:", req.file);
    const filePath = req.file?.path;

    if (!filePath) {
        return res.status(400).json({ error: 'Archivo no recibido' });
    }

    const results = [];
    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => {
                console.log("Fila leída:", data);
                if (!data.descripcion || !data.cantidad || !data.categoria || !data.fecha) {
                    throw new Error('Archivo CSV con formato inválido. Faltan campos obligatorios.');
                }
                results.push(data);
            })
            .on('end', async () => {
                fs.unlinkSync(filePath); // Eliminar archivo temporal

                try {
                    // Guardar datos en la base de datos
                    for (const item of results) {
                        const { descripcion, cantidad, categoria } = item;

                        // Validar formato de datos
                        if (isNaN(cantidad) || parseFloat(cantidad) <= 0) {
                            throw new Error(`El campo cantidad "${cantidad}" no es válido.`);
                        }

                        // Buscar o crear la categoría
                        let categoriaDoc = await Categoria.findOne({ nombre: categoria });
                        if (!categoriaDoc) {
                            categoriaDoc = new Categoria({ nombre: categoria });
                            await categoriaDoc.save();
                        }

                        // Crear y guardar el gasto
                        const nuevoGasto = new Gasto({
                            descripcion,
                            cantidad: parseFloat(cantidad),
                            categoria: categoriaDoc._id,
                        });
                        await nuevoGasto.save();
                    }

                    res.status(201).json({ mensaje: 'Datos importados exitosamente', total: results.length });
                } catch (error) {
                    console.error('Error al guardar los datos en la base de datos:', error.message);
                    res.status(500).json({ error: error.message });
                }
            })
            .on('error', (err) => {
                console.error('Error al procesar el archivo CSV:', err.message);
                res.status(400).json({ error: err.message });
            });
    } catch (error) {
        console.error('Error general:', error.message);
        fs.unlinkSync(filePath); // Asegurar limpieza del archivo
        res.status(500).json({ error: 'Error al procesar el archivo CSV' });
    }
}
module.exports = { descargarCsv, cargarCsv };