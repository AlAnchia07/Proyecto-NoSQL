const mongoose = require("mongoose");

const Pedido = require("../models/pedidoModel");
const Producto = require("../models/Producto");
const NotificacionService = require("./NotificacionService");
const Cliente = require("../models/Cliente");
const Restaurante = require("../models/Restaurante");

const TIPOS_ENTREGA = [
  "RETIRO_EN_LOCAL",
  "EXPRESS"
];

const METODOS_PAGO = [
  "TARJETA",
  "SINPE",
  "EFECTIVO"
];

//Este bloque es para armar los mensajes de las notificaciones segun el estado
const mensajesEstado = {
    PENDIENTE: ` se ha puesto como pendiente`,
    PREPARANDO: ` está siendo preparado`,
    LISTO_PARA_RETIRAR: ` está listo para retirar`,
    ENTREGADO: ` ha sido entregado`,
    CANCELADO: ` ha sido cancelado`
};

const COSTO_ENTREGA_EXPRESS = 1500;


const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado"
];

const obtenerFechaHoraCostaRica = () => {
  const partes = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "America/Costa_Rica",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
  ).formatToParts(new Date());

  const obtenerParte = (tipo) =>
    partes.find(
      (parte) => parte.type === tipo
    )?.value;

  const dias = {
    Sunday: "domingo",
    Monday: "lunes",
    Tuesday: "martes",
    Wednesday: "miercoles",
    Thursday: "jueves",
    Friday: "viernes",
    Saturday: "sabado"
  };

  return {
    dia: dias[obtenerParte("weekday")],
    hora: `${obtenerParte("hour")}:${obtenerParte("minute")}`
  };
};

const validarRestauranteAbierto = (
  restaurante
) => {
  if (restaurante.estado !== "ACTIVO") {
    throw new Error(
      "El restaurante no se encuentra activo."
    );
  }

  const { dia, hora } =
    obtenerFechaHoraCostaRica();

  const horarioHoy =
    restaurante.horario?.[dia];

  if (
    !horarioHoy?.apertura ||
    !horarioHoy?.cierre
  ) {
    throw new Error(
      "El restaurante se encuentra cerrado en este momento."
    );
  }

  const apertura = horarioHoy.apertura;
  const cierre = horarioHoy.cierre;

  if (
    hora < apertura ||
    hora >= cierre
  ) {
    throw new Error(
      "El restaurante se encuentra cerrado en este momento."
    );
  }
};

