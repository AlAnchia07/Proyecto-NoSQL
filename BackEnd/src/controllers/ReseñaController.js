const reseñaService = require("../services/ReseñaService");

class ReseñaController {

    async createReseña(req, res) {
        try {
            const reseña = await reseñaService.createCalificacion(req.body);
            res.status(201).json(reseña);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createReseña(req, res) {
        try {
            const reseña = await reseñaService.createReseña(req.body);
            res.status(201).json(reseña);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateReseña(req, res) {
        try {
            const reseña = await reseñaService.updateReseña(
                req.params.id,
                req.body
            );

            if (!reseña) {
                return res.status(404).json({
                    confirmacion: false,
                    error: "Reseña no encontrada"
                });
            }

            res.status(200).json({confirmacion: true});

        } catch (err) {
            console.error("ERROR UPDATE RESEÑA:", err);
            res.status(500).json({ error: err.message });
        }
    }


    async deleteReseña(req, res) {
        try {
            const reseña = await reseñaService.deleteReseña(req.params.id);

            if (!reseña) {
                return res.status(404).json({
                    confirmacion: false,
                    error: "Reseña no encontrada"
                });
            }

            res.status(200).json({
                confirmacion: true,
                message: "Reseña eliminada correctamente"
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async restauranteReseñas(req, res) {
        try {
            const reseñas = await reseñaService.restauranteReseñas(
                req.params.id
            );

            res.status(200).json(reseñas);

        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }
    }


    async resumenReseñas(req, res) {
        try {
            const resumen = await reseñaService.resumenReseñas(
                req.params.id
            );

            res.status(200).json(resumen);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async filtrarReseñasCliente(req, res) {
        try {
            const reseñas = await reseñaService.filtrarReseñasCliente(
                req.params.id
            );

            res.status(200).json(reseñas);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new ReseñaController();


