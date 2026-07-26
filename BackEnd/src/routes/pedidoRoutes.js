const express = require("express");
const router = express.Router();

const pedidoController = require("../controllers/pedidoController");

//Crear pedido
router.post("/", pedidoController.crearPedido);

//Obtener todos los pedidos
router.get("/", pedidoController.obtenerPedidos);

//Obtener historial de un cliente
router.get("/cliente/:idCliente", pedidoController.obtenerPedidosCliente);

//Obtener pedidos de un restaurante
router.get("/restaurante/:idRestaurante", pedidoController.obtenerPedidosRestaurante);

//Obtener un pedido por ID
router.get("/:id", pedidoController.obtenerPedidoPorId);

//Cambiar estado del pedido
router.patch("/:id/estado", pedidoController.cambiarEstadoPedido);

module.exports = router;