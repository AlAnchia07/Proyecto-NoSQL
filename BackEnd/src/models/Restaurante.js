const mongoose = require("mongoose");

const horarioDiaSchema = new mongoose.Schema(
  {
    apertura: {
      type: String,
      trim: true,
      default: ""
    },
    cierre: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    _id: false
  }
);

const restauranteSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: [true, "El usuario es obligatorio."],
    },

    id_categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es obligatoria."]
    },

    nombre: {
      type: String,
      required: [true, "El nombre del restaurante es obligatorio."],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres."],
      maxlength: [100, "El nombre no puede superar los 100 caracteres."]
    },

    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria."],
      trim: true,
      maxlength: [250, "La dirección no puede superar los 250 caracteres."]
    },

    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },

      coordinates: {
        type: [Number],
        required: [true, "Las coordenadas son obligatorias."],
        validate: {
          validator: function (coordinates) {
            return (
              Array.isArray(coordinates) &&
              coordinates.length === 2 &&
              coordinates.every((valor) => Number.isFinite(valor))
            );
          },
          message:
            "La ubicación debe contener longitud y latitud."
        }
      }
    },

    url_imagen: {
      type: String,
      trim: true,
      default: ""
    },

    horario: {
      lunes: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      martes: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      miercoles: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      jueves: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      viernes: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      sabado: {
        type: horarioDiaSchema,
        default: () => ({})
      },
      domingo: {
        type: horarioDiaSchema,
        default: () => ({})
      }
    },

    correo_contacto: {
      type: String,
      required: [true, "El correo de contacto es obligatorio."],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El correo de contacto no tiene un formato válido."
      ]
    },

    telefonos: [
      {
        type: String,
        trim: true
      }
    ],

    estado: {
      type: String,
      enum: ["ACTIVO", "INACTIVO", "SUSPENDIDO"],
      default: "ACTIVO"
    },

    tipos_entrega: [
      {
        type: String,
        enum: [
          "RETIRO_EN_LOCAL",
          "EXPRESS",
          "ENTREGA_PROPIA"
        ]
      }
    ]
  },
  {
    collection: "Restaurantes",
    timestamps: true
  }
);

// Índice requerido para búsquedas geográficas.
restauranteSchema.index({
  ubicacion: "2dsphere"
});

module.exports = mongoose.model(
  "Restaurante",
  restauranteSchema
);