//Crear un nuevo pedido
const crearPedido = async (datosPedido) => {
  const {
    id_cliente,
    id_restaurante,
    productos_comprados,
    descuento = 0,
    tipo_entrega,
    metodo_pago
  } = datosPedido;

  if (
    !mongoose.Types.ObjectId.isValid(
      id_cliente
    )
  ) {
    throw new Error(
      "El identificador del cliente no es válido."
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      id_restaurante
    )
  ) {
    throw new Error(
      "El identificador del restaurante no es válido."
    );
  }

  if (
    !Array.isArray(productos_comprados) ||
    productos_comprados.length === 0
  ) {
    throw new Error(
      "El pedido debe contener al menos un producto."
    );
  }

  if (
    !TIPOS_ENTREGA.includes(
      tipo_entrega
    )
  ) {
    throw new Error(
      "El tipo de entrega indicado no es válido."
    );
  }

  if (
    !METODOS_PAGO.includes(
      metodo_pago
    )
  ) {
    throw new Error(
      "El método de pago indicado no es válido."
    );
  }

  const descuentoNumerico =
    Number(descuento);

  if (
    !Number.isFinite(
      descuentoNumerico
    ) ||
    descuentoNumerico < 0
  ) {
    throw new Error(
      "El descuento no puede ser negativo."
    );
  }

  const restaurante =
      await Restaurante.findById(
        id_restaurante
      );

    if (!restaurante) {
      throw new Error(
        "El restaurante no fue encontrado."
      );
    }

    validarRestauranteAbierto(
      restaurante
    );

    if (
      !restaurante.tipos_entrega.includes(
        tipo_entrega
      )
    ) {
      throw new Error(
        "El restaurante no ofrece el tipo de entrega seleccionado."
      );
    }


  const session =
    await mongoose.startSession();

  try {
    let pedidoCreado = null;

    await session.withTransaction(
      async () => {
        const productosCalculados = [];

        for (
          const productoPedido
          of productos_comprados
        ) {
          if (
            !mongoose.Types.ObjectId.isValid(
              productoPedido.id_producto
            )
          ) {
            throw new Error(
              "Uno de los productos tiene un identificador inválido."
            );
          }

          const cantidad = Number(
            productoPedido.cantidad
          );

          if (
            !Number.isInteger(cantidad) ||
            cantidad < 1
          ) {
            throw new Error(
              `La cantidad del producto "${productoPedido.nombre}" no es válida.`
            );
          }
          const productoActualizado =
            await Producto.findOneAndUpdate(
              {
                _id:
                  productoPedido.id_producto,

                id_restaurante:
                  id_restaurante,

                estado: "ACTIVO",

                cantidad_disponible: {
                  $gte: cantidad
                }
              },
              {
                $inc: {
                  cantidad_disponible:
                    -cantidad
                }
              },
              {
                new: true,
                session
              }
            );

          if (!productoActualizado) {

            const productoExistente =
              await Producto.findById(
                productoPedido.id_producto
              ).session(session);

            if (!productoExistente) {
              throw new Error(
                `El producto "${productoPedido.nombre}" ya no existe.`
              );
            }

            if (
              productoExistente.id_restaurante.toString() !==
              id_restaurante.toString()
            ) {
              throw new Error(
                `El producto "${productoExistente.nombre}" no pertenece a este restaurante.`
              );
            }

            if (
              productoExistente.estado !==
              "ACTIVO"
            ) {
              throw new Error(
                `El producto "${productoExistente.nombre}" ya no se encuentra disponible.`
              );
            }

            if (
              productoExistente
                .cantidad_disponible <
              cantidad
            ) {
              throw new Error(
                `No hay suficiente stock de "${productoExistente.nombre}". Solo quedan ${productoExistente.cantidad_disponible}.`
              );
            }

            throw new Error(
              `No fue posible procesar el producto "${productoPedido.nombre}".`
            );
          }
          if (
            productoActualizado
              .cantidad_disponible === 0
          ) {
            productoActualizado.estado =
              "AGOTADO";

            await productoActualizado.save({
              session
            });
          }
          const precioUnitario = Number(
            productoActualizado
              .precio_descuento
          );

          const subtotalProducto =
            cantidad * precioUnitario;

          productosCalculados.push({
            id_producto:
              productoActualizado._id,

            nombre:
              productoActualizado.nombre,

            cantidad,

            precio_unitario:
              precioUnitario,

            subtotal:
              subtotalProducto
          });
        }

        const subtotal =
          productosCalculados.reduce(
            (
              acumulado,
              producto
            ) =>
              acumulado +
              producto.subtotal,
            0
          );

        if (
          descuentoNumerico >
          subtotal
        ) {
          throw new Error(
            "El descuento no puede ser mayor que el subtotal del pedido."
          );
        }

        const costoEntrega =
          tipo_entrega === "EXPRESS"
            ? COSTO_ENTREGA_EXPRESS
            : 0;

        const total =
          subtotal -
          descuentoNumerico +
          costoEntrega;

        const nuevoPedido =
          new Pedido({
            id_cliente,
            id_restaurante,
            productos_comprados:
              productosCalculados,

            subtotal,

            descuento:
              descuentoNumerico,

            costo_entrega:
              costoEntrega,

            total,

            tipo_entrega,

            metodo_pago,

            estado_pago: "PAGADO",

            estado: "PENDIENTE"
          });

        pedidoCreado =
          await nuevoPedido.save({
            session
          });

        //Aqui se crearia las notificaciones 
        const clienteEncontrado = await Cliente.findById(id_cliente);

        if (!clienteEncontrado) {
          throw new Error("El cliente no fue encontrado");
        }

        const restauranteEncontrado = await Restaurante.findById(id_restaurante);

        if(!restauranteEncontrado){
          throw new Error("El restaurante no fue encontrado")
        }
        
        //Primero se crea la que recibe el cliente
        await NotificacionService.createNotificacion({
          id_usuario: clienteEncontrado.id_usuario,
          mensaje: `El restaurante ${restauranteEncontrado.nombre} ha recibido tu pedido`,
          tipo: "PEDIDO_ENVIADO"
        });

        //Luego se crea la que recibe el restaurante
        await NotificacionService.createNotificacion({
          id_usuario: restauranteEncontrado.id_usuario,
          mensaje: `Un cliente ha hecho un pedido a tu restaurante ${restauranteEncontrado.nombre}`,
          tipo: "PEDIDO_RECIBIDO"
        })
      }
    );

    return pedidoCreado;
  } finally {
    await session.endSession();
  }
};

