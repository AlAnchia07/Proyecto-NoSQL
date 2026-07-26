const productoService = require(
  "../services/productoService"
);

const crearProducto = async (req, res) => {
  try {
    const producto =
      await productoService.crearProducto(req.body);

    res.status(201).json({
      mensaje: "Producto creado correctamente.",
      producto
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos =
      await productoService.obtenerProductos();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto =
      await productoService.obtenerProductoPorId(
        req.params.id
      );

    res.json(producto);
  } catch (error) {
    res.status(404).json({
      mensaje: error.message
    });
  }
};

const obtenerProductosPorRestaurante = async (
  req,
  res
) => {
  try {
    const incluirInactivos =
      req.query.incluirInactivos === "true";

    const productos =
      await productoService.obtenerProductosPorRestaurante(
        req.params.idRestaurante,
        incluirInactivos
      );

    res.json(productos);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

const editarProducto = async (req, res) => {
  try {
    const producto =
      await productoService.editarProducto(
        req.params.id,
        req.body
      );

    res.json({
      mensaje: "Producto actualizado correctamente.",
      producto
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

const eliminarProductoLogicamente = async (
  req,
  res
) => {
  try {
    const producto =
      await productoService.eliminarProductoLogicamente(
        req.params.id
      );

    res.json({
      mensaje: "Producto desactivado correctamente.",
      producto
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message
    });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosPorRestaurante,
  editarProducto,
  eliminarProductoLogicamente
};