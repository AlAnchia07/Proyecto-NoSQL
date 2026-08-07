const restauranteService = require(
  "../services/restauranteService"
);

// Crear restaurante
const crearRestaurante = async (req, res) => {
  try {
    const restaurante =
      await restauranteService.crearRestaurante(req.body);

    res.status(201).json({
      mensaje: "Restaurante creado correctamente.",
      restaurante
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

// Listar restaurantes
const obtenerRestaurantes = async (req, res) => {
  try {
    const restaurantes =
      await restauranteService.obtenerRestaurantes();

    res.json(restaurantes);
  } catch (error) {
    console.error("Error obteniendo restaurantes:", error);
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Consultar restaurante por ID
const obtenerRestaurantePorId = async (req, res) => {
  try {
    const restaurante =
      await restauranteService.obtenerRestaurantePorId(
        req.params.id
      );

    res.json(restaurante);
  } catch (error) {
    res.status(404).json({
      mensaje: error.message
    });
  }
};

// Consultar restaurante por usuario
const obtenerRestaurantesPorUsuario = async (req, res) => {
  try {
    const restaurantes =
      await restauranteService.obtenerRestaurantesPorUsuario(
        req.params.idUsuario
      );

    res.json(restaurantes);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

// Editar restaurante
const editarRestaurante = async (req, res) => {
  try {
    const restaurante =
      await restauranteService.editarRestaurante(
        req.params.id,
        req.body
      );

    res.json({
      mensaje: "Restaurante actualizado correctamente.",
      restaurante
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

module.exports = {
  crearRestaurante,
  obtenerRestaurantes,
  obtenerRestaurantePorId,
  obtenerRestaurantesPorUsuario,
  editarRestaurante
};