const { default: mongoose, trusted } = require("mongoose");

const reseñaSchema = new mongoose.Schema({
    id_cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente"
    },
    id_restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurante"
    },
    comentario: {
        type: String,
        required: true
    },
    calificacion: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {collection: 'Reseñas'});

module.exports = mongoose.model('Reseña',reseñaSchema);

