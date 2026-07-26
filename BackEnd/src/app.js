// src/app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const pedidoRoutes = require("./routes/pedidoRoutes");
const reseñaRoutes = require("./routes/ReseñaRoutes");
const notificacionRoutes = require("./routes/NotificacionRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const restauranteRoutes = require("./routes/restauranteRoutes");
const productoRoutes = require("./routes/productoRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/prueba", (req, res) => {
  res.json({
    mensaje: "Backend correcto ejecutándose"
  });
});

app.use("/api/pedidos", pedidoRoutes);
app.use("/api", reseñaRoutes);
app.use("/api", notificacionRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/restaurantes", restauranteRoutes);
app.use("/api/productos", productoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});