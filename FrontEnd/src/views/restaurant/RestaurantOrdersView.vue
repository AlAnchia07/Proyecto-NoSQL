<template>
  <section class="orders-view">
    <div class="orders-view__heading">
      <div>
        <h1>Pedidos</h1>
        <p>Administra y da seguimiento a los pedidos recibidos.</p>
      </div>

      <button
        type="button"
        :disabled="loading"
        @click="cargarPedidos"
      >
        {{ loading ? "Actualizando..." : "Actualizar pedidos" }}
      </button>
    </div>

    <div v-if="loading" class="orders-view__message">
      Cargando pedidos...
    </div>

    <div
      v-else-if="error"
      class="orders-view__message orders-view__message--error"
    >
      {{ error }}
    </div>

    <div v-else-if="pedidos.length === 0" class="orders-view__message">
      No hay pedidos registrados para este restaurante.
    </div>

    <div v-else class="orders-list">
      <article
        v-for="pedido in pedidos"
        :key="pedido._id"
        class="order-card"
      >
        <div class="order-card__header">
          <div>
            <span class="order-card__label">Pedido</span>
            <h2>#{{ pedido._id.slice(-6).toUpperCase() }}</h2>
          </div>

          <span
            class="order-card__status"
            :class="getEstadoClase(pedido.estado)"
          >
            {{ formatearEstado(pedido.estado) }}
          </span>
        </div>

        <div class="order-card__info">
          <div>
            <span>Fecha</span>
            <strong>{{ formatearFecha(pedido.fecha_hora) }}</strong>
          </div>

          <div>
            <span>Tipo de entrega</span>
            <strong>{{ formatearEntrega(pedido.tipo_entrega) }}</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>₡{{ formatearMonto(pedido.total) }}</strong>
          </div>
        </div>

        <div class="order-card__products">
          <h3>Productos</h3>

          <div
            v-for="producto in pedido.productos_comprados"
            :key="producto.id_producto"
            class="order-product"
          >
            <span>
              {{ producto.cantidad }} × {{ producto.nombre }}
            </span>

            <strong>
              ₡{{ formatearMonto(producto.subtotal) }}
            </strong>
          </div>
        </div>

        <div class="order-card__actions">
          <label :for="`estado-${pedido._id}`">
            Cambiar estado
          </label>

          <select
            :id="`estado-${pedido._id}`"
            :value="pedido.estado"
            :disabled="pedido.actualizando"
            @change="actualizarEstado(pedido, $event.target.value)"
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="PREPARANDO">Preparando</option>
            <option value="LISTO_PARA_RETIRAR">
              Listo para retirar
            </option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useRestauranteStore } from "../../stores/RestauranteStore";

import {
  cambiarEstadoPedido,
  getPedidosRestaurante
} from "../../services/pedidoService";

const restauranteStore = useRestauranteStore();

const pedidos = ref([]);
const loading = ref(true);
const error = ref("");

async function cargarPedidos() {
  try {
    loading.value = true;
    error.value = "";

    if (!restauranteStore.hayRestauranteActivo) {
      restauranteStore.cargarRestauranteGuardado();
    }

    const idRestaurante =
      restauranteStore.idRestauranteActivo;

    if (!idRestaurante) {
      throw new Error(
        "Selecciona primero el restaurante que deseas administrar."
      );
    }

    const resultado =
      await getPedidosRestaurante(idRestaurante);

    pedidos.value = resultado.map((pedido) => ({
      ...pedido,
      actualizando: false
    }));
  } catch (err) {
    console.error(
      "Error al cargar los pedidos:",
      err
    );

    error.value =
      err.message ||
      "No fue posible cargar los pedidos.";
  } finally {
    loading.value = false;
  }
}

async function actualizarEstado(
  pedido,
  nuevoEstado
) {
  const estadoAnterior = pedido.estado;

  try {
    pedido.actualizando = true;
    error.value = "";

    const pedidoActualizado =
      await cambiarEstadoPedido(
        pedido._id,
        nuevoEstado
      );

    pedido.estado =
      pedidoActualizado.estado;
  } catch (err) {
    console.error(
      "Error al actualizar el estado del pedido:",
      err
    );

    pedido.estado = estadoAnterior;

    error.value =
      "No fue posible actualizar el estado del pedido.";
  } finally {
    pedido.actualizando = false;
  }
}

function formatearMonto(monto) {
  return Number(
    monto || 0
  ).toLocaleString("es-CR");
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Fecha no disponible";
  }

  return new Date(fecha).toLocaleString(
    "es-CR",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );
}

function formatearEstado(estado) {
  const estados = {
    PENDIENTE: "Pendiente",
    PREPARANDO: "Preparando",
    LISTO_PARA_RETIRAR: "Listo para retirar",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado"
  };

  return estados[estado] || estado;
}

function formatearEntrega(tipoEntrega) {
  const tipos = {
    RETIRO_EN_LOCAL: "Retiro en el local",
    EXPRESS: "Entrega express"
  };

  return tipos[tipoEntrega] || tipoEntrega;
}

function getEstadoClase(estado) {
  if (!estado) {
    return "";
  }

  return `order-card__status--${estado.toLowerCase()}`;
}

onMounted(() => {
  restauranteStore.cargarRestauranteGuardado();
  cargarPedidos();
});
</script>

<style scoped>
.orders-view {
  width: 100%;
}

.orders-view__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.orders-view__heading h1 {
  margin: 0;
  font-size: 29px;
  font-weight: 750;
}

.orders-view__heading p {
  margin: 7px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.orders-view__heading button {
  padding: 11px 16px;
  border: none;
  border-radius: 10px;
  background-color: var(--green-main);
  color: #ffffff;
  cursor: pointer;
  font-weight: 650;
}

.orders-view__heading button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.orders-view__message {
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  color: var(--text-muted);
  text-align: center;
}

.orders-view__message--error {
  color: #b42318;
}

.orders-list {
  display: grid;
  gap: 22px;
}

.order-card {
  padding: 25px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  box-shadow: 0 8px 24px rgba(15, 77, 47, 0.06);
}

.order-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.order-card__label {
  color: var(--text-muted);
  font-size: 12px;
}

.order-card__header h2 {
  margin: 4px 0 0;
  font-size: 20px;
}

.order-card__status {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  padding: 0 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.order-card__status--pendiente {
  background-color: #fff7d6;
  color: #8a6500;
}

.order-card__status--preparando {
  background-color: #e8f1ff;
  color: #2057a6;
}

.order-card__status--listo_para_retirar {
  background-color: #e8f7ed;
  color: #16723b;
}

.order-card__status--entregado {
  background-color: #edf1f4;
  color: #46515d;
}

.order-card__status--cancelado {
  background-color: #fdecec;
  color: #b42318;
}

.order-card__info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  padding: 22px 0;
}

.order-card__info div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-card__info span {
  color: var(--text-muted);
  font-size: 12px;
}

.order-card__info strong {
  font-size: 14px;
}

.order-card__products {
  padding: 18px 0;
  border-top: 1px solid var(--border);
}

.order-card__products h3 {
  margin: 0 0 12px;
  font-size: 15px;
}

.order-product {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0;
  font-size: 14px;
}

.order-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.order-card__actions label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

.order-card__actions select {
  min-width: 190px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background-color: #ffffff;
  color: #172033;
  cursor: pointer;
  font: inherit;
}

.order-card__actions select:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 700px) {
  .orders-view__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-card__header {
    flex-direction: column;
  }

  .order-card__info {
    grid-template-columns: 1fr;
  }

  .order-card__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .order-card__actions select {
    width: 100%;
  }
}
</style>