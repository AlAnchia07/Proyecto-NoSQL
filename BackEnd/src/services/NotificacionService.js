const Notificacion = require("../models/Notificacion");
const mongoose = require("mongoose");

class NotificacionService {

    async createNotificacion(data) {
        const nuevaNotificacion = new Notificacion(data);
        await nuevaNotificacion.save();
        return nuevaNotificacion;
    }

    async marcarLeida(id){
        return await Notificacion.findByIdAndUpdate(id, {leido:true}, { new: true })
    }

    async traerNotificaciones(id) {
        return await Notificacion.aggregate([
            {
                $match: {
                    id_usuario: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group:{
                    _id: {
                        año: {$year: "$fecha"},
                        mes: {$month: "$fecha"},
                        dia: {$dayOfMonth: "$fecha"}
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
}

module.exports = new NotificacionService();