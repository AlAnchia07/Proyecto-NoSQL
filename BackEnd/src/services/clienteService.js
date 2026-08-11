const cliente = require("../models/Cliente");
const mongoose = require("mongoose");

class ClienteService {
    async eliminarFavorito(id_cliente,id_restaurante){
        await cliente.findByIdAndUpdate(
            id_cliente,
            {
                $pull: {
                    favoritos: id_restaurante
                }
            }

        )
    }

    async agregarFavorito(id_cliente,id_restaurante){
        const resultado = await cliente.findByIdAndUpdate(
            id_cliente,
            {
                $push: {
                    favoritos: id_restaurante
                }
            },
            {
                new: true
            }
        );

        return resultado;
    }

    async getRestaurantesFavoritos(id_cliente){
        return await cliente.findById(id_cliente).populate("favoritos");
    }
    
}

module.exports = new ClienteService();
