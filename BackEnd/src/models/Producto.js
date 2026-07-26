const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    id_restaurante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: [true, "El restaurante es obligatorio."]
    },

    id_categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es obligatoria."]
    },

    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio."],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres."],
      maxlength: [100, "El nombre no puede superar los 100 caracteres."]
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria."],
      trim: true,
      maxlength: [500, "La descripción no puede superar los 500 caracteres."]
    },

    precio_original: {
      type: Number,
      required: [true, "El precio original es obligatorio."],
      min: [0, "El precio original no puede ser negativo."]
    },

    precio_descuento: {
      type: Number,
      required: [true, "El precio con descuento es obligatorio."],
      min: [0, "El precio con descuento no puede ser negativo."],
      validate: {
        validator: function (precio) {
          return precio <= this.precio_original;
        },
        message:
          "El precio con descuento no puede superar el precio original."
      }
    },

    cantidad_disponible: {
      type: Number,
      required: [true, "La cantidad disponible es obligatoria."],
      min: [0, "La cantidad disponible no puede ser negativa."],
      default: 0
    },

    url_imagen: {
      type: String,
      trim: true,
      default: ""
    },

    fecha_disponibilidad: {
      type: Date,
      default: Date.now
    },

    fecha_vencimiento: {
      type: Date,
      required: [true, "La fecha de vencimiento es obligatoria."]
    },

    estado: {
      type: String,
      enum: ["ACTIVO", "INACTIVO", "AGOTADO"],
      default: "ACTIVO"
    }
  },
  {
    collection: "Productos",
    timestamps: true
  }
);

productoSchema.index({
  id_restaurante: 1,
  nombre: 1
});

module.exports = mongoose.model("Producto", productoSchema);