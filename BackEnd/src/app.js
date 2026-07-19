// src/app.js

const express = require('express');
// const connectDB = require('./config/db');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

//AQUI SE AGREGAN LAS RUTAS CONFORME HAGAMOS MODULOS // Ejemplo
/*    
const usuarioRoutes = require('./routes/UsuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);
*/