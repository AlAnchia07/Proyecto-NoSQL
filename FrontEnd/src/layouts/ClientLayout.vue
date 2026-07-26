<template>
  <div class="client-layout">
    <ClientNavbar />
    <ClientSidebar />

    <main class="client-layout__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import ClientNavbar from "../components/layout/ClientNavbar.vue";
import ClientSidebar from "../components/layout/ClientSidebar.vue";
</script>

<style scoped>
.client-layout {
  min-height: 100vh;
  background-color: #f5f7f5;
}

.client-layout__content {
  min-height: 100vh;
  padding: 130px 40px 40px 120px;
}

@media (max-width: 800px) {
  .client-layout__content {
    padding: 100px 20px 94px;
  }
}
</style>