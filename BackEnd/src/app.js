// src/app.js

const express = require('express');
const connectDB = require('./config/db');
const pedidoRoutes = require("./routes/pedidoRoutes");
const cors = require("cors");

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/pedidos", pedidoRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

// Aquí irán las rutas
/*
const pedidoRoutes = require('./routes/pedidoRoutes');
app.use('/api/pedidos', pedidoRoutes);
*/

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});