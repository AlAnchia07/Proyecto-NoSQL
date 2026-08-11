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

      <!-- 
      <RouterLink
        to="/cliente/explorar"
        class="client-sidebar__link"
        active-class="client-sidebar__link--active"
      >
        <Search class="client-sidebar__icon" />
        <span>Explorar</span>
      </RouterLink>
      -->

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

    <button
      class="client-sidebar__logout"
      type="button"
      @click="cerrarSesion"
    >
      <LogOut class="client-sidebar__icon" />
      <span>Cerrar sesión</span>
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";

import {
  Heart,
  House,
  LogOut,
  ReceiptText,
  //Search,
  UserRound
} from "lucide-vue-next";

import { useUsuarioStore } from "../../stores/UsuarioStore";
import { useRestauranteStore } from "../../stores/RestauranteStore";
import { useCartStore } from "../../stores/cartStore";

const router = useRouter();

const usuarioStore = useUsuarioStore();
const restauranteStore = useRestauranteStore();
const cartStore = useCartStore();

function cerrarSesion() {
  usuarioStore.cerrarSesion();

  restauranteStore.limpiarRestauranteActivo();
  cartStore.limpiarCarrito();

  localStorage.removeItem("usuario");
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("tipo_usuario");
  localStorage.removeItem("nombre");
  localStorage.removeItem("id_cliente_temporal");

  router.replace("/login");
}
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

.client-sidebar__link,
.client-sidebar__logout {
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

.client-sidebar__link:hover,
.client-sidebar__logout:hover {
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

.client-sidebar__logout {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

@media (max-width: 800px) {
  .client-sidebar {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 68px;
    flex-direction: row;
    border-top: 1px solid var(--border);
    border-right: 0;
  }

  .client-sidebar__nav {
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: row;
  }

  .client-sidebar__link {
    min-height: auto;
    flex: 1;
    gap: 3px;
  }

  .client-sidebar__logout {
    width: 72px;
    min-height: auto;
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
}
</style>