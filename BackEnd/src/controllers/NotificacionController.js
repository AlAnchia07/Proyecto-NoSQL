const notificacionService = require("../services/NotificacionService")

class NotificacionController {
    
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


    async contarNoLeidas(req, res) {
    try {
        const cantidad = await notificacionService.contarNoLeidas(
            req.params.id
        );

        res.status(200).json({
            cantidad
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}
}

module.exports = new NotificacionController();