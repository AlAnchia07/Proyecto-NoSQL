<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="sidebar__brand-icon">
        B
      </div>

      <div>
        <h1>BiteUp</h1>
        <span>Restaurante</span>
      </div>
    </div>

    <nav class="sidebar__nav">
      <RouterLink
        v-if="esAdministrador"
        to="/restaurante/restaurantes"
        class="sidebar__link"
      >
        <Store
          :size="20"
          :stroke-width="1.8"
        />
        <span>Restaurantes</span>
      </RouterLink>

      <RouterLink
        to="/restaurante/productos"
        class="sidebar__link"
      >
        <Package
          :size="20"
          :stroke-width="1.8"
        />

        <span>Productos</span>
      </RouterLink>

      <RouterLink
        to="/restaurante/pedidos"
        class="sidebar__link"
      >
        <ClipboardList
          :size="20"
          :stroke-width="1.8"
        />

        <span>Pedidos</span>
      </RouterLink>

      <RouterLink
        to="/restaurante/reviews"
        class="sidebar__link"
      >
        <Star
          :size="20"
          :stroke-width="1.8"
        />

        <span>Reseñas</span>
      </RouterLink>

      <RouterLink
        v-if="esAdministrador"
        to="/restaurante/usuarios"
        class="sidebar__link"
      >
        <Users
          :size="20"
          :stroke-width="1.8"
        />
        <span>Usuarios</span>
      </RouterLink>

      <RouterLink
        to="/restaurante/perfil"
        class="sidebar__link"
      >
        <UserRound
          :size="20"
          :stroke-width="1.8"
        />

        <span>Perfil</span>
      </RouterLink>
    </nav>

    <button
      class="sidebar__logout"
      type="button"
      @click="cerrarSesion"
    >
      <LogOut
        :size="20"
        :stroke-width="1.8"
      />

      <span>Cerrar sesión</span>
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

import {
  ClipboardList,
  LogOut,
  Package,
  Star,
  Store,
  UserRound,
  Users
} from "lucide-vue-next";

import { useUsuarioStore } from "../../stores/UsuarioStore";
import { useRestauranteStore } from "../../stores/RestauranteStore";

const router = useRouter();

const usuarioStore = useUsuarioStore();
const restauranteStore = useRestauranteStore();
const esAdministrador = computed(() => {
  return usuarioStore.usuario?.rol === "RESTAURANTE";
});

function cerrarSesion() {
  usuarioStore.cerrarSesion();

  restauranteStore.limpiarRestauranteActivo();

  localStorage.removeItem("usuario");
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("tipo_usuario");
  localStorage.removeItem("nombre");
  localStorage.removeItem("id_cliente_temporal");

  router.replace("/login");
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  display: flex;
  width: 234px;
  flex-direction: column;
  padding: 24px 16px 20px;
  background: linear-gradient(
    180deg,
    #0b5635 0%,
    #08472d 100%
  );
  color: #ffffff;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 1px;
  margin-bottom: 34px;
}

.sidebar__brand-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background-color: #ffffff;
  color: #13713d;
  font-size: 20px;
  font-weight: 800;
}

.sidebar__brand h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 750;
}

.sidebar__brand span {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__link {
  display: flex;
  min-height: 50px;
  align-items: center;
  gap: 14px;
  padding: 0 16px;
  border-radius: 11px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.sidebar__link:hover {
  background-color: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.sidebar__link.router-link-active {
  background-color: #31984e;
  color: #ffffff;
  font-weight: 650;
}

.sidebar__logout {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.sidebar__logout:hover {
  color: #ffffff;
}
</style>