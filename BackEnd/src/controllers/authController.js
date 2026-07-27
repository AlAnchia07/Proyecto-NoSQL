// src/controllers/authController.js
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuarioModel')
const Cliente = require('../models/clienteModel')

async function registrarCliente(req, res) {
  try {
    const { correo_registro, contraseña, nombre, direccion, ubicacion, telefono, url_imagen } = req.body

    const usuarioExistente = await Usuario.findOne({ correo_registro })
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' })
    }

    const salt = await bcrypt.genSalt(10)
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt)

    const nuevoUsuario = new Usuario({
      correo_registro,
      contraseña: contraseñaHasheada,
      tipo_usuario: 'CLIENTE'
    })
    await nuevoUsuario.save()

    const nuevoCliente = new Cliente({
      id_usuario: nuevoUsuario._id,
      nombre,
      direccion,
      ubicacion: ubicacion || { type: 'Point', coordinates: [0, 0] },
      telefono,
      url_imagen
    })
    await nuevoCliente.save()

    return res.status(201).json({
      mensaje: 'Cliente registrado exitosamente',
      cliente: {
        id: nuevoCliente._id,
        nombre: nuevoCliente.nombre,
        correo: nuevoUsuario.correo_registro
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error en el servidor al registrar el cliente.' })
  }
}

async function login(req, res) {
  try {
    const { correo_registro, contraseña } = req.body

    const usuario = await Usuario.findOne({ correo_registro })
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' })
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' })
    }

    let perfil = null
    if (usuario.tipo_usuario === 'CLIENTE') {
      perfil = await Cliente.findOne({ id_usuario: usuario._id })
    }

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      tipo_usuario: usuario.tipo_usuario,
      usuario_id: usuario._id,
      perfil
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión.' })
  }
}

module.exports = {
  registrarCliente,
  login
}