const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Categoria = require('../models/Categoria');
const Gasto = require('../models/Gasto');

const cargarCsv = async (req, res) => {
    const filePath = req.file?.path;

    if (!filePath) {
        return res.status(400).json({ error: 'Archivo no recibido' });
    }

    const results = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ',', mapHeaders: ({ header }) => header.trim().toLowerCase() }))
            .on('data', (data) => {
                // Validación de los campos necesarios
                const { descripcion, cantidad, categoria, fecha } = data;

                if (!descripcion || !cantidad || !categoria || !fecha) {
                    console.warn("Fila inválida:", data);
                    return; // saltar fila
                }

                results.push({
                    descripcion: descripcion.trim(),
                    cantidad: parseFloat(cantidad),
                    categoria: categoria.trim(),
                    fecha: fecha.trim()
                });
            })
            .on('end', async () => {
                try {
                    for (const item of results) {
                        const { descripcion, cantidad, categoria, fecha } = item;

                        if (isNaN(cantidad) || cantidad <= 0) {
                            throw new Error(`Cantidad inválida: ${cantidad}`);
                        }

                        let categoriaDoc = await Categoria.findOne({ nombre: categoria });
                        if (!categoriaDoc) {
                            categoriaDoc = new Categoria({ nombre: categoria });
                            await categoriaDoc.save();
                        }

                        const nuevoGasto = new Gasto({
                            descripcion,
                            cantidad,
                            categoria: categoriaDoc._id,
                            fecha: new Date(fecha.split('/').reverse().join('-')) // 25/03/2025 -> 2025-03-25
                        });

                        await nuevoGasto.save();
                    }

                    fs.unlinkSync(filePath); // Eliminar el archivo después de procesar
                    res.status(201).json({ mensaje: 'Datos importados exitosamente', total: results.length });

                } catch (error) {
                    console.error('❌ Error al guardar en la base de datos:', error.message);
                    res.status(500).json({ error: error.message });
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV:', err.message);
                res.status(400).json({ error: 'Error al leer el archivo CSV' });
            });

    } catch (error) {
        console.error('❌ Error general:', error.message);
        fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Error general al procesar el archivo' });
    }
};
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

        const csv = Papa.unparse(dataProcesada, { delimiter: "," });
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
module.exports = { descargarCsv, cargarCsv };