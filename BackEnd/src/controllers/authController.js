// src/controllers/authController.js
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const Cliente = require('../models/Cliente')

async function registrarUsuario(req, res) {
  try {
    const { nombre, correo, contrasena, rol, restaurante } = req.body;

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contrasena: contrasenaHasheada,
      rol,
      restaurante: rol === 'EMPLEADO' ? restaurante : null
    });

    await nuevoUsuario.save();

    if (rol === "CLIENTE") {
      const nuevoCliente = new Cliente({
          id_usuario: nuevoUsuario._id
      });
      await nuevoCliente.save();
    }

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ mensaje: 'Error en el servidor al registrar el usuario.' });
  }
}

async function login(req, res) {
  try {
    const { correo, contrasena } = req.body

    const usuario = await Usuario.findOne({ correo })
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' })
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' })
    }

    let perfil = null
    if (usuario.rol === 'CLIENTE') {
      perfil = await Cliente.findOne({ id_usuario: usuario._id })
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      tipo_usuario: usuario.rol,
      usuario_id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      restaurante: usuario.restaurante,
      perfil
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión.' })
  }
}

module.exports = {
  registrarUsuario,
  login
}
