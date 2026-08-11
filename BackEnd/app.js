
/*
=========================================

ESTE ARCHIVO NO SE UTILIZA.

El backend se ejecuta desde:

    BackEnd/src/app.js

según la configuración de package.json:

"main": "src/app.js"

=========================================


// src/app.js
require('dotenv').config();

const connectDB = require('./src/config/db');

const express = require('express');
const cors = require("cors");

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const reseñaRoutes = require('./src/routes/ReseñaRoutes');
const notificacionRoutes = require('./src/routes/NotificacionRoutes');
const categoriaRoutes = require("./src/routes/categoriaRoutes");


app.use('/api', reseñaRoutes);
app.use('/api', notificacionRoutes);
app.use('/api/categorias', categoriaRoutes);


console.log("ReseñaRoutes cargado");

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
*/