const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    correo_registro: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    tipo_usuario: {
        type: String,
        enum: ["CLIENTE", "RESTAURANTE"],
        required: true
    }
}, {
    collection: "Usuarios"
});

module.exports = mongoose.model("Usuario", usuarioSchema);