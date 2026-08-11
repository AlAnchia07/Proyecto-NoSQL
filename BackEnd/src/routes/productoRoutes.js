const express = require("express");

const router = express.Router();

const productoController = require(
  "../controllers/productoController"
);

router.post(
  "/",
  productoController.crearProducto
);

router.get(
  "/",
  productoController.obtenerProductos
);

router.get(
  "/restaurante/:idRestaurante",
  productoController.obtenerProductosPorRestaurante
);

router.get(
  "/:id",
  productoController.obtenerProductoPorId
);

router.put(
  "/:id",
  productoController.editarProducto
);

router.patch(
  "/:id/desactivar",
  productoController.eliminarProductoLogicamente
);

router.patch(
  "/:id/reactivar",
  productoController.reactivarProducto
);

module.exports = router;