import axios from "axios";
import { API_URL } from "../config/api";

const PRODUCTOS_URL = `${API_URL}/productos`;

export async function getProductosPorRestaurante(
  idRestaurante,
  incluirInactivos = true
) {
  try {
    const response = await axios.get(
      `${PRODUCTOS_URL}/restaurante/${idRestaurante}`,
      {
        params: {
          incluirInactivos
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los productos del restaurante:",
      error
    );

    throw error;
  }
}

export async function getProductoPorId(idProducto) {
  try {
    const response = await axios.get(
      `${PRODUCTOS_URL}/${idProducto}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
}

export async function crearProducto(datosProducto) {
  try {
    const response = await axios.post(
      PRODUCTOS_URL,
      datosProducto
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
}

export async function editarProducto(
  idProducto,
  datosProducto
) {
  try {
    const response = await axios.put(
      `${PRODUCTOS_URL}/${idProducto}`,
      datosProducto
    );

    return response.data;
  } catch (error) {
    console.error("Error al editar el producto:", error);
    throw error;
  }
}

export async function desactivarProducto(idProducto) {
  try {
    const response = await axios.patch(
      `${PRODUCTOS_URL}/${idProducto}/desactivar`
    );

    return response.data;
  } catch (error) {
    console.error("Error al desactivar el producto:", error);
    throw error;
  }
}

export async function reactivarProducto(idProducto) {
  try {
    const response = await axios.patch(
      `${PRODUCTOS_URL}/${idProducto}/reactivar`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al reactivar el producto:",
      error
    );

    throw error;
  }
}