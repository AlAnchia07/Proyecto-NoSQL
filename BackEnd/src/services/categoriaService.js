const Categoria = require("../models/Categoria");

// Crear una categoría
const crearCategoria = async (datosCategoria) => {
    const {
        nombre,
        descripcion,
        tipo
    } = datosCategoria;

    const categoriaExistente = await Categoria.findOne({
        nombre: {
            $regex: new RegExp(`^${nombre}$`, "i")
        },
        tipo
    });

    if (categoriaExistente) {
        throw new Error(
            "Ya existe una categoría con ese nombre y tipo."
        );
    }

    const nuevaCategoria = new Categoria({
        nombre,
        descripcion,
        tipo
    });

    return await nuevaCategoria.save();
};

// Obtener todas las categorías activas
const obtenerCategorias = async () => {
    return await Categoria.find({
        estado: "ACTIVA"
    }).sort({
        tipo: 1,
        nombre: 1
    });
};

// Obtener categorías según su tipo
const obtenerCategoriasPorTipo = async (tipo) => {
    const tiposPermitidos = [
        "RESTAURANTE",
        "PRODUCTO"
    ];

    const tipoNormalizado = tipo.toUpperCase();

    if (!tiposPermitidos.includes(tipoNormalizado)) {
        throw new Error(
            "El tipo debe ser RESTAURANTE o PRODUCTO."
        );
    }

    return await Categoria.find({
        tipo: tipoNormalizado,
        estado: "ACTIVA"
    }).sort({
        nombre: 1
    });
};

// Obtener categoría por ID
const obtenerCategoriaPorId = async (idCategoria) => {
    const categoria = await Categoria.findById(idCategoria);

    if (!categoria) {
        throw new Error("Categoría no encontrada.");
    }

    return categoria;
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasPorTipo,
    obtenerCategoriaPorId
};