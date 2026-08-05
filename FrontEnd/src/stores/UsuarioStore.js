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
    },

    simularLoginCliente() {
      this.usuario = {
        _id: "6a5d77bb34d10e8bda019b79",
        correo_registro: "juan.perez@email.com",
        tipo_usuario: "CLIENTE"
      };

      this.perfil = {
        _id: "68615d78f8d2b39a4a3b7d41",
        id_usuario: "6a5d77bb34d10e8bda019b79",
        nombre: "Juan Pérez Ramírez",
        direccion: "150 m al este del Parque Central, San José",
        telefono: "8888-1111",
        favoritos: [],
        url_imagen: "https://firebasestorage.googleapis.com/v0/b/techshop-ef0e8.firebasestorage.app/o/default.png"
      };
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