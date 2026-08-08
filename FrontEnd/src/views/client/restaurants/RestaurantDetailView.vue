<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "../../../stores/cartStore";
import Resenas from "../../../components/reviews/ReviewList.vue"
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag
} from "lucide-vue-next";

import {
  getRestaurantePorId
} from "../../../services/restauranteService";

import {
  getProductosPorRestaurante
} from "../../../services/productoService";
import ReviewList from "../../../components/reviews/ReviewList.vue";

import { useUsuarioStore } from "@/stores/UsuarioStore";
import { agregarFavoritos, eliminarFavoritos } from "@/services/clienteService";

const route = useRoute();
const router = useRouter();

const cartStore = useCartStore();

const restaurant = ref(null);
const products = ref([]);
const cart = computed(() => cartStore.productos);

const loading = ref(true);
const error = ref("");

const cargarDetalle = async () => {
  try {
    loading.value = true;
    error.value = "";

    const idRestaurante = route.params.id;

    const [respuestaRestaurante, respuestaProductos] =
      await Promise.all([
        getRestaurantePorId(idRestaurante),
        getProductosPorRestaurante(idRestaurante, false)
      ]);

    restaurant.value = respuestaRestaurante;
    cartStore.seleccionarRestaurante(restaurant.value);
    products.value = respuestaProductos;

    if (!Array.isArray(products.value)) {
      products.value = [];
    }
  } catch (err) {
    console.error("Error cargando el detalle:", err);
    error.value =
      "No se pudo cargar la información del restaurante.";
  } finally {
    loading.value = false;
  }
};

const addProduct = (product) => {
  cartStore.agregarProducto(product);
};

const increaseQuantity = (product) => {
  cartStore.aumentarCantidad(product);
};

const decreaseQuantity = (product) => {
  cartStore.disminuirCantidad(product);
};

const subtotal = computed(() => cartStore.subtotal);


const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0
  }).format(amount);

const confirmOrder = () => {
  if (cart.value.length === 0) {
    return;
  }

  router.push("/cliente/checkout");
};

onMounted(cargarDetalle);

//Esta parte es para asignar un restaurante como favorito
const usuarioStore = useUsuarioStore();

const idRestaurante = route.params.id;
const esFavorito = ref(usuarioStore.perfil.favoritos.includes(idRestaurante));

const cambiarFavorito = async () => {
    try {
        if (esFavorito.value) {
            await eliminarFavoritos(
                usuarioStore.perfil._id,
                idRestaurante
            );

            esFavorito.value = false;

            usuarioStore.perfil.favoritos =usuarioStore.perfil.favoritos.filter(id => id !== idRestaurante);

        } else {
            await agregarFavoritos(
                usuarioStore.perfil._id,
                idRestaurante
            );

            esFavorito.value = true;

            usuarioStore.perfil.favoritos.push(idRestaurante);
        }

    } catch (error) {
        console.error("Error al actualizar favorito:", error);
    }
};
</script>

<template>
  <section class="restaurant-detail">
    
    <p v-if="loading" class="status-message">
      Cargando restaurante...
    </p>

    <p
      v-else-if="error"
      class="status-message status-message--error"
    >
      {{ error }}
    </p>

    <div v-else-if="restaurant">

      <button class="back-button" type="button" @click="router.back()">
        <ArrowLeft />
        Volver
      </button>

      <div class="restaurant-detail__layout">
        <div class="restaurant-detail__main">
          <header class="restaurant-header">
            <img
              :src="
                restaurant.url_imagen ||
                'https://placehold.co/1200x500?text=BiteUp'
              "
              :alt="restaurant.nombre"
              class="restaurant-header__image"
            />

            <div class="restaurant-header__overlay">
              <div>
                <p class="restaurant-header__category">
                  {{ restaurant.id_categoria?.nombre || "Restaurante" }}
                </p>

                <h1>{{ restaurant.nombre }}</h1>

                <div class="restaurant-header__meta">
                  <span>{{ restaurant.direccion }}</span>

                  <span class="restaurant-header__status">
                    {{ restaurant.estado }}
                  </span>
                </div>
              </div>

              <button class="favorite-button" type="button" @click="cambiarFavorito" :class="esFavorito ? 'favorite' : ''">
                  <Heart />
                  {{ esFavorito ? "Quitar favorito" : "Favorito" }}
              </button>
            </div>
          </header>

          <section class="products-section">
            <div class="products-section__heading">
              <div>
                <h2>Productos disponibles</h2>
                <p>Selecciona los productos que deseas agregar al pedido.</p>
              </div>
            </div>

            <div class="product-grid">
              <article
                v-for="product in products"
                :key="product._id"
                class="product-card"
              >
                <img
                  :src="
                    product.url_imagen ||
                    'https://placehold.co/600x400?text=Producto'
                  "
                  :alt="product.nombre"
                />

                <div class="product-card__content">
                  <h3>{{ product.nombre }}</h3>
                  <p>{{ product.descripcion }}</p>

                  <div class="product-card__details">
                    <strong>{{ formatCurrency(product.precio_descuento) }}</strong>
                    <span>Quedan {{ product.cantidad_disponible }}</span>
                  </div>

                  <button type="button" @click="addProduct(product)">
                    Agregar
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="cart">
          <div class="cart__heading">
            <div>
              <p>Tu selección</p>
              <h2>Mi pedido</h2>
            </div>

            <ShoppingBag />
          </div>

          <div v-if="cart.length === 0" class="cart__empty">
            <ShoppingBag />
            <p>Aún no has agregado productos.</p>
          </div>

          <div v-else class="cart__items">
            <article
              v-for="product in cart"
              :key="product._id"
              class="cart-item"
            >
              <img
                :src="
                  product.url_imagen ||
                  'https://placehold.co/200x200?text=Producto'
                "
                :alt="product.nombre"
              />

              <div class="cart-item__info">
                <h3>{{ product.nombre }}</h3>
                <span>{{ formatCurrency(product.precio_descuento) }}</span>
              </div>

              <div class="quantity-control">
                <button type="button" @click="decreaseQuantity(product)">
                  <Minus />
                </button>

                <span>{{ product.quantity }}</span>

                <button type="button" @click="increaseQuantity(product)">
                  <Plus />
                </button>
              </div>
            </article>
          </div>

          <div class="cart__summary">
            <div>
              <span>Subtotal</span>
              <strong>{{ formatCurrency(subtotal) }}</strong>
            </div>

            <div>
              <span>Entrega</span>
              <strong>Retiro en el local</strong>
            </div>

            <div class="cart__total">
              <span>Total</span>
              <strong>{{ formatCurrency(subtotal) }}</strong>
            </div>
          </div>

          <button
            class="confirm-button"
            type="button"
            :disabled="cart.length === 0"
            @click="confirmOrder"
          >
            Proceder al pago
          </button>
        </aside>
      </div>
      <div class="pt-5">
        <h2>Reseñas</h2>
        <p>Visualiza y esribe una reseña al restaurante</p>
        <ReviewList :mostrarFormulario="true" :idRestaurante="route.params.id"/>
      </div>
    </div>
  </section>
