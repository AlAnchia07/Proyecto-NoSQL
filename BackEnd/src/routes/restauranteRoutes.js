const express = require("express");

const router = express.Router();

const restauranteController = require(
  "../controllers/restauranteController"
);

router.post(
  "/",
  restauranteController.crearRestaurante
);

router.get(
  "/",
  restauranteController.obtenerRestaurantes
);

router.get(
  "/usuario/:idUsuario",
  restauranteController.obtenerRestaurantesPorUsuario
);

router.get(
  "/:id",
  restauranteController.obtenerRestaurantePorId
);

router.put(
  "/:id",
  restauranteController.editarRestaurante
);

module.exports = router;