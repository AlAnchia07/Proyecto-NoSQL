import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  const restaurante = ref(null);
  const productos = ref([]);

  const subtotal = computed(() =>
    productos.value.reduce(
      (total, producto) =>
        total +
        producto.precio_descuento * producto.quantity,
      0
    )
  );

  function seleccionarRestaurante(datosRestaurante) {
    if (
      restaurante.value &&
      restaurante.value._id !== datosRestaurante._id
    ) {
      productos.value = [];
    }

    restaurante.value = datosRestaurante;
  }

  function agregarProducto(producto) {
    const existente = productos.value.find(
      (item) => item._id === producto._id
    );

    if (existente) {
      if (
        existente.quantity <
        producto.cantidad_disponible
      ) {
        existente.quantity++;
      }

      return;
    }

    productos.value.push({
      ...producto,
      quantity: 1
    });
  }

  function aumentarCantidad(producto) {
    if (
      producto.quantity <
      producto.cantidad_disponible
    ) {
      producto.quantity++;
    }
  }

  function disminuirCantidad(producto) {
    if (producto.quantity > 1) {
      producto.quantity--;
      return;
    }

    productos.value = productos.value.filter(
      (item) => item._id !== producto._id
    );
  }

  function limpiarCarrito() {
    restaurante.value = null;
    productos.value = [];
  }

  return {
    restaurante,
    productos,
    subtotal,
    seleccionarRestaurante,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    limpiarCarrito
  };
});