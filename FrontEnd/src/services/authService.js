// FrontEnd/src/services/authService.js
import axios from "axios";
import { API_URL } from "../config/api"; 

const AUTH_URL = `${API_URL}/auth`; // Asegúrate de que coincida con la ruta base de tus rutas en el backend

export async function registrarClienteService(datosCliente) {
  try {
    const response = await axios.post(
      `${AUTH_URL}/register`, // Ajusta el endpoint final según cómo lo definiste en el backend (ej: /register o /registro)
      datosCliente
    );

    return response.data;
  } catch (error) {
    console.error("Error al registrar el cliente:", error);
    throw error.response?.data || error;
  }
}

export async function loginService(credenciales) {
  try {
    const response = await axios.post(
      `${AUTH_URL}/login`, // Ajusta el endpoint final según tu backend
      credenciales
    );

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error.response?.data || error;
  }
}