import axios from "axios";
import { API_URL } from "../config/api";

export const marcarLeidas = async (id) => {
    const response = await axios.put(`${API_URL}/notificacion/leida/${id}`);
    return response.data;
}

export const traerNotificaciones = async (id) => {
    const response = await axios.get(`${API_URL}/notificacion/usuario/${id}`);
    return response.data;
}

export const contarNoLeidas = async (id) => {
    const response = await axios.get(`${API_URL}/notificacion/contador/${id}`);
    return response.data;
}