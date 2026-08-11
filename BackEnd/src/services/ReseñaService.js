const reseña = require("../models/Reseña");
const cliente = require("../models/Cliente");
const restaurante = require("../models/Restaurante");
const notificacionesService = require("./NotificacionService");
const mongoose = require("mongoose");

class ReseñaService {
    
    async createReseña(data) {
        const nuevaReseña = new reseña(data);
        await nuevaReseña.save();

        const restauranteEncontrado = await restaurante.findById(
            data.id_restaurante
        );
  
        const notificacion = await notificacionesService.createNotificacion({
            id_usuario: restauranteEncontrado.id_usuario,
            mensaje: `Un cliente ha calificado tu restaurante ${restauranteEncontrado.nombre}`,
            tipo: "RESEÑA"
        })
        return nuevaReseña;
    }

    async updateReseña(id, data) {
        return await reseña.findByIdAndUpdate(id, data, {new:true});
    }

    async deleteReseña(id){
        return await reseña.findByIdAndDelete(id);
    }

    async restauranteReseñas(id){
        return await reseña.find({
            id_restaurante: new mongoose.Types.ObjectId(id)
        })
        .sort({ fecha: -1 })
        .populate({
            path: "id_cliente",
            select: "url_imagen",
            populate: {
                path: "id_usuario",
                select: "nombre correo"
            }
        });
    }

    async resumenReseñas(id){
        return await reseña.aggregate([
            {
                $match: {
                    id_restaurante: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $facet: {
                    distribucion: [
                        {
                            $group: {
                                _id:"$calificacion",
                                cantidad: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        }
                    ],
                    resumen: [
                        {
                            $group: {
                                _id:null,
                                total: { $sum: 1 },
                                promedio: { $avg: "$calificacion"}
                            }
                        }
                    ]

                }
            }
        ])
    }

    async filtrarReseñasCliente(id){
        return await reseña.find({id_cliente : new mongoose.Types.ObjectId(id)}).populate("id_restaurante","nombre url_imagen")
    }


}

module.exports = new ReseñaService();