const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["RESTAURANTE", "CLIENTE", "EMPLEADO"],
        required: true
    },
    restaurante: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Restaurante",
        default: null
    }
}, {
    collection: "Usuarios"
});

module.exports = mongoose.model("Usuarios", usuarioSchema);