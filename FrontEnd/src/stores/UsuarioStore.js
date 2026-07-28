import { defineStore } from "pinia";

export const useUsuarioStore = defineStore("usuario", {
  state: () => ({
    usuario: null,
    perfil: null
  }),

  actions: {
    iniciarSesion(usuario, perfil = null) {
      this.usuario = usuario;
      this.perfil = perfil;
    },

    cerrarSesion() {
      this.usuario = null;
      this.perfil = null;
    },

    simularLoginAdministrador() {
      this.usuario = {
        _id: "6a666c044971455c8b375501",
        correo_registro: "restaurante.prueba@biteup.com",
        tipo_usuario: "RESTAURANTE"
      };

      this.perfil = null;
    }
  },

  getters: {
    esCliente: (state) => {
      return state.usuario?.tipo_usuario === "CLIENTE";
    },

    esAdministradorRestaurante: (state) => {
      return state.usuario?.tipo_usuario === "RESTAURANTE";
    }
  }
});