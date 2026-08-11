const { default: mongoose, trusted } = require("mongoose");

const notificacionSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios"
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    mensaje: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        default: false
    }
    
}, {collection: 'Notificaciones'});

module.exports = mongoose.model('Notificacion',notificacionSchema);