const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/gastos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Esquemas de MongoDB
const CategoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true }
});

const GastoSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    fecha: { type: Date, default: Date.now }
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);
const Gasto = mongoose.model('Gasto', GastoSchema);
//************************************************************************************************ 
//CSV
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

// Configurar almacenamiento de multer
const upload = multer({ dest: 'uploads/' });

// Ruta para procesar el archivo CSV
app.post('/cargar-csv', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;

    const results = [];
    try {
        // Leer y procesar el archivo CSV
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                fs.unlinkSync(filePath); // Eliminar archivo temporal

                // Procesar los datos e insertarlos en la base de datos
                for (const item of results) {
                    const { descripcion, cantidad, categoria } = item;

                    // Buscar categoría o crearla
                    let categoriaDoc = await Categoria.findOne({ nombre: categoria });
                    if (!categoriaDoc) {
                        categoriaDoc = new Categoria({ nombre: categoria });
                        await categoriaDoc.save();
                    }

                    // Crear gasto
                    const nuevoGasto = new Gasto({
                        descripcion,
                        cantidad: parseFloat(cantidad),
                        categoria: categoriaDoc._id,
                    });
                    await nuevoGasto.save();
                }

                res.json({ mensaje: 'Datos importados exitosamente', datos: results });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
});

//************************************************************************************************ 
// ** Rutas API **

// Categorías
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});

app.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validar si ya existe la categoría
        const categoriaExistente = await Categoria.findOne({ nombre: nombre.trim() });
        if (categoriaExistente) {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }

        const nuevaCategoria = new Categoria({ nombre: nombre.trim() });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
});

// Gastos
app.get('/gastos', async (req, res) => {
    try {
        const gastos = await Gasto.find().populate('categoria');
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los gastos' });
    }
});

app.post('/gastos', async (req, res) => {
    try {
        const { descripcion, cantidad, categoria } = req.body;

        // Validar datos requeridos
        if (!descripcion || !cantidad || !categoria) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoGasto = new Gasto(req.body);
        await nuevoGasto.save();
        const gastoGuardado = await Gasto.findById(nuevoGasto._id).populate('categoria');
        res.status(201).json(gastoGuardado);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el gasto' });
    }
});

// Actualizar gasto
app.put('/gastos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, cantidad, categoria } = req.body;

        if (!descripcion || !cantidad || !categoria) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const gastoActualizado = await Gasto.findByIdAndUpdate(
            id,
            { descripcion, cantidad, categoria },
            { new: true } // Devuelve el documento actualizado
        ).populate('categoria');
        if (!gastoActualizado) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(gastoActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el gasto' });
    }
});

// Eliminar categorias
app.delete('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);
        if (!categoriaEliminada) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }

        res.json({ mensaje: 'Categoria eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la categoria' });
    }
});

// Eliminar gasto
app.delete('/gastos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const gastoEliminado = await Gasto.findByIdAndDelete(id);
        if (!gastoEliminado) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json({ mensaje: 'Gasto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el gasto' });
    }
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
