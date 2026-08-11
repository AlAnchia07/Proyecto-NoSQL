const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio."],
      trim: true,
      unique: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres."],
      maxlength: [50, "El nombre no puede superar los 50 caracteres."]
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: [250, "La descripción no puede superar los 250 caracteres."]
    },

    tipo: {
      type: String,
      enum: {
        values: ["RESTAURANTE", "PRODUCTO"],
        message: "El tipo debe ser RESTAURANTE o PRODUCTO."
      },
      required: [true, "El tipo de categoría es obligatorio."]
    },

    estado: {
      type: String,
      enum: ["ACTIVA", "INACTIVA"],
      default: "ACTIVA"
    }
  },
  {
    collection: "Categorias",
    timestamps: true
  }
);

module.exports = mongoose.model("Categoria", categoriaSchema);