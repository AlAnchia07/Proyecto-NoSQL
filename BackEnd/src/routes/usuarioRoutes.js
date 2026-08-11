// src/routes/usuarioRoutes.js
const express = require('express')
const router = express.Router()
const { 
  obtenerUsuarios, 
  actualizarUsuario, 
  eliminarUsuario,
  obtenerPerfil,     
  actualizarPerfil   
} = require('../controllers/usuarioController')

const verificarToken = require('../middlewares/authMiddleware');


router.get('/perfil', verificarToken, obtenerPerfil)
router.put('/perfil', verificarToken, actualizarPerfil)

router.get('/', obtenerUsuarios)

router.put('/:id', actualizarUsuario)

router.delete('/:id', eliminarUsuario)

module.exports = router