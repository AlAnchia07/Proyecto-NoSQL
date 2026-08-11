<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getRestaurantes } from "../../../services/restauranteService";
import { getFavoritos } from "@/services/clienteService";
import { useUsuarioStore } from "@/stores/UsuarioStore";

const router = useRouter();
const usuarioStore = useUsuarioStore();
console.log(usuarioStore.usuario._id);

const restaurants = ref([]);
const loading = ref(true);
const error = ref("");

const cargarRestaurantes = async () => {
  try {
    loading.value = true;
    error.value = "";

    const respuesta = await getFavoritos(usuarioStore.perfil._id);

    restaurants.value =
      respuesta?.restaurantes ??
      respuesta?.data ??
      respuesta ??
      [];

    if (!Array.isArray(restaurants.value)) {
      restaurants.value = [];
    }
  } catch (err) {
    console.error("Error cargando restaurantes:", err);
    error.value = "No se pudieron cargar los restaurantes.";
  } finally {
    loading.value = false;
  }
};

const openRestaurant = (idRestaurante) => {
  router.push(`/cliente/restaurante/${idRestaurante}`);
};

onMounted(cargarRestaurantes);
</script>

<template>
  <section class="home-page">
    <div class="section-header mb-4">
      <h3>Restaurantes Favoritos</h3>
      <p>Visualiza tus restaurantes marcados como favoritos</p>
    </div>

    <p v-if="loading" class="status-message">
      Cargando restaurantes...
    </p>

    <p
      v-else-if="error"
      class="status-message status-message--error"
    >
      {{ error }}
    </p>

    <div  v-else-if="restaurants.length === 0" class="text-center p-5 d-flex flex-column gap-2">
      <i class="bi bi-heart-fill fs-4"></i>
      <p>No has marcado ningun restaurante como favorito</p>
    </div>

    <div v-else class="restaurant-grid">
      <article
        v-for="restaurant in restaurants"
        :key="restaurant._id"
        class="restaurant-card"
        @click="openRestaurant(restaurant._id)"
      >
        <div class="image-container">
          <img
            :src="
              restaurant.url_imagen ||
              'https://placehold.co/800x500?text=BiteUp'
            "
            :alt="restaurant.nombre"
          />

          <span class="restaurant-state">
            {{ restaurant.estado }}
          </span>
        </div>

        <div class="card-content">
          <div class="title-row">
            <h3>{{ restaurant.nombre }}</h3>

            <span>
              {{
                restaurant.id_categoria?.nombre ||
                "Restaurante"
              }}
            </span>
          </div>

          <p>{{ restaurant.direccion }}</p>

          <button type="button">
            Ver restaurante
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 340px));
  gap: 22px;
  justify-content: start;
}

.restaurant-card {
  overflow: hidden;
  background: white;
  border: 1px solid #e2e7e4;
  border-radius: 16px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.restaurant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.09);
}

.image-container {
  position: relative;
  height: 190px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-state {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 10px;
  border-radius: 20px;
  background-color: #208b3a;
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.card-content {
  padding: 16px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.title-row h3 {
  margin: 0;
  font-size: 17px;
  color: #14213d;
}

.title-row span {
  color: #697386;
  font-size: 12px;
}

.card-content p {
  color: #6e7785;
  font-size: 14px;
}

.card-content button {
  width: 100%;
  padding: 9px;
  border: none;
  border-radius: 9px;
  background: #208b3a;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.status-message {
  padding: 30px;
  border-radius: 14px;
  background-color: white;
  color: #697386;
  text-align: center;
}

.status-message--error {
  color: #b42318;
}

@media (max-width: 700px) {
  .home-page {
    padding: 18px;
  }

  .hero {
    padding: 28px;
  }

  .hero h1 {
    font-size: 34px;
  }

  .search-box {
    margin-inline: 10px;
  }
}
</style>