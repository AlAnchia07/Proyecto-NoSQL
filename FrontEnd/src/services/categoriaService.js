import axios from "axios";
import { API_URL } from "../config/api";

const CATEGORIAS_URL = `${API_URL}/categorias`;

export async function getCategoriasPorTipo(tipo) {
  try {
    const response = await axios.get(
      `${CATEGORIAS_URL}/tipo/${tipo}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
}