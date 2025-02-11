const mongoose = require('mongoose')

const model = mongoose.Schema({
    nome: String,
    desc: String,
    capacidade: Number,
    foto: String,
})

module.exports = mongoose.model('Labortorio', model)