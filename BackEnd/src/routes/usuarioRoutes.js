// src/routes/usuarioRoutes.js
const express = require('express')
const router = express.Router()
const { 
  obtenerUsuarios, 
  actualizarUsuario, 
  eliminarUsuario 
} = require('../controllers/usuarioController')


router.get('/', obtenerUsuarios)


router.put('/:id', actualizarUsuario)


router.delete('/:id', eliminarUsuario)

module.exports = router