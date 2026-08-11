
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');


async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find().populate('restaurante', 'nombre direccion');
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ mensaje: 'Error al obtener la lista de usuarios.' });
  }
}

async function obtenerPerfil(req, res) {
  try {
    const usuarioId = req.usuario?.id || req.usuarioId;
    
    const usuario = await Usuario.findById(usuarioId)
      .select('-contrasena')
      .populate('restaurante', 'nombre direccion');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ mensaje: 'Error al obtener la información del perfil.' });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const usuarioId = req.usuario?.id || req.usuarioId;
    const { nombre, correo, contrasena } = req.body;

    const datosActualizados = {
      nombre,
      correo
    };

    if (contrasena && contrasena.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.contrasena = await bcrypt.hash(contrasena, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      datosActualizados,
      { new: true, runValidators: true }
    ).select('-contrasena').populate('restaurante', 'nombre direccion');

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return res.status(500).json({ mensaje: 'Error al actualizar el perfil.' });
  }
}

// Actualizar un usuario
async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nombre, correo, contrasena, rol, restaurante } = req.body;

    const datosActualizados = {
      nombre,
      correo,
      rol: (rol || '').toUpperCase(),
      restaurante: (rol || '').toUpperCase() === 'EMPLEADO' ? restaurante : null
    };

    // Si mandan nueva contraseña, la hasheamos
    if (contrasena && contrasena.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.contrasena = await bcrypt.hash(contrasena, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id, 
      datosActualizados, 
      { new: true, runValidators: true }
    ).populate('restaurante', 'nombre direccion');

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ mensaje: 'Error al actualizar el usuario.' });
  }
}

// Eliminar un usuario
async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ mensaje: 'Error al eliminar el usuario.' });
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerPerfil,
  actualizarPerfil,
  actualizarUsuario,
  eliminarUsuario
};