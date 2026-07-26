const Pedido = require("../models/pedidoModel");

//Nuevo pedido
const crearPedido = async (datosPedido) => {
    const {
        id_cliente,
        id_restaurante,
        productos_comprados,
        descuento = 0,
        tipo_entrega
    } = datosPedido;

    if (!productos_comprados || productos_comprados.length === 0) {
        throw new Error("El pedido debe contener al menos un producto.");
    }

    //Calcular subtotal de cada producto y el subtotal general
    const productosCalculados = productos_comprados.map((producto) => {
        const subtotalProducto =
            producto.cantidad * producto.precio_unitario;

        return {
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario,
            subtotal: subtotalProducto
        };
    });

    const subtotal = productosCalculados.reduce(
        (acumulado, producto) => acumulado + producto.subtotal,
        0
    );

    if (descuento < 0) {
        throw new Error("El descuento no puede ser negativo.");
    }

    if (descuento > subtotal) {
        throw new Error(
            "El descuento no puede ser mayor que el subtotal del pedido."
        );
    }

    const total = subtotal - descuento;

    const nuevoPedido = new Pedido({
        id_cliente,
        id_restaurante,
        productos_comprados: productosCalculados,
        subtotal,
        descuento,
        total,
        tipo_entrega
    });

    return await nuevoPedido.save();
};

//Leer todos los pedidos registrados
const obtenerPedidos = async () => {
    return await Pedido.find()
        .sort({ fecha_hora: -1 });
};

//Obtener pedido por id
const obtenerPedidoPorId = async (idPedido) => {
    const pedido = await Pedido.findById(idPedido);

    if (!pedido) {
        throw new Error("Pedido no encontrado.");
    }

    return pedido;
};

//Obtener historial de pedidos de un cliente
const obtenerPedidosPorCliente = async (idCliente) => {
    return await Pedido.find({
        id_cliente: idCliente
    }).sort({ fecha_hora: -1 });
};

//Obtener los pedidos de un restaurante
const obtenerPedidosPorRestaurante = async (idRestaurante) => {
    return await Pedido.find({
        id_restaurante: idRestaurante
    }).sort({ fecha_hora: -1 });
};

//Cambiar estado
const cambiarEstadoPedido = async (idPedido, nuevoEstado) => {
    const estadosPermitidos = [
        "PENDIENTE",
        "PREPARANDO",
        "LISTO_PARA_RETIRAR",
        "ENTREGADO",
        "CANCELADO"
    ];

    if (!estadosPermitidos.includes(nuevoEstado)) {
        throw new Error("El estado indicado no es válido.");
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
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