</template>

<style scoped>
.restaurant-detail {
  max-width: 1500px;
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: #183153;
  font-weight: 600;
  cursor: pointer;
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.restaurant-detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 24px;
  align-items: start;
}

.restaurant-detail__main {
  min-width: 0;
}

.restaurant-header {
  position: relative;
  overflow: hidden;
  min-height: 290px;
  border-radius: 20px;
}

.restaurant-header__image {
  width: 100%;
  height: 290px;
  object-fit: cover;
}

.restaurant-header__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  background: linear-gradient(
    to top,
    rgba(5, 20, 35, 0.84),
    rgba(5, 20, 35, 0.06)
  );
  color: white;
}

.restaurant-header__category {
  margin: 0 0 6px;
  font-size: 14px;
}

.restaurant-header h1 {
  margin: 0;
  font-size: 36px;
}

.restaurant-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
  font-size: 14px;
}

.restaurant-header__status {
  padding: 4px 10px;
  border-radius: 20px;
  background-color: #e9f8ed;
  color: #18843d;
  font-weight: 700;
}

.favorite-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border: none;
  border-radius: 10px;
  background-color: white;
  color: #1d2939;
  font-weight: 600;
  cursor: pointer;
}

.favorite-button svg {
  width: 18px;
  height: 18px;
}

.products-section {
  margin-top: 28px;
}

.products-section__heading h2 {
  margin: 0;
  color: #092650;
}

.products-section__heading p {
  margin: 6px 0 18px;
  color: #697386;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  overflow: hidden;
  border: 1px solid #e1e6e3;
  border-radius: 16px;
  background-color: white;
}

.product-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}

.product-card__content {
  padding: 16px;
}

.product-card h3 {
  margin: 0;
  color: #102a43;
}

.product-card p {
  min-height: 42px;
  margin: 8px 0 14px;
  color: #697386;
  font-size: 14px;
}

.product-card__details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.product-card__details span {
  color: #268f45;
  font-size: 13px;
  font-weight: 600;
}

.product-card button,
.confirm-button {
  width: 100%;
  padding: 11px 14px;
  border: none;
  border-radius: 9px;
  background-color: #208b3a;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.cart {
  position: sticky;
  top: 102px;
  padding: 22px;
  border: 1px solid #e1e6e3;
  border-radius: 18px;
  background-color: white;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.07);
}

.cart__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart__heading p {
  margin: 0;
  color: #697386;
  font-size: 13px;
}

.cart__heading h2 {
  margin: 3px 0 0;
  color: #102a43;
}

.cart__heading svg {
  color: #208b3a;
}

.cart__empty {
  display: grid;
  min-height: 190px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: #7a8493;
  text-align: center;
}

.cart__empty svg {
  width: 34px;
  height: 34px;
}

.cart__items {
  display: grid;
  gap: 16px;
  margin-top: 22px;
}

.cart-item {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.cart-item img {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  object-fit: cover;
}

.cart-item__info h3 {
  margin: 0 0 4px;
  font-size: 14px;
}

.cart-item__info span {
  color: #697386;
  font-size: 13px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 7px;
}

.quantity-control button {
  display: grid;
  width: 28px;
  height: 28px;
  padding: 0;
  place-items: center;
  border: 1px solid #dce2df;
  border-radius: 7px;
  background-color: white;
  cursor: pointer;
}

.quantity-control svg {
  width: 14px;
  height: 14px;
}

.cart__summary {
  display: grid;
  gap: 12px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #e4e8e6;
}

.cart__summary > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #657080;
  font-size: 14px;
}

.cart__summary strong {
  color: #102a43;
  text-align: right;
}

.cart__total {
  padding-top: 12px;
  border-top: 1px solid #e4e8e6;
  font-size: 16px !important;
}

.confirm-button {
  margin-top: 20px;
}

.confirm-button:disabled {
  background-color: #aab8ad;
  cursor: not-allowed;
}

.favorite{
  color:white;
  background: var(--green-main);
}

@media (max-width: 1050px) {
  .restaurant-detail__layout {
    grid-template-columns: 1fr;
  }

  .cart {
    position: static;
  }
}

@media (max-width: 700px) {
  .restaurant-header__overlay {
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-end;
  }

  .restaurant-header h1 {
    font-size: 28px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>