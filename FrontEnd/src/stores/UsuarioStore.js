import { defineStore } from "pinia";

export const useUsuarioStore = defineStore("usuario", {

    state: () => ({
        usuario: null,
        perfil: null
    }),

    actions: {

        iniciarSesion(usuario, perfil) {
            this.usuario = usuario;
            this.perfil = perfil;
        },

        cerrarSesion() {
            this.usuario = null;
            this.perfil = null;
        },

        simularLogin() {

            this.usuario = {
                _id: "6a5d77bb34d10e8bda019b79",
                correo_registro: "cliente@email.com",
                tipo_usuario: "CLIENTE"
            };

            this.perfil = {
                _id: "68615d78f8d2b39a4a3b7d41",
                nombre: "Juan Pérez"
            };

        }
    },

    getters: {

        esCliente: (state) => {
            return state.usuario?.tipo_usuario === "CLIENTE";
        },

        esRestaurante: (state) => {
            return state.usuario?.tipo_usuario === "RESTAURANTE";
        }
    }

});