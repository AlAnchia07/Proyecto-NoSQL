import axios from "axios";
import { API_URL } from "../config/api";

export const crearReseña = async (data) => {
    const response = await axios.post(`${API_URL}/resena`,data);
    return response.data;
}

export const actualizarReseña = async (id,data) => {
    const response = await axios.put(`${API_URL}/resena/${id}`,data);
    return response.data;
}

export const eliminarReseña = async (id) => {
    const response = await axios.delete(`${API_URL}/resena/${id}`);
    return response.data;
}

export const obtenerReseñasRestaurante = async (id) => {
    const response = await axios.get(
        `${API_URL}/resenas/restaurante/${id}`
    );

    return response.data;
};

export const obtenerResumenReseñas = async (id) => {
    const response = await axios.get(
        `${API_URL}/resenas/resumen/${id}`
    );

    return response.data;
};

export const filtarReseñasUsuario = async (id) => {
    const response = await axios.get(
        `${API_URL}/resenas/cliente/${id}`
    );

    return response.data;
};

