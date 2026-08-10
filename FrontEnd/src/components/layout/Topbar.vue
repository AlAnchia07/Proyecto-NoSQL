<template>
  <header class="topbar">
    <div>
      <h2>{{ titulo }}</h2>
    </div>

    <div class="topbar__actions">
      <NotificationBell
        rutaNotificaciones="/restaurante/notificaciones"
      />

      <div class="topbar__user">
        <div class="topbar__avatar">
          {{ iniciales }}
        </div>

        <div class="topbar__user-info">
          <strong>{{ nombreUsuario }}</strong>
          <span>{{ rolUsuario }}</span>
        </div>

        <ChevronDown
          class="topbar__arrow"
          :size="16"
          :stroke-width="1.8"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ChevronDown } from "lucide-vue-next";

import NotificationBell from "../notifications/NotificationBell.vue";
import { useUsuarioStore } from "../../stores/UsuarioStore";

const route = useRoute();
const usuarioStore = useUsuarioStore();

const titulo = computed(() => {
  return route.meta.title || "BiteUp";
});

const nombreUsuario = computed(() => {
  return usuarioStore.usuario?.nombre || "Usuario";
});

const rolUsuario = computed(() => {
  const rol = usuarioStore.usuario?.rol;

  const roles = {
    RESTAURANTE: "Administrador",
    EMPLEADO: "Empleado",
    CLIENTE: "Cliente"
  };

  return roles[rol] || rol || "";
});

const iniciales = computed(() => {
  const nombre = nombreUsuario.value.trim();

  if (!nombre) {
    return "U";
  }

  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
});
</script>

<style scoped>
.topbar {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border);
}

.topbar h2 {
  margin: 0;
  color: var(--text-main);
  font-size: 21px;
  font-weight: 700;
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.topbar__notification {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: #26352d;
  cursor: pointer;
}

.topbar__notification:hover {
  background-color: #eef6f0;
  color: var(--green-main);
}

.topbar__arrow {
  color: #6b7280;
}

.topbar__user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar__avatar {
  display: grid;
  width: 39px;
  height: 39px;
  place-items: center;
  border-radius: 50%;
  background-color: #dcefdc;
  color: #176535;
  font-size: 12px;
  font-weight: 750;
}

.topbar__user-info strong,
.topbar__user-info span {
  display: block;
}

.topbar__user-info strong {
  color: var(--text-main);
  font-size: 14px;
}

.topbar__user-info span {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12px;
}
</style>