//Leer todos los pedidos
const obtenerPedidos = async () => {
  return await Pedido.find()
    .populate("id_cliente")
    .populate("id_restaurante")
    .sort({
      fecha_hora: -1
    });
};

//Obtener pedido por ID
const obtenerPedidoPorId = async (
  idPedido
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      idPedido
    )
  ) {
    throw new Error(
      "El identificador del pedido no es válido."
    );
  }

  const pedido =
    await Pedido.findById(idPedido)
      .populate("id_cliente")
      .populate("id_restaurante");

  if (!pedido) {
    throw new Error(
      "Pedido no encontrado."
    );
  }

  return pedido;
};

//Obtener historial de un cliente
const obtenerPedidosPorCliente = async (
  idCliente
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      idCliente
    )
  ) {
    throw new Error(
      "El identificador del cliente no es válido."
    );
  }

  return await Pedido.find({
    id_cliente: idCliente
  })
    .populate("id_restaurante")
    .sort({
      fecha_hora: -1
    });
};

//Obtener pedidos de un restaurante
const obtenerPedidosPorRestaurante =
  async (idRestaurante) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        idRestaurante
      )
    ) {
      throw new Error(
        "El identificador del restaurante no es válido."
      );
    }

    return await Pedido.find({
      id_restaurante:
        idRestaurante
    })
      .populate("id_cliente")
      .sort({
        fecha_hora: -1
      });
  };

//Cambiar estado
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
    throw new Error(
      "El identificador del pedido no es válido."
    );
  }

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(
      "El estado indicado no es válido."
    );
  }

  const session = await mongoose.startSession();

  try {
    let pedidoActualizado = null;

    await session.withTransaction(async () => {
      const pedido = await Pedido.findById(
        idPedido
      ).session(session);

      if (!pedido) {
        throw new Error(
          "Pedido no encontrado."
        );
      }

      // Un pedido cancelado no puede volver a otro estado
      if (pedido.estado === "CANCELADO") {
        throw new Error(
          "Un pedido cancelado no puede cambiar de estado."
        );
      }

      // Un pedido entregado tampoco debería modificarse
      if (pedido.estado === "ENTREGADO") {
        throw new Error(
          "Un pedido entregado no puede cambiar de estado."
        );
      }

      // Si ya está en ese mismo estado, no hacemos nada
      if (pedido.estado === nuevoEstado) {
        pedidoActualizado = pedido;
        return;
      }

      // Si se cancela, devolvemos el stock
      if (nuevoEstado === "CANCELADO") {
        for (
          const productoPedido
          of pedido.productos_comprados
        ) {
          const producto =
            await Producto.findById(
              productoPedido.id_producto
            ).session(session);

          if (!producto) {
            continue;
          }

          producto.cantidad_disponible +=
            productoPedido.cantidad;

          // Si estaba agotado y ahora tiene stock,
          // vuelve a estar activo
          if (
            producto.estado === "AGOTADO" &&
            producto.cantidad_disponible > 0
          ) {
            producto.estado = "ACTIVO";
          }

          await producto.save({
            session
          });
        }
      }

      pedido.estado = nuevoEstado;

      pedidoActualizado =
        await pedido.save({
          session
        });

      //En esta seccion se va a crear una nueva notificacion según el nuevo estado del pedido
      const clienteEncontrado = await Cliente.findById(pedido.id_cliente);
      const restauranteEncontrado = await Restaurante.findById(pedido.id_restaurante);

      if (!clienteEncontrado) {
          throw new Error("Cliente no encontrado");
      }

      if (!restauranteEncontrado) {
        throw new Error("Restaurante no encontrado");
      }

      const idUsuario = clienteEncontrado.id_usuario;
      const mensaje = mensajesEstado[nuevoEstado];

      await NotificacionService.createNotificacion({
        id_usuario: idUsuario,
        mensaje: `Tu pedido al restaurante ${restauranteEncontrado.nombre} ${mensaje}`,
        tipo: nuevoEstado
      })
      
    });

    return pedidoActualizado;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  obtenerPedidosPorCliente,
  obtenerPedidosPorRestaurante,
  cambiarEstadoPedido
};