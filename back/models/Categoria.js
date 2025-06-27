const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    color: { type: String, required: false },
});
module.exports = mongoose.model('Categoria', CategoriaSchema);