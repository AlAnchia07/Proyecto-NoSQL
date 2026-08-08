import axios from "axios";
import { API_URL } from "../config/api";

export const agregarFavoritos = async (id_cliente, id_restaurante) => {
    const respuesta = await axios.post(
        `${API_URL}/cliente/${id_cliente}/favoritos/${id_restaurante}`
    );

    return respuesta.data;
};

export const eliminarFavoritos = async (id_cliente, id_restaurante) => {
    const respuesta = await axios.delete(
        `${API_URL}/cliente/${id_cliente}/favoritos/${id_restaurante}`
    );

    return respuesta.data;
};

export const getFavoritos = async (id) => {
    const respuesta = await axios.get(
        `${API_URL}/cliente/${id}/favoritos/cliente`
    );

    return respuesta.data;
}