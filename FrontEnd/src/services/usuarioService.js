// FrontEnd/src/services/usuarioService.js
import axios from "axios";
import { API_URL } from "../config/api"; 

const USUARIOS_URL = `${API_URL}/usuarios`; 

export async function obtenerUsuariosService() {
  try {
    const response = await axios.get(USUARIOS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error.response?.data || error;
  }
}

export async function actualizarUsuarioService(id, datosUsuario) {
  try {
    const response = await axios.put(
      `${USUARIOS_URL}/${id}`,
      datosUsuario
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario ${id}:`, error);
    throw error.response?.data || error;
  }
}

export async function eliminarUsuarioService(id) {
  try {
    const response = await axios.delete(`${USUARIOS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el usuario ${id}:`, error);
    throw error.response?.data || error;
  }
}