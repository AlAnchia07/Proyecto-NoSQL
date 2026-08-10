// FrontEnd/src/services/authService.js
import axios from "axios";
import { API_URL } from "../config/api"; 

const AUTH_URL = `${API_URL}/auth`; 

export async function registrarClienteService(datosCliente) {
  try {
    const response = await axios.post(
      `${AUTH_URL}/register`,
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
      `${AUTH_URL}/login`, 
      credenciales
    );

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error.response?.data || error;
  }
}