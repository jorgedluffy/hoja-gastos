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
/*
 const results = fs.readFileSync(filePath, 'utf-8');

        // Parsear CSV con opciones personalizadas
        await parse(results, {
            delimiter: ',',   // Separador de columnas
            columns: true,    // Usar primera fila como nombres de columnas
            trim: true        // Quitar espacios en blanco
        }, async (err, csvContent) => {
            console.log("Archivo try2<");
            if (err) {
                console.error("❌ Error al procesar el CSV:", err.message);
                return res.status(400).json({ error: "Error al procesar el CSV" });
            }

            console.log("✅ CSV Parseado:", csvContent);

            try {
                for (const item of csvContent) {
                    const { descripcion, cantidad, categoria, fecha } = item;

                    // Validar cantidad
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
                        fecha: new Date(fecha.split('/').reverse().join('-')) // Formato correcto YYYY-MM-DD
                    });
                    await nuevoGasto.save();
                }

                // Borrar archivo temporal
                fs.unlinkSync(filePath);

                res.status(201).json({ mensaje: 'Datos importados exitosamente', total: csvContent.length });
            } catch (error) {
                console.error('❌ Error al guardar en la base de datos:', error.message);
                res.status(500).json({ error: error.message });
            }
        });*/