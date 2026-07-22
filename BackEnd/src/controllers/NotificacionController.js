const notificacionService = require("../services/NotificacionService")

class NotificacionController {
    async createNotificacion(req, res) {
        try {
            const notificacion = await notificacionService.createNotificacion(
                req.body
            );

            res.status(201).json(notificacion);

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }


    async marcarLeida(req, res) {
        try {
            const notificacion = await notificacionService.marcarLeida(
                req.params.id
            );

            if (!notificacion) {
                return res.status(404).json({
                    confirmacion: false,
                    error: "Notificación no encontrada"
                });
            }

            res.status(200).json({
                confirmacion: true,
                message: "Notificación marcada como leída"
            });

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }


    async traerNotificaciones(req, res) {
        try {
            const notificaciones = await notificacionService.traerNotificaciones(
                req.params.id
            );

            res.status(200).json(notificaciones);

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = new NotificacionController();