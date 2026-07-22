const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/NotificacionController');
const reseña = require('../models/Notificacion');

router.post("/notificacion", notificacionController.createNotificacion);
router.put("/notificacion/leida/:id", notificacionController.marcarLeida);
router.get("/notificacion/usuario/:id", notificacionController.traerNotificaciones);

module.exports = router;