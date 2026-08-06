// src/services/usuarioService.js
import api from '../config/api'

export async function obtenerUsuariosService() {
  try {
    const response = await api.get('/usuarios')
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al conectar con el servidor' }
  }
}

export async function actualizarUsuarioService(id, datosUsuario) {
  try {
    const response = await api.put(`/usuarios/${id}`, datosUsuario)
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al conectar con el servidor' }
  }
}

export async function eliminarUsuarioService(id) {
  try {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al conectar con el servidor' }
  }
}