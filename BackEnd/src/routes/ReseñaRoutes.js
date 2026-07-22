const express = require('express');
const router = express.Router();
const reseñaController = require('../controllers/ReseñaController');
const reseña = require('../models/Reseña');

router.post("/resena", reseñaController.createReseña);
router.put("/resena/:id", reseñaController.updateReseña);
router.delete("/resena/:id", reseñaController.deleteReseña);
router.get("/resenas/restaurante/:id",reseñaController.restauranteReseñas);
router.get("/resenas/resumen/:id", reseñaController.resumenReseñas);
router.get("/resenas/cliente/:id", reseñaController.filtrarReseñasCliente);

module.exports = router;