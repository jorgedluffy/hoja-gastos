// Backend: Node.js + Express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Connect to MongoDB (Example using MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/gastos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Schema Definitions
const CategoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});

const GastoSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    monto: { type: Number, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    fecha: { type: Date, default: Date.now }
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);
const Gasto = mongoose.model('Gasto', GastoSchema);

// API Endpoints
app.get('/categorias', async (req, res) => {
    const categorias = await Categoria.find();
    res.json(categorias);
});

app.post('/categorias', async (req, res) => {
    const nuevaCategoria = new Categoria(req.body);
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
});

app.get('/gastos', async (req, res) => {
    const gastos = await Gasto.find().populate('categoria');
    res.json(gastos);
});

app.post('/gastos', async (req, res) => {
    const nuevoGasto = new Gasto(req.body);
    await nuevoGasto.save();
    res.status(201).json(nuevoGasto);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
