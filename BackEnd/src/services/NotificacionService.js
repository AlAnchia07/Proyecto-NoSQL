const Notificacion = require("../models/Notificacion");
const mongoose = require("mongoose");

class NotificacionService {

    async createNotificacion(data) {
        const nuevaNotificacion = new Notificacion(data);
        await nuevaNotificacion.save();
        return nuevaNotificacion;
    }

    async marcarLeida(id){
        return await Notificacion.updateMany(
            {
                id_usuario: new mongoose.Types.ObjectId(id),
                leido:false
            },
            {
                leido:true
            }
        );
    }

    async traerNotificaciones(id) {
        return await Notificacion.aggregate([
            {
                $match: {
                    id_usuario: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $sort: {
                    fecha: -1
                }
            },
            {
                $group:{
                    _id: {
                        año: {
                            $year: {
                                date: "$fecha",
                                timezone: "America/Costa_Rica"
                            },
                        },
                        mes: {
                            $month: {
                                date: "$fecha",
                                timezone: "America/Costa_Rica"
                            }
                        },
                        dia: {
                            $dayOfMonth: {
                                date:"$fecha",
                                timezone: "America/Costa_Rica"
                            }
                        }
                    },
                    notificacion: {
                        $push: "$$ROOT"
                    }
                }   
            },
            {
                $sort: {
                    "_id.año" : -1,
                    "_id.mes" : -1,
                    "_id.dia" : -1
                }
            }
        ]); 
    }

    async contarNoLeidas(id_usuario) {
        return await Notificacion.countDocuments({
            id_usuario: new mongoose.Types.ObjectId(id_usuario),
            leido: false
        });
    }
}

module.exports = new NotificacionService();