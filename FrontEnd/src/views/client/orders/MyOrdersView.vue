<template>
  <section class="orders-view">
    <div class="orders-view__header">
      <div>
        <h1>Mis pedidos</h1>
        <p>Consulta el estado y el historial de tus pedidos.</p>
      </div>
    </div>

    <div v-if="loading" class="orders-view__message">
      Cargando pedidos...
    </div>

    <div v-else-if="error" class="orders-view__message orders-view__message--error">
      {{ error }}
    </div>

    <div v-else-if="pedidos.length === 0" class="orders-view__message">
      Todavía no tienes pedidos registrados.
    </div>

    <div v-else class="orders-list">
      <article
        v-for="pedido in pedidos"
        :key="pedido._id"
        class="order-card"
      >
        <div class="order-card__top">
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
            <span>Entrega</span>
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
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPedidosCliente } from "../../../services/pedidoService";

const pedidos = ref([]);
const loading = ref(true);
const error = ref("");

const idClienteTemporal = "6884a7d8e2d31d8c9b6a0001";

async function cargarPedidos() {
  try {
    loading.value = true;
    error.value = "";

    pedidos.value = await getPedidosCliente(idClienteTemporal);
  } catch (err) {
    console.error(err);
    error.value = "No fue posible cargar los pedidos.";
  } finally {
    loading.value = false;
  }
}

function formatearMonto(monto) {
  return Number(monto || 0).toLocaleString("es-CR");
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CR", {
    dateStyle: "medium",
    timeStyle: "short"
  });
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
    ENTREGA_A_DOMICILIO: "Entrega a domicilio"
  };

  return tipos[tipoEntrega] || tipoEntrega;
}

function getEstadoClase(estado) {
  return `order-card__status--${estado.toLowerCase()}`;
}

onMounted(cargarPedidos);
</script>

<style scoped>
.orders-view {
  width: 100%;
}

.orders-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
}

.orders-view h1 {
  margin: 0;
  color: #172033;
  font-size: 30px;
}

.orders-view__header p {
  margin: 7px 0 0;
  color: var(--text-muted);
}

.orders-view__message {
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: #ffffff;
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
  padding: 26px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.order-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.order-card__label {
  color: var(--text-muted);
  font-size: 13px;
}

.order-card h2 {
  margin: 4px 0 0;
  color: #172033;
  font-size: 20px;
}

.order-card__status {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
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
  color: #172033;
  font-size: 14px;
}

.order-card__products {
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.order-card__products h3 {
  margin: 0 0 14px;
  color: #172033;
  font-size: 15px;
}

.order-product {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 9px 0;
  color: #45505d;
  font-size: 14px;
}

.order-product strong {
  color: #172033;
}

@media (max-width: 700px) {
  .order-card__info {
    grid-template-columns: 1fr;
  }

  .order-card__top {
    flex-direction: column;
  }
}
</style>