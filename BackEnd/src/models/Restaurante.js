const mongoose = require("mongoose");

const restauranteSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    id_categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
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
    horario: {
        lunes: {
            apertura: String,
            cierre: String
        },
        martes: {
            apertura: String,
            cierre: String
        },
        miercoles: {
            apertura: String,
            cierre: String
        },
        jueves: {
            apertura: String,
            cierre: String
        },
        viernes: {
            apertura: String,
            cierre: String
        },
        sabado: {
            apertura: String,
            cierre: String
        },
        domingo: {
            apertura: String,
            cierre: String
        }
    },
    correo_contacto: {
        type: String,
        required: true
    },
    telefonos: [{
        type: String
    }],
    estado: {
        type: String,
        enum: ["ACTIVO", "INACTIVO", "SUSPENDIDO"],
        default: "ACTIVO"
    },
    tipos_entrega: [{
        type: String,
        enum: [
            "RETIRO_EN_LOCAL",
            "EXPRESS",
            "ENTREGA_PROPIA"
        ]
    }]
}, {
    collection: "Restaurantes"
});

// Índice para búsquedas por ubicación
restauranteSchema.index({ ubicacion: "2dsphere" });

module.exports = mongoose.model("Restaurante", restauranteSchema);