<template>
  <div class="restaurant-layout">
    <Sidebar />

    <div class="restaurant-layout__content">
      <Topbar />

      <main class="restaurant-layout__main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

import Sidebar from "../components/layout/Sidebar.vue";
import Topbar from "../components/layout/Topbar.vue";

import { useUsuarioStore } from "../stores/UsuarioStore";
import { useRestauranteStore } from "../stores/RestauranteStore";

const usuarioStore = useUsuarioStore();
const restauranteStore = useRestauranteStore();

onMounted(() => {
  if (!usuarioStore.usuario) {
    usuarioStore.simularLoginAdministrador();
  }

  restauranteStore.cargarRestauranteGuardado();
});
</script>

<style scoped>
.restaurant-layout {
  min-height: 100vh;
  background-color: var(--background);
}

.restaurant-layout__content {
  min-height: 100vh;
  margin-left: 220px;
}

.restaurant-layout__main {
  padding: 30px 34px;
}
</style>