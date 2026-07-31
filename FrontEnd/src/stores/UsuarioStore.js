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
        _id: "66a000000000000000000001",
        correo_registro: "admin.central@biteup.test",
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