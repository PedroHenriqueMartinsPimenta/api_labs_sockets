const mongoose = require('mongoose')

const model = mongoose.Schema({
    email: String,
    senha: String,
});

module.exports = mongoose.model("User", model)