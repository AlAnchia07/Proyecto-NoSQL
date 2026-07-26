const categoriaService = require("../services/categoriaService");

// Crear categoría
const crearCategoria = async (req, res) => {
    try {
        const categoria = await categoriaService.crearCategoria(
            req.body
        );

        res.status(201).json(categoria);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const categorias =
            await categoriaService.obtenerCategorias();

        res.json(categorias);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Obtener categorías por tipo
const obtenerCategoriasPorTipo = async (req, res) => {
    try {
        const categorias =
            await categoriaService.obtenerCategoriasPorTipo(
                req.params.tipo
            );

        res.json(categorias);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Obtener categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria =
            await categoriaService.obtenerCategoriaPorId(
                req.params.id
            );

        res.json(categoria);

    } catch (error) {
        res.status(404).json({
            mensaje: error.message
        });
    }
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasPorTipo,
    obtenerCategoriaPorId
};