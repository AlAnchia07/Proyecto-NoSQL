const express = require("express");

const router = express.Router();

const restauranteController = require(
  "../controllers/restauranteController"
);

// Crear restaurante
router.post(
  "/",
  restauranteController.crearRestaurante
);

// Listar restaurantes
router.get(
  "/",
  restauranteController.obtenerRestaurantes
);

// Consultar restaurante por usuario
router.get(
  "/usuario/:idUsuario",
  restauranteController.obtenerRestaurantePorUsuario
);

// Consultar restaurante por ID
router.get(
  "/:id",
  restauranteController.obtenerRestaurantePorId
);

// Editar restaurante
router.put(
  "/:id",
  restauranteController.editarRestaurante
);

module.exports = router;