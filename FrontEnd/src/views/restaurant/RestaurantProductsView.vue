<template>
  <section class="products-view">
    <div class="products-view__heading">
      <div>
        <h1>Productos</h1>
        <p>
          Administra los productos disponibles en tu restaurante.
        </p>
      </div>

      <button
        class="primary-button"
        type="button"
        @click="abrirFormularioCrear"
      >
        <Plus :size="19" />
        Agregar producto
      </button>
    </div>

    <div class="products-toolbar">
      <div class="search-box">
        <Search :size="19" />

        <input
          v-model.trim="busqueda"
          type="search"
          placeholder="Buscar por nombre o categoría..."
        />
      </div>

      <select v-model="filtroEstado">
        <option value="TODOS">Todos los estados</option>
        <option value="ACTIVO">Activos</option>
        <option value="AGOTADO">Agotados</option>
        <option value="INACTIVO">Inactivos</option>
      </select>

      <button
        class="secondary-button"
        type="button"
        :disabled="loading"
        @click="cargarProductos"
      >
        <RefreshCw :size="18" />
        {{ loading ? "Actualizando..." : "Actualizar" }}
      </button>
    </div>

    <div
      v-if="mensajeExito"
      class="alert alert--success"
    >
      {{ mensajeExito }}
    </div>

    <div
      v-if="error"
      class="alert alert--error"
    >
      {{ error }}
    </div>

    <div v-if="loading" class="products-message">
      Cargando productos...
    </div>

    <div
      v-else-if="productosFiltrados.length === 0"
      class="products-message"
    >
      No se encontraron productos.
    </div>

    <div v-else class="products-grid">
      <article
        v-for="producto in productosFiltrados"
        :key="producto._id"
        class="product-card"
      >
        <div class="product-card__image">
          <img
            v-if="producto.url_imagen"
            :src="producto.url_imagen"
            :alt="producto.nombre"
            @error="ocultarImagen"
          />

          <div v-else class="product-card__placeholder">
            <ImageIcon :size="34" />
          </div>

          <span
            class="product-card__status"
            :class="getEstadoClase(producto.estado)"
          >
            {{ formatearEstado(producto.estado) }}
          </span>
        </div>

        <div class="product-card__body">
          <span class="product-card__category">
            {{ producto.id_categoria?.nombre || "Sin categoría" }}
          </span>

          <h2>{{ producto.nombre }}</h2>

          <p class="product-card__description">
            {{ producto.descripcion }}
          </p>

          <div class="product-card__prices">
            <span class="product-card__original-price">
              ₡{{ formatearMonto(producto.precio_original) }}
            </span>

            <strong>
              ₡{{ formatearMonto(producto.precio_descuento) }}
            </strong>
          </div>

          <div class="product-card__details">
            <span>
              Cantidad:
              <strong>{{ producto.cantidad_disponible }}</strong>
            </span>

            <span>
              Vence:
              <strong>
                {{ formatearFecha(producto.fecha_vencimiento) }}
              </strong>
            </span>
          </div>

          <div class="product-card__actions">
            <button
              type="button"
              class="edit-button"
              :disabled="producto.estado === 'INACTIVO'"
              @click="abrirFormularioEditar(producto)"
            >
              <Pencil :size="17" />
              Editar
            </button>

            <button
              type="button"
              class="delete-button"
              :disabled="
                producto.estado === 'INACTIVO' ||
                producto.desactivando
              "
              @click="confirmarDesactivacion(producto)"
            >
              <Trash2 :size="17" />
              {{
                producto.desactivando
                  ? "Desactivando..."
                  : "Desactivar"
              }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div
      v-if="mostrarFormulario"
      class="modal-backdrop"
      @click.self="cerrarFormulario"
    >
      <div class="product-modal">
        <div class="product-modal__header">
          <div>
            <h2>
              {{
                productoEditando
                  ? "Editar producto"
                  : "Agregar producto"
              }}
            </h2>

            <p>
              Completa la información solicitada.
            </p>
          </div>

          <button
            type="button"
            class="icon-button"
            aria-label="Cerrar formulario"
            @click="cerrarFormulario"
          >
            <X :size="21" />
          </button>
        </div>

        <form
          class="product-form"
          @submit.prevent="guardarProducto"
        >
          <div class="form-field form-field--full">
            <label for="nombre">Nombre del producto</label>

            <input
              id="nombre"
              v-model.trim="formulario.nombre"
              type="text"
              maxlength="100"
              required
            />
          </div>

          <div class="form-field form-field--full">
            <label for="descripcion">Descripción</label>

            <textarea
              id="descripcion"
              v-model.trim="formulario.descripcion"
              rows="3"
              maxlength="500"
              required
            />
          </div>

          <div class="form-field">
            <label for="categoria">Categoría</label>

            <select
              id="categoria"
              v-model="formulario.id_categoria"
              required
            >
              <option disabled value="">
                Selecciona una categoría
              </option>

              <option
                v-for="categoria in categorias"
                :key="categoria._id"
                :value="categoria._id"
              >
                {{ categoria.nombre }}
              </option>
            </select>
          </div>

          <div class="form-field">
            <label for="cantidad">
              Cantidad disponible
            </label>

            <input
              id="cantidad"
              v-model.number="formulario.cantidad_disponible"
              type="number"
              min="0"
              step="1"
              required
            />
          </div>

          <div class="form-field">
            <label for="precioOriginal">
              Precio original
            </label>

            <input
              id="precioOriginal"
              v-model.number="formulario.precio_original"
              type="number"
              min="0"
              step="1"
              required
            />
          </div>

          <div class="form-field">
            <label for="precioDescuento">
              Precio con descuento
            </label>

            <input
              id="precioDescuento"
              v-model.number="formulario.precio_descuento"
              type="number"
              min="0"
              step="1"
              required
            />
          </div>

          <div class="form-field">
            <label for="fechaDisponibilidad">
              Fecha de disponibilidad
            </label>

            <input
              id="fechaDisponibilidad"
              v-model="formulario.fecha_disponibilidad"
              type="datetime-local"
              required
            />
          </div>

          <div class="form-field">
            <label for="fechaVencimiento">
              Fecha de vencimiento
            </label>

            <input
              id="fechaVencimiento"
              v-model="formulario.fecha_vencimiento"
              type="datetime-local"
              required
            />
          </div>

          <div class="form-field form-field--full">
            <label for="imagen">URL de la imagen</label>

            <input
              id="imagen"
              v-model.trim="formulario.url_imagen"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div
            v-if="errorFormulario"
            class="form-error form-field--full"
          >
            {{ errorFormulario }}
          </div>

          <div class="product-form__actions form-field--full">
            <button
              type="button"
              class="secondary-button"
              :disabled="guardando"
              @click="cerrarFormulario"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="primary-button"
              :disabled="guardando"
            >
              {{
                guardando
                  ? "Guardando..."
                  : productoEditando
                    ? "Guardar cambios"
                    : "Crear producto"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-vue-next";

import { getCategoriasPorTipo } from "../../services/categoriaService";
import {
  crearProducto,
  desactivarProducto,
  editarProducto,
  getProductosPorRestaurante
} from "../../services/productoService";

const productos = ref([]);
const categorias = ref([]);
const loading = ref(true);
const guardando = ref(false);
const error = ref("");
const errorFormulario = ref("");
const mensajeExito = ref("");
const busqueda = ref("");
const filtroEstado = ref("TODOS");
const mostrarFormulario = ref(false);
const productoEditando = ref(null);

/*
 * Reemplaza este valor por el _id real del restaurante
 * que creaste en MongoDB.
 */
const idRestauranteTemporal = "6a666c9eaa03eadb7870e707";

const formularioInicial = () => ({
  nombre: "",
  descripcion: "",
  id_categoria: "",
  precio_original: null,
  precio_descuento: null,
  cantidad_disponible: 1,
  url_imagen: "",
  fecha_disponibilidad: "",
  fecha_vencimiento: ""
});

const formulario = reactive(formularioInicial());

const productosFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase();

  return productos.value.filter((producto) => {
    const coincideEstado =
      filtroEstado.value === "TODOS" ||
      producto.estado === filtroEstado.value;

    const nombreCategoria =
      producto.id_categoria?.nombre?.toLowerCase() || "";

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(termino) ||
      nombreCategoria.includes(termino);

    return coincideEstado && coincideBusqueda;
  });
});

async function cargarDatos() {
  await Promise.all([
    cargarProductos(),
    cargarCategorias()
  ]);
}

async function cargarProductos() {
  try {
    loading.value = true;
    error.value = "";

    productos.value =
      await getProductosPorRestaurante(
        idRestauranteTemporal,
        true
      );

    productos.value = productos.value.map((producto) => ({
      ...producto,
      desactivando: false
    }));
  } catch (err) {
    console.error(err);

    error.value =
      obtenerMensajeError(
        err,
        "No fue posible cargar los productos."
      );
  } finally {
    loading.value = false;
  }
}

async function cargarCategorias() {
  try {
    categorias.value =
      await getCategoriasPorTipo("PRODUCTO");
  } catch (err) {
    console.error(err);

    error.value =
      obtenerMensajeError(
        err,
        "No fue posible cargar las categorías."
      );
  }
}

function abrirFormularioCrear() {
  productoEditando.value = null;
  Object.assign(formulario, formularioInicial());

  formulario.fecha_disponibilidad =
    convertirFechaParaInput(new Date());

  mostrarFormulario.value = true;
  errorFormulario.value = "";
}

function abrirFormularioEditar(producto) {
  productoEditando.value = producto;

  Object.assign(formulario, {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    id_categoria:
      producto.id_categoria?._id ||
      producto.id_categoria,
    precio_original: producto.precio_original,
    precio_descuento: producto.precio_descuento,
    cantidad_disponible:
      producto.cantidad_disponible,
    url_imagen: producto.url_imagen || "",
    fecha_disponibilidad:
      convertirFechaParaInput(
        producto.fecha_disponibilidad
      ),
    fecha_vencimiento:
      convertirFechaParaInput(
        producto.fecha_vencimiento
      )
  });

  mostrarFormulario.value = true;
  errorFormulario.value = "";
}

function cerrarFormulario() {
  if (guardando.value) {
    return;
  }

  mostrarFormulario.value = false;
  productoEditando.value = null;
  errorFormulario.value = "";
}

async function guardarProducto() {
  try {
    guardando.value = true;
    errorFormulario.value = "";
    mensajeExito.value = "";

    validarFormulario();

    const datosProducto = {
      id_categoria: formulario.id_categoria,
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio_original: Number(
        formulario.precio_original
      ),
      precio_descuento: Number(
        formulario.precio_descuento
      ),
      cantidad_disponible: Number(
        formulario.cantidad_disponible
      ),
      url_imagen: formulario.url_imagen,
      fecha_disponibilidad: new Date(
        formulario.fecha_disponibilidad
      ).toISOString(),
      fecha_vencimiento: new Date(
        formulario.fecha_vencimiento
      ).toISOString()
    };

    if (productoEditando.value) {
      await editarProducto(
        productoEditando.value._id,
        datosProducto
      );

      mensajeExito.value =
        "Producto actualizado correctamente.";
    } else {
      await crearProducto({
        ...datosProducto,
        id_restaurante: idRestauranteTemporal
      });

      mensajeExito.value =
        "Producto creado correctamente.";
    }

    cerrarFormulario();
    await cargarProductos();
  } catch (err) {
    console.error(err);

    errorFormulario.value =
      obtenerMensajeError(
        err,
        "No fue posible guardar el producto."
      );
  } finally {
    guardando.value = false;
  }
}

async function confirmarDesactivacion(producto) {
  const confirmado = window.confirm(
    `¿Deseas desactivar el producto "${producto.nombre}"?`
  );

  if (!confirmado) {
    return;
  }

  try {
    producto.desactivando = true;
    error.value = "";
    mensajeExito.value = "";

    await desactivarProducto(producto._id);

    mensajeExito.value =
      "Producto desactivado correctamente.";

    await cargarProductos();
  } catch (err) {
    console.error(err);

    error.value =
      obtenerMensajeError(
        err,
        "No fue posible desactivar el producto."
      );
  } finally {
    producto.desactivando = false;
  }
}

function validarFormulario() {
  if (
    Number(formulario.precio_descuento) >
    Number(formulario.precio_original)
  ) {
    throw new Error(
      "El precio con descuento no puede ser mayor al precio original."
    );
  }

  if (
    new Date(formulario.fecha_vencimiento) <=
    new Date(formulario.fecha_disponibilidad)
  ) {
    throw new Error(
      "La fecha de vencimiento debe ser posterior a la fecha de disponibilidad."
    );
  }
}

function obtenerMensajeError(err, mensajePredeterminado) {
  return (
    err.response?.data?.mensaje ||
    err.message ||
    mensajePredeterminado
  );
}

function formatearMonto(monto) {
  return Number(monto || 0).toLocaleString("es-CR");
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  return new Date(fecha).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatearEstado(estado) {
  const estados = {
    ACTIVO: "Activo",
    AGOTADO: "Agotado",
    INACTIVO: "Inactivo"
  };

  return estados[estado] || estado;
}

function getEstadoClase(estado) {
  return `product-card__status--${estado.toLowerCase()}`;
}

function convertirFechaParaInput(fecha) {
  if (!fecha) {
    return "";
  }

  const fechaLocal = new Date(fecha);
  const diferenciaZona =
    fechaLocal.getTimezoneOffset() * 60000;

  return new Date(
    fechaLocal.getTime() - diferenciaZona
  )
    .toISOString()
    .slice(0, 16);
}

function ocultarImagen(event) {
  event.target.style.display = "none";
}

onMounted(cargarDatos);
</script>

<style scoped>
.products-view {
  width: 100%;
}

.products-view__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.products-view__heading h1 {
  margin: 0;
  font-size: 29px;
  font-weight: 750;
}

.products-view__heading p {
  margin: 7px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.primary-button,
.secondary-button,
.edit-button,
.delete-button,
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font: inherit;
}

.primary-button {
  min-height: 43px;
  padding: 0 16px;
  border-radius: 10px;
  background-color: var(--green-main);
  color: #ffffff;
  font-weight: 650;
}

.secondary-button {
  min-height: 43px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--surface);
  color: var(--text-main);
  font-weight: 600;
}

.primary-button:disabled,
.secondary-button:disabled,
.edit-button:disabled,
.delete-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.products-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  min-height: 44px;
  flex: 1;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--surface);
  color: var(--text-muted);
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-main);
  font: inherit;
}

.products-toolbar select {
  min-height: 44px;
  padding: 0 38px 0 13px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--surface);
  color: var(--text-main);
}

.alert {
  margin-bottom: 18px;
  padding: 13px 15px;
  border-radius: 10px;
  font-size: 14px;
}

.alert--success {
  background-color: #e9f8ee;
  color: #146c37;
}

.alert--error {
  background-color: #fef0ef;
  color: #b42318;
}

.products-message {
  padding: 34px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  color: var(--text-muted);
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
}

.product-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  box-shadow: 0 8px 24px rgba(15, 77, 47, 0.06);
}

.product-card__image {
  position: relative;
  height: 175px;
  background-color: #edf3ef;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #7a9184;
}

.product-card__status {
  position: absolute;
  top: 13px;
  right: 13px;
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.product-card__status--activo {
  background-color: #e6f7ec;
  color: #16723b;
}

.product-card__status--agotado {
  background-color: #fff4d6;
  color: #8a6500;
}

.product-card__status--inactivo {
  background-color: #edf1f4;
  color: #5a6570;
}

.product-card__body {
  padding: 19px;
}

.product-card__category {
  color: var(--green-main);
  font-size: 12px;
  font-weight: 700;
}

.product-card__body h2 {
  margin: 7px 0;
  font-size: 19px;
}

.product-card__description {
  display: -webkit-box;
  min-height: 42px;
  margin: 0;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card__prices {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin-top: 17px;
}

.product-card__prices strong {
  color: var(--green-main);
  font-size: 20px;
}

.product-card__original-price {
  color: var(--text-muted);
  font-size: 13px;
  text-decoration: line-through;
}

.product-card__details {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 13px;
}

.product-card__details strong {
  color: var(--text-main);
}

.product-card__actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.edit-button,
.delete-button {
  min-height: 39px;
  flex: 1;
  border-radius: 9px;
  font-weight: 650;
}

.edit-button {
  background-color: #e8f5ec;
  color: #146c37;
}

.delete-button {
  background-color: #fef0ef;
  color: #b42318;
}

.modal-backdrop {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background-color: rgba(20, 29, 24, 0.54);
}

.product-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 17px;
  background-color: #ffffff;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.2);
}

.product-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 26px 19px;
  border-bottom: 1px solid var(--border);
}

.product-modal__header h2 {
  margin: 0;
}

.product-modal__header p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.icon-button {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 9px;
  background-color: #f1f4f2;
  color: var(--text-main);
}

.product-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
  padding: 24px 26px 26px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 13px;
  font-weight: 650;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 9px;
  background-color: #ffffff;
  color: var(--text-main);
  font: inherit;
}

.form-field input,
.form-field select {
  min-height: 43px;
  padding: 0 12px;
}

.form-field textarea {
  padding: 11px 12px;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: var(--green-main);
  outline: 2px solid rgba(49, 152, 78, 0.15);
}

.form-error {
  padding: 11px 13px;
  border-radius: 9px;
  background-color: #fef0ef;
  color: #b42318;
  font-size: 13px;
}

.product-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 11px;
  margin-top: 5px;
}

@media (max-width: 760px) {
  .products-view__heading,
  .products-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .product-form {
    grid-template-columns: 1fr;
  }

  .form-field--full {
    grid-column: auto;
  }
}
</style>