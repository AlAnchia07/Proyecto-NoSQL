const pedidoService = require("../services/pedidoService");

//Crear pedido
const crearPedido = async (req, res) => {
    try {
        const pedido = await pedidoService.crearPedido(req.body);

        res.status(201).json(pedido);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

//Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.obtenerPedidos();

        res.json(pedidos);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

//Obtener pedido por id
const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await pedidoService.obtenerPedidoPorId(req.params.id);

        res.json(pedido);

    } catch (error) {
        res.status(404).json({
            mensaje: error.message
        });
    }
};

//Obtener pedidos de un cliente
const obtenerPedidosCliente = async (req, res) => {
    try {
        const pedidos = await pedidoService.obtenerPedidosPorCliente(req.params.idCliente);

        res.json(pedidos);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

//Obtener pedidos de un restaurante
const obtenerPedidosRestaurante = async (req, res) => {
    try {
        const pedidos = await pedidoService.obtenerPedidosPorRestaurante(req.params.idRestaurante);

        res.json(pedidos);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

//Cambiar estado del pedido
const cambiarEstadoPedido = async (req, res) => {
    try {

        const pedido = await pedidoService.cambiarEstadoPedido(
            req.params.id,
            req.body.estado
        );

        res.json(pedido);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    obtenerPedidosCliente,
    obtenerPedidosRestaurante,
    cambiarEstadoPedido
};