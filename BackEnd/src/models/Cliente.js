const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    ubicacion: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    url_imagen: {
        type: String
    },
    telefono: {
        type: String
    },
    favoritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurante"
    }]
}, {
    collection: "Clientes"
});

// Índice geoespacial para búsquedas por ubicación
clienteSchema.index({ ubicacion: "2dsphere" });

module.exports = mongoose.model("Cliente", clienteSchema);