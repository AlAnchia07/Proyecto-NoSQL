const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/NotificacionController');
const reseña = require('../models/Notificacion');

router.put("/notificacion/leida/:id", notificacionController.marcarLeida);
router.get("/notificacion/usuario/:id", notificacionController.traerNotificaciones);
router.get("/notificacion/contador/:id", notificacionController.contarNoLeidas);

module.exports = router;