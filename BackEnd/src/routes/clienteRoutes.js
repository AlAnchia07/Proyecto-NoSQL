const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post("/:id_cliente/favoritos/:id_restaurante",clienteController.agregarFavorito);
router.delete("/:id_cliente/favoritos/:id_restaurante",clienteController.eliminarFavorito);
router.get("/:id/favoritos/cliente", clienteController.obtenerFavoritos);

module.exports = router;