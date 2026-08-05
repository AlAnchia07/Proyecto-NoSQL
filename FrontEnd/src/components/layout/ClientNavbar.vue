<template>
  <header class="client-navbar">
    <div class="client-navbar__brand">
      <div class="client-navbar__logo">
        <ShoppingBasket />
      </div>

      <span>Bite<span class="client-navbar__brand-accent">Up</span></span>
    </div>

    <div class="client-navbar__actions">
      <NotificationBell 
        rutaNotificaciones="/cliente/notificaciones"
      />

      <button type="button" class="client-navbar__profile">
        <div class="client-navbar__avatar">
          S
        </div>

        <span>Hola, Sofía</span>

        <ChevronDown />
      </button>
    </div>
  </header>
</template>

<script setup>
import {
  ChevronDown,
  ShoppingBasket
} from "lucide-vue-next";
import NotificationBell from "../notifications/NotificationBell.vue";
</script>

<style scoped>
.client-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 30;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border);
}

.client-navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--green-dark);
  font-size: 27px;
  font-weight: 800;
}

.client-navbar__brand-accent {
  color: #f3a623;
}

.client-navbar__logo {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 2px solid var(--green-main);
  border-radius: 50%;
  color: var(--green-main);
}

.client-navbar__logo svg {
  width: 23px;
  height: 23px;
}

.client-navbar__actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.client-navbar__icon-button,
.client-navbar__profile {
  border: 0;
  background: transparent;
  color: #24313c;
  cursor: pointer;
}

.client-navbar__icon-button {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
}

.client-navbar__icon-button:hover {
  background-color: #f3f6f4;
}

.client-navbar__icon-button svg {
  width: 20px;
  height: 20px;
}

.client-navbar__profile {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
}

.client-navbar__profile > svg {
  width: 16px;
  height: 16px;
}

.client-navbar__avatar {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background-color: #f5dfc8;
  color: #75451d;
  font-weight: 800;
}

@media (max-width: 620px) {
  .client-navbar {
    padding: 0 16px;
  }

  .client-navbar__profile span {
    display: none;
  }

  .client-navbar__brand {
    font-size: 23px;
  }
}
</style>