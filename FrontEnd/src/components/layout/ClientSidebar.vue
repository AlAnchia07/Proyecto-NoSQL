<template>
  <aside class="client-sidebar">
    <nav class="client-sidebar__nav">
      <RouterLink
        to="/cliente"
        class="client-sidebar__link"
        active-class=""
        exact-active-class="client-sidebar__link--active"
      >
        <House class="client-sidebar__icon" />
        <span>Inicio</span>
      </RouterLink>

      <RouterLink
        to="/cliente/explorar"
        class="client-sidebar__link"
        active-class="client-sidebar__link--active"
      >
        <Search class="client-sidebar__icon" />
        <span>Explorar</span>
      </RouterLink>

      <RouterLink
        to="/cliente/favoritos"
        class="client-sidebar__link"
        active-class="client-sidebar__link--active"
      >
        <Heart class="client-sidebar__icon" />
        <span>Favoritos</span>
      </RouterLink>

      <RouterLink
        to="/cliente/mis-pedidos"
        class="client-sidebar__link"
        active-class="client-sidebar__link--active"
      >
        <ReceiptText class="client-sidebar__icon" />
        <span>Mis pedidos</span>
      </RouterLink>

      <RouterLink
        to="/cliente/perfil"
        class="client-sidebar__link"
        active-class="client-sidebar__link--active"
      >
        <UserRound class="client-sidebar__icon" />
        <span>Perfil</span>
      </RouterLink>
    </nav>

    <div class="client-sidebar__decoration">
      <Leaf />
    </div>
  </aside>
</template>

<script setup>
import {
  Heart,
  House,
  Leaf,
  ReceiptText,
  Search,
  UserRound
} from "lucide-vue-next";
</script>

<style scoped>
.client-sidebar {
  position: fixed;
  top: 76px;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  width: 92px;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border-right: 1px solid var(--border);
}

.client-sidebar__nav {
  display: flex;
  flex-direction: column;
}

.client-sidebar__link {
  position: relative;
  display: flex;
  min-height: 82px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  color: #5d6671;
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.client-sidebar__link:hover {
  background-color: #f3f8f4;
  color: var(--green-main);
}

.client-sidebar__link--active {
  background-color: #edf7ef;
  color: var(--green-main);
  font-weight: 700;
}

.client-sidebar__link--active::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background-color: var(--green-main);
  content: "";
}

.client-sidebar__icon {
  width: 22px;
  height: 22px;
}

.client-sidebar__decoration {
  display: grid;
  height: 70px;
  place-items: center;
  color: var(--green-main);
}

.client-sidebar__decoration svg {
  width: 25px;
  height: 25px;
}

@media (max-width: 800px) {
  .client-sidebar {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 68px;
    border-top: 1px solid var(--border);
    border-right: 0;
  }

  .client-sidebar__nav {
    height: 100%;
    flex-direction: row;
  }

  .client-sidebar__link {
    min-height: auto;
    flex: 1;
    gap: 3px;
  }

  .client-sidebar__link--active::before {
    top: 0;
    right: 18px;
    bottom: auto;
    left: 18px;
    width: auto;
    height: 3px;
  }

  .client-sidebar__decoration {
    display: none;
  }
}
</style>