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

export async function obtenerPerfilService() {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener el perfil' }
  }
}

export async function actualizarPerfilService(datosPerfil) {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put('/usuarios/perfil', datosPerfil, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar el perfil' }
  }
}