
import api from '../config/api'

export async function registrarClienteService(datosCliente) {
  try {
    const response = await api.post('/auth/register', datosCliente)
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al conectar con el servidor' }
  }
}

export async function loginService(credenciales) {
  try {
    const response = await api.post('/auth/login', credenciales)
    return response.data
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al conectar con el servidor' }
  }
}