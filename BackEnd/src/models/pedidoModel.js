const mongoose = require("mongoose");

//Productos q contiene el pedido
const productoPedidoSchema = new mongoose.Schema({
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precio_unitario: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

//Pedido
const pedidoSchema = new mongoose.Schema({
    id_cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },

    id_restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurante",
        required: true
    },

    productos_comprados: {
        type: [productoPedidoSchema],
        validate: {
            validator: function (productos) {
                return productos.length > 0;
            },
            message: "El pedido debe contener al menos un producto."
        }
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    descuento: {
        type: Number,
        default: 0,
        min: 0
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    tipo_entrega: {
        type: String,
        enum: [
            "RETIRO_EN_LOCAL",
            "EXPRESS"
        ],
        required: true
    },

    estado: {
        type: String,
        enum: [
            "PENDIENTE",
            "PREPARANDO",
            "LISTO_PARA_RETIRAR",
            "ENTREGADO",
            "CANCELADO"
        ],
        default: "PENDIENTE"
    },

    fecha_hora: {
        type: Date,
        default: Date.now
    }

}, {
    collection: "pedidos"
});

module.exports = mongoose.model("Pedido", pedidoSchema);