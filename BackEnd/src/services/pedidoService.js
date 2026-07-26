const mongoose = require("mongoose");
const Pedido = require("../models/pedidoModel");

const TIPOS_ENTREGA = ["RETIRO_EN_LOCAL", "EXPRESS"];
const METODOS_PAGO = ["TARJETA", "SINPE", "EFECTIVO"];

const COSTO_ENTREGA_EXPRESS = 1500;

// Crear un nuevo pedido
const crearPedido = async (datosPedido) => {
  const {
    id_cliente,
    id_restaurante,
    productos_comprados,
    descuento = 0,
    tipo_entrega,
    metodo_pago
  } = datosPedido;

  if (!mongoose.Types.ObjectId.isValid(id_cliente)) {
    throw new Error("El identificador del cliente no es válido.");
  }

  if (!mongoose.Types.ObjectId.isValid(id_restaurante)) {
    throw new Error("El identificador del restaurante no es válido.");
  }

  if (
    !Array.isArray(productos_comprados) ||
    productos_comprados.length === 0
  ) {
    throw new Error(
      "El pedido debe contener al menos un producto."
    );
  }

  if (!TIPOS_ENTREGA.includes(tipo_entrega)) {
    throw new Error("El tipo de entrega indicado no es válido.");
  }

  if (!METODOS_PAGO.includes(metodo_pago)) {
    throw new Error("El método de pago indicado no es válido.");
  }

  const productosCalculados = productos_comprados.map(
    (producto) => {
      if (!mongoose.Types.ObjectId.isValid(producto.id_producto)) {
        throw new Error(
          `El producto "${producto.nombre}" tiene un identificador inválido.`
        );
      }

      const cantidad = Number(producto.cantidad);
      const precioUnitario = Number(producto.precio_unitario);

      if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw new Error(
          `La cantidad del producto "${producto.nombre}" no es válida.`
        );
      }

      if (
        !Number.isFinite(precioUnitario) ||
        precioUnitario < 0
      ) {
        throw new Error(
          `El precio del producto "${producto.nombre}" no es válido.`
        );
      }

      const subtotalProducto = cantidad * precioUnitario;

      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: subtotalProducto
      };
    }
  );

  const subtotal = productosCalculados.reduce(
    (acumulado, producto) =>
      acumulado + producto.subtotal,
    0
  );

  const descuentoNumerico = Number(descuento);

  if (
    !Number.isFinite(descuentoNumerico) ||
    descuentoNumerico < 0
  ) {
    throw new Error("El descuento no puede ser negativo.");
  }

  if (descuentoNumerico > subtotal) {
    throw new Error(
      "El descuento no puede ser mayor que el subtotal del pedido."
    );
  }

  const costoEntrega =
    tipo_entrega === "EXPRESS"
      ? COSTO_ENTREGA_EXPRESS
      : 0;

  const total =
    subtotal - descuentoNumerico + costoEntrega;

  const nuevoPedido = new Pedido({
    id_cliente,
    id_restaurante,
    productos_comprados: productosCalculados,
    subtotal,
    descuento: descuentoNumerico,
    costo_entrega: costoEntrega,
    total,
    tipo_entrega,
    metodo_pago,
    estado_pago: "PAGADO",
    estado: "PENDIENTE"
  });

  return await nuevoPedido.save();
};

// Leer todos los pedidos
const obtenerPedidos = async () => {
  return await Pedido.find()
    .populate("id_cliente")
    .populate("id_restaurante")
    .sort({ fecha_hora: -1 });
};

// Obtener pedido por ID
const obtenerPedidoPorId = async (idPedido) => {
  if (!mongoose.Types.ObjectId.isValid(idPedido)) {
    throw new Error("El identificador del pedido no es válido.");
  }

  const pedido = await Pedido.findById(idPedido)
    .populate("id_cliente")
    .populate("id_restaurante");

  if (!pedido) {
    throw new Error("Pedido no encontrado.");
  }

  return pedido;
};

// Obtener historial de un cliente
const obtenerPedidosPorCliente = async (idCliente) => {
  if (!mongoose.Types.ObjectId.isValid(idCliente)) {
    throw new Error("El identificador del cliente no es válido.");
  }

  return await Pedido.find({
    id_cliente: idCliente
  })
    .populate("id_restaurante")
    .sort({ fecha_hora: -1 });
};

// Obtener pedidos de un restaurante
const obtenerPedidosPorRestaurante = async (
  idRestaurante
) => {
  if (!mongoose.Types.ObjectId.isValid(idRestaurante)) {
    throw new Error(
      "El identificador del restaurante no es válido."
    );
  }

  return await Pedido.find({
    id_restaurante: idRestaurante
  })
    .populate("id_cliente")
    .sort({ fecha_hora: -1 });
};

// Cambiar estado
const cambiarEstadoPedido = async (
  idPedido,
  nuevoEstado
) => {
  const estadosPermitidos = [
    "PENDIENTE",
    "PREPARANDO",
    "LISTO_PARA_RETIRAR",
    "ENTREGADO",
    "CANCELADO"
  ];

  if (!mongoose.Types.ObjectId.isValid(idPedido)) {
    throw new Error("El identificador del pedido no es válido.");
  }

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error("El estado indicado no es válido.");
  }

  const pedidoActualizado =
    await Pedido.findByIdAndUpdate(
      idPedido,
      {
        estado: nuevoEstado
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!pedidoActualizado) {
    throw new Error("Pedido no encontrado.");
  }

  return pedidoActualizado;
};

module.exports = {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  obtenerPedidosPorCliente,
  obtenerPedidosPorRestaurante,
  cambiarEstadoPedido
};