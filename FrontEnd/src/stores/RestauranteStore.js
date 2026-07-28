import { defineStore } from "pinia";

export const useRestauranteStore = defineStore(
  "restaurante",
  {
    state: () => ({
      restauranteActivo: null
    }),

    actions: {
      seleccionarRestaurante(restaurante) {
        this.restauranteActivo = restaurante;

        localStorage.setItem(
          "restauranteActivo",
          JSON.stringify(restaurante)
        );
      },

      cargarRestauranteGuardado() {
        const restauranteGuardado =
          localStorage.getItem("restauranteActivo");

        if (!restauranteGuardado) {
          return;
        }

        try {
          this.restauranteActivo =
            JSON.parse(restauranteGuardado);
        } catch {
          localStorage.removeItem(
            "restauranteActivo"
          );

          this.restauranteActivo = null;
        }
      },

      limpiarRestauranteActivo() {
        this.restauranteActivo = null;

        localStorage.removeItem(
          "restauranteActivo"
        );
      }
    },

    getters: {
      idRestauranteActivo: (state) => {
        return state.restauranteActivo?._id || null;
      },

      hayRestauranteActivo: (state) => {
        return Boolean(state.restauranteActivo?._id);
      }
    }
  }
);