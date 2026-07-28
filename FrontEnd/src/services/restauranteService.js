import axios from "axios";
import { API_URL } from "../config/api";

const RESTAURANTES_URL = `${API_URL}/restaurantes`;

export async function getRestaurantes() {
  try {
    const response = await axios.get(
      RESTAURANTES_URL
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los restaurantes:",
      error
    );

    throw error;
  }
}

export async function getRestaurantesPorUsuario(idUsuario) {
  try {
    const response = await axios.get(
      `${RESTAURANTES_URL}/usuario/${idUsuario}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los restaurantes del usuario:",
      error
    );

    throw error;
  }
}

export async function getRestaurantePorId(idRestaurante) {
  try {
    const response = await axios.get(
      `${RESTAURANTES_URL}/${idRestaurante}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener el restaurante:",
      error
    );

    throw error;
  }
}

export async function crearRestaurante(datosRestaurante) {
  try {
    const response = await axios.post(
      RESTAURANTES_URL,
      datosRestaurante
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el restaurante:",
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

/*
export async function getRestaurantes() {
  try {
    const response = await axios.get(RESTAURANTES_URL);

    return response.data;
  } catch (error) {
    console.error("Error al obtener los restaurantes:", error);
    throw error;
  }
}
  */