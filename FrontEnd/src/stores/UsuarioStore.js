import { defineStore } from "pinia";

export const useUsuarioStore = defineStore("usuario", {
  state: () => ({
    usuario: null,
    perfil: null
  }),

  persist: true,

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
    },

    simularLoginRestaurante() {
      this.usuario = {
        _id:"6a5d770d9b6e977d303fbfec",
        correo_registro:"saborurbanotest.restaurante@email.com",
        tipo_usuario:"RESTAURANTE"
      };

      this.perfil = {
        _id: "6a5d7842972a8f68691625af"
      };
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