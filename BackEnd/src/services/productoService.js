const mongoose = require("mongoose");

const Producto = require("../models/Producto");
const Restaurante = require("../models/Restaurante");
const Categoria = require("../models/Categoria");

const validarObjectId = (id, nombreCampo) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${nombreCampo} no es válido.`);
  }
};

const validarRestaurante = async (idRestaurante) => {
  validarObjectId(idRestaurante, "El ID del restaurante");

  const restaurante = await Restaurante.findById(idRestaurante);

  if (!restaurante) {
    throw new Error("El restaurante indicado no existe.");
  }

  if (restaurante.estado !== "ACTIVO") {
    throw new Error("El restaurante no se encuentra activo.");
  }

  return restaurante;
};

const validarCategoriaProducto = async (idCategoria) => {
  validarObjectId(idCategoria, "El ID de categoría");

  const categoria = await Categoria.findById(idCategoria);

  if (!categoria) {
    throw new Error("La categoría indicada no existe.");
  }

  if (categoria.tipo !== "PRODUCTO") {
    throw new Error(
      "La categoría seleccionada no corresponde a productos."
    );
  }

  if (categoria.estado !== "ACTIVA") {
    throw new Error("La categoría seleccionada está inactiva.");
  }

  return categoria;
};

const validarPrecios = (precioOriginal, precioDescuento) => {
  if (
    precioOriginal !== undefined &&
    precioDescuento !== undefined &&
    Number(precioDescuento) > Number(precioOriginal)
  ) {
    throw new Error(
      "El precio con descuento no puede ser mayor al precio original."
    );
  }
};

const crearProducto = async (datosProducto) => {
  const {
    id_restaurante,
    id_categoria,
    nombre,
    descripcion,
    precio_original,
    precio_descuento,
    cantidad_disponible,
    url_imagen,
    fecha_disponibilidad,
    fecha_vencimiento
  } = datosProducto;

  await validarRestaurante(id_restaurante);
  await validarCategoriaProducto(id_categoria);

  validarPrecios(precio_original, precio_descuento);

  if (
    fecha_disponibilidad &&
    fecha_vencimiento &&
    new Date(fecha_vencimiento) <= new Date(fecha_disponibilidad)
  ) {
    throw new Error(
      "La fecha de vencimiento debe ser posterior a la fecha de disponibilidad."
    );
  }

  const productoExistente = await Producto.findOne({
    id_restaurante,
    nombre: {
      $regex: new RegExp(`^${nombre}$`, "i")
    },
    estado: {
      $ne: "INACTIVO"
    }
  });

  if (productoExistente) {
    throw new Error(
      "Ya existe un producto activo con ese nombre en el restaurante."
    );
  }

  const nuevoProducto = new Producto({
    id_restaurante,
    id_categoria,
    nombre,
    descripcion,
    precio_original,
    precio_descuento,
    cantidad_disponible,
    url_imagen,
    fecha_disponibilidad,
    fecha_vencimiento,
    estado:
      Number(cantidad_disponible) === 0
        ? "AGOTADO"
        : "ACTIVO"
  });

  return await nuevoProducto.save();
};

const obtenerProductos = async () => {
  return await Producto.find({
    estado: {
      $ne: "INACTIVO"
    }
  })
    .populate("id_restaurante", "nombre estado")
    .populate("id_categoria", "nombre tipo estado")
    .sort({
      createdAt: -1
    });
};

const obtenerProductoPorId = async (idProducto) => {
  validarObjectId(idProducto, "El ID del producto");

  const producto = await Producto.findById(idProducto)
    .populate("id_restaurante", "nombre estado")
    .populate("id_categoria", "nombre tipo estado");

  if (!producto) {
    throw new Error("Producto no encontrado.");
  }

  return producto;
};

const obtenerProductosPorRestaurante = async (
  idRestaurante,
  incluirInactivos = false
) => {
  await validarRestaurante(
    idRestaurante
  );

  const filtro = {
    id_restaurante:
      idRestaurante
  };

  if (!incluirInactivos) {
    //Vista del cliente: solamente productos activos y con stock disponible
    filtro.estado = "ACTIVO";

    filtro.cantidad_disponible = {
      $gt: 0
    };
  } else {
    //Vista administrativa: muestra ACTIVO y AGOTADO, pero no productos eliminados logicamente
    filtro.estado = {
      $ne: "INACTIVO"
    };
  }

  return await Producto.find(
    filtro
  )
    .populate(
      "id_categoria",
      "nombre tipo estado"
    )
    .sort({
      createdAt: -1
    });
};


const editarProducto = async (
  idProducto,
  datosProducto
) => {
  validarObjectId(idProducto, "El ID del producto");

  const productoActual = await Producto.findById(idProducto);

  if (!productoActual) {
    throw new Error("Producto no encontrado.");
  }

  if (productoActual.estado === "INACTIVO") {
    throw new Error(
      "No se puede editar un producto que se encuentra inactivo."
    );
  }

  if (datosProducto.id_restaurante) {
    await validarRestaurante(datosProducto.id_restaurante);
  }

  if (datosProducto.id_categoria) {
    await validarCategoriaProducto(datosProducto.id_categoria);
  }

  const precioOriginal =
    datosProducto.precio_original !== undefined
      ? datosProducto.precio_original
      : productoActual.precio_original;

  const precioDescuento =
    datosProducto.precio_descuento !== undefined
      ? datosProducto.precio_descuento
      : productoActual.precio_descuento;

  validarPrecios(precioOriginal, precioDescuento);

  const fechaDisponibilidad =
    datosProducto.fecha_disponibilidad ||
    productoActual.fecha_disponibilidad;

  const fechaVencimiento =
    datosProducto.fecha_vencimiento ||
    productoActual.fecha_vencimiento;

  if (
    new Date(fechaVencimiento) <= new Date(fechaDisponibilidad)
  ) {
    throw new Error(
      "La fecha de vencimiento debe ser posterior a la fecha de disponibilidad."
    );
  }

  const camposPermitidos = [
    "id_categoria",
    "nombre",
    "descripcion",
    "precio_original",
    "precio_descuento",
    "cantidad_disponible",
    "url_imagen",
    "fecha_disponibilidad",
    "fecha_vencimiento"
  ];

  const datosActualizados = {};

  camposPermitidos.forEach((campo) => {
    if (
      Object.prototype.hasOwnProperty.call(
        datosProducto,
        campo
      )
    ) {
      datosActualizados[campo] =
        datosProducto[campo];
    }
  });

  if (
    Object.prototype.hasOwnProperty.call(
      datosProducto,
      "cantidad_disponible"
    )
  ) {
    datosActualizados.estado =
      Number(datosProducto.cantidad_disponible) === 0
        ? "AGOTADO"
        : "ACTIVO";
  }

  const productoActualizado =
    await Producto.findByIdAndUpdate(
      idProducto,
      datosActualizados,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("id_restaurante", "nombre estado")
      .populate("id_categoria", "nombre tipo estado");

  return productoActualizado;
};

const eliminarProductoLogicamente = async (
  idProducto
) => {
  validarObjectId(idProducto, "El ID del producto");

  const producto = await Producto.findById(idProducto);

  if (!producto) {
    throw new Error("Producto no encontrado.");
  }

  if (producto.estado === "INACTIVO") {
    throw new Error(
      "El producto ya se encuentra inactivo."
    );
  }

  producto.estado = "INACTIVO";
  producto.cantidad_disponible = 0;

  await producto.save();

  return producto;
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosPorRestaurante,
  editarProducto,
  eliminarProductoLogicamente
};