const express = require("express");
const router = express.Router();

const categoriaController = require(
    "../controllers/categoriaController"
);

// Crear categoría
router.post(
    "/",
    categoriaController.crearCategoria
);

// Obtener todas las categorías activas
router.get(
    "/",
    categoriaController.obtenerCategorias
);

// Obtener categorías por tipo
router.get(
    "/tipo/:tipo",
    categoriaController.obtenerCategoriasPorTipo
);

// Obtener categoría por ID
router.get(
    "/:id",
    categoriaController.obtenerCategoriaPorId
);

module.exports = router;