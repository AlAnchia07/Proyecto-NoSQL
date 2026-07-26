<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getRestaurantes } from "../../../services/restauranteService";

const router = useRouter();

const search = ref("");
const restaurants = ref([]);
const loading = ref(true);
const error = ref("");

const filteredRestaurants = computed(() => {
  const texto = search.value.trim().toLowerCase();

  if (!texto) {
    return restaurants.value;
  }

  return restaurants.value.filter((restaurant) =>
    restaurant.nombre?.toLowerCase().includes(texto)
  );
});

const cargarRestaurantes = async () => {
  try {
    loading.value = true;
    error.value = "";

    const respuesta = await getRestaurantes();

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
    <div class="hero">
      <div>
        <h1>
          Buena comida,<br />
          <span>mejor futuro.</span>
        </h1>

        <p>
          Conectamos restaurantes y personas para aprovechar alimentos y reducir
          el desperdicio.
        </p>
      </div>
    </div>

    <div class="search-box">
      <span>⌕</span>

      <input
        v-model="search"
        type="text"
        placeholder="Buscar restaurante o comida..."
      />
    </div>

    <div class="section-header">
      <h2>Restaurantes disponibles</h2>
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

    <p
      v-else-if="filteredRestaurants.length === 0"
      class="status-message"
    >
      No hay restaurantes registrados todavía.
    </p>

    <div v-else class="restaurant-grid">
      <article
        v-for="restaurant in filteredRestaurants"
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
.home-page {
  padding: 32px;
}

.hero {
  min-height: 230px;
  padding: 42px;
  border-radius: 20px;
  background: linear-gradient(120deg, #ffffff, #eaf7ea);
  display: flex;
  align-items: center;
}

.hero h1 {
  margin: 0;
  font-size: 42px;
  line-height: 1.05;
  color: #14213d;
}

.hero h1 span {
  color: #208b3a;
}

.hero p {
  max-width: 520px;
  margin-top: 18px;
  color: #5d6778;
  line-height: 1.6;
}

.search-box {
  margin-top: -24px;
  margin-inline: 28px;
  min-height: 58px;
  padding: 0 20px;
  background: white;
  border: 1px solid #dfe5e2;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
}

.section-header {
  margin-top: 42px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  color: #14213d;
}

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