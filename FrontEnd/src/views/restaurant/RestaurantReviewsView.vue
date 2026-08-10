<!-- Original
<template>
    <div>
        <h2><strong>Reseñas</strong></h2>
        <p>Visualiza las reseñas de tu restaurante</p>
        <ReviewList :mostrarFormulario="false" :idRestaurante="usuarioStore.perfil._id"/>
    </div>
    
</template>

<script setup>
    import ReviewList from "@/components/reviews/ReviewList.vue"
    import { useUsuarioStore } from "@/stores/UsuarioStore";
import { sr } from "date-fns/locale";

    const usuarioStore = useUsuarioStore();
    usuarioStore.simularLoginRestaurante();
</script>
-->

<!-- Nueva versión-->

<template>
  <div class="reviews-view">
    <h2>
      <strong>Reseñas</strong>
    </h2>

    <p class="reviews-view__description">
      Visualiza las reseñas de tu restaurante
    </p>

    <ReviewList
      v-if="restauranteStore.idRestauranteActivo"
      :mostrarFormulario="false"
      :idRestaurante="restauranteStore.idRestauranteActivo"
    />

    <div v-else class="empty-state">
      Selecciona primero el restaurante que deseas administrar.
    </div>
  </div>
</template>

<script setup>
import ReviewList from "@/components/reviews/ReviewList.vue";
import { useRestauranteStore } from "@/stores/RestauranteStore";

const restauranteStore = useRestauranteStore();
</script>

<style scoped>
.reviews-view {
  width: 100%;
}

.reviews-view h2 {
  margin: 0;
}

.reviews-view__description {
  margin: 7px 0 24px;
}

.empty-state {
  display: flex;
  min-height: 88px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  color: #d92d20;
  text-align: center;
}
</style>