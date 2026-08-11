const clienteService = require("../services/ClienteService");

class ClienteController {

    async agregarFavorito(req, res) {
        try {
            await clienteService.agregarFavorito(
                req.params.id_cliente,
                req.params.id_restaurante
            );

            res.status(200).json({
                mensaje: "Restaurante agregado a favoritos."
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: err.message
            });
        }
    }

    async eliminarFavorito(req, res) {
        try {
            await clienteService.eliminarFavorito(
                req.params.id_cliente,
                req.params.id_restaurante
            );

            res.status(200).json({
                mensaje: "Restaurante eliminado de favoritos."
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: err.message
            });
        }
    }

    async obtenerFavoritos(req, res) {
        try {
            const resultado = await clienteService.getRestaurantesFavoritos(
                req.params.id,
            );

            return res.status(200).json(resultado.favoritos);

        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: err.message
            });
        }
    }
}

module.exports = new ClienteController();