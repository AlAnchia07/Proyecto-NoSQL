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
import Sidebar from "../components/layout/Sidebar.vue";
import Topbar from "../components/layout/Topbar.vue";
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