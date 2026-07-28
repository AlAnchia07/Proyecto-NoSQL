const mongoose = require("mongoose");

const Restaurante = require("../models/Restaurante");
const Usuario = require("../models/Usuario");
const Categoria = require("../models/Categoria");

const validarObjectId = (id, nombreCampo) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${nombreCampo} no es válido.`);
  }
};

const validarCategoriaRestaurante = async (idCategoria) => {
  validarObjectId(idCategoria, "El ID de categoría");

  const categoria = await Categoria.findById(idCategoria);

  if (!categoria) {
    throw new Error("La categoría indicada no existe.");
  }

  if (categoria.tipo !== "RESTAURANTE") {
    throw new Error(
      "La categoría seleccionada no corresponde a un restaurante."
    );
  }

  if (categoria.estado !== "ACTIVA") {
    throw new Error("La categoría seleccionada está inactiva.");
  }

  return categoria;
};

const validarUsuarioRestaurante = async (idUsuario) => {
  validarObjectId(idUsuario, "El ID de usuario");

  const usuario = await Usuario.findById(idUsuario);

  if (!usuario) {
    throw new Error("El usuario indicado no existe.");
  }

  if (usuario.tipo_usuario !== "RESTAURANTE") {
    throw new Error(
      "El usuario indicado no pertenece al tipo RESTAURANTE."
    );
  }

  return usuario;
};

// Crear restaurante
const crearRestaurante = async (datosRestaurante) => {
  const {
    id_usuario,
    id_categoria,
    nombre,
    direccion,
    ubicacion,
    url_imagen,
    horario,
    correo_contacto,
    telefonos,
    tipos_entrega
  } = datosRestaurante;

  await validarUsuarioRestaurante(id_usuario);
  await validarCategoriaRestaurante(id_categoria);

  const nuevoRestaurante = new Restaurante({
    id_usuario,
    id_categoria,
    nombre,
    direccion,
    ubicacion,
    url_imagen,
    horario,
    correo_contacto,
    telefonos,
    tipos_entrega
  });

  return await nuevoRestaurante.save();
};

// Listar restaurantes
const obtenerRestaurantes = async () => {
  return await Restaurante.find()
    .populate("id_categoria", "nombre tipo estado")
    .populate("id_usuario", "correo_registro tipo_usuario")
    .sort({
      createdAt: -1
    });
};

// Consultar restaurante por ID
const obtenerRestaurantePorId = async (idRestaurante) => {
  validarObjectId(idRestaurante, "El ID del restaurante");

  const restaurante = await Restaurante.findById(idRestaurante)
    .populate("id_categoria", "nombre tipo estado")
    .populate("id_usuario", "correo_registro tipo_usuario");

  if (!restaurante) {
    throw new Error("Restaurante no encontrado.");
  }

  return restaurante;
};

// Consultar restaurante por usuario
const obtenerRestaurantesPorUsuario = async (idUsuario) => {
  validarObjectId(idUsuario, "El ID de usuario");

  const usuario = await Usuario.findById(idUsuario);

  if (!usuario) {
    throw new Error("El usuario indicado no existe.");
  }

  if (usuario.tipo_usuario !== "RESTAURANTE") {
    throw new Error(
      "El usuario indicado no administra restaurantes."
    );
  }

  return await Restaurante.find({
    id_usuario: idUsuario
  })
    .populate("id_categoria", "nombre tipo estado")
    .sort({
      createdAt: -1
    });
};

// Editar restaurante
const editarRestaurante = async (
  idRestaurante,
  datosRestaurante
) => {
  validarObjectId(idRestaurante, "El ID del restaurante");

  const restauranteActual = await Restaurante.findById(
    idRestaurante
  );

  if (!restauranteActual) {
    throw new Error("Restaurante no encontrado.");
  }

  // El usuario propietario no se cambia desde esta operación.
  if (Object.prototype.hasOwnProperty.call(
    datosRestaurante,
    "id_usuario"
  )) {
    delete datosRestaurante.id_usuario;
  }

  if (datosRestaurante.id_categoria) {
    await validarCategoriaRestaurante(
      datosRestaurante.id_categoria
    );
  }

  const camposPermitidos = [
    "id_categoria",
    "nombre",
    "direccion",
    "ubicacion",
    "url_imagen",
    "horario",
    "correo_contacto",
    "telefonos",
    "estado",
    "tipos_entrega"
  ];

  const datosActualizados = {};

  camposPermitidos.forEach((campo) => {
    if (
      Object.prototype.hasOwnProperty.call(
        datosRestaurante,
        campo
      )
    ) {
      datosActualizados[campo] =
        datosRestaurante[campo];
    }
  });

  const restauranteActualizado =
    await Restaurante.findByIdAndUpdate(
      idRestaurante,
      datosActualizados,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("id_categoria", "nombre tipo estado")
      .populate(
        "id_usuario",
        "correo_registro tipo_usuario"
      );

  return restauranteActualizado;
};

module.exports = {
  crearRestaurante,
  obtenerRestaurantes,
  obtenerRestaurantePorId,
  obtenerRestaurantesPorUsuario,
  editarRestaurante
};