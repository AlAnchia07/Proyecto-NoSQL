const mongoose = require("mongoose");

// Productos que contiene el pedido
const productoPedidoSchema = new mongoose.Schema(
  {
    id_producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
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
  },
  {
    _id: false
  }
);

// Pedido
const pedidoSchema = new mongoose.Schema(
  {
    id_cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
      required: true
    },

    id_restaurante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true
    },

    productos_comprados: {
      type: [productoPedidoSchema],
      required: true,
      validate: {
        validator(productos) {
          return Array.isArray(productos) && productos.length > 0;
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

    costo_entrega: {
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
      enum: ["RETIRO_EN_LOCAL", "EXPRESS"],
      required: true
    },

    metodo_pago: {
      type: String,
      enum: ["TARJETA", "SINPE", "EFECTIVO"],
      required: true
    },

    estado_pago: {
      type: String,
      enum: ["PENDIENTE", "PAGADO"],
      default: "PAGADO"
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
  },
  {
    collection: "pedidos"
  }
);

module.exports = mongoose.model("Pedido", pedidoSchema);