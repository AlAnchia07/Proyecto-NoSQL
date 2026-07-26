import axios from "axios";
import { API_URL } from "../config/api";

const RESTAURANTES_URL = `${API_URL}/restaurantes`;

export async function getRestaurantePorId(idRestaurante) {
  try {
    const response = await axios.get(
      `${RESTAURANTES_URL}/${idRestaurante}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener el restaurante:", error);
    throw error;
  }
}

export async function getRestaurantePorUsuario(idUsuario) {
  try {
    const response = await axios.get(
      `${RESTAURANTES_URL}/usuario/${idUsuario}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener el restaurante por usuario:",
      error
    );

    throw error;
  }
}

export async function editarRestaurante(
  idRestaurante,
  datosRestaurante
) {
  try {
    const response = await axios.put(
      `${RESTAURANTES_URL}/${idRestaurante}`,
      datosRestaurante
    );

    return response.data;
  } catch (error) {
    console.error("Error al editar el restaurante:", error);
    throw error;
  }
}