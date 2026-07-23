const bucket = require("../config/firebase");

async function subirImagen(file, carpeta) {
    const nombre = `${Date.now()}-${file.originalname}`;
    const archivo = bucket.file(`BiteUp/${carpeta}/${nombre}`);

    await archivo.save(file.buffer, {
        metadata: {
            contentType: file.mimetype
        }
    });

    await archivo.makePublic();
    return archivo.publicUrl();
}

module.exports = {
    subirImagen
}