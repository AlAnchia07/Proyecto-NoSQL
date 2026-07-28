<template>
  <section class="restaurants-view">
    <div class="restaurants-view__heading">
      <div>
        <h1>Restaurantes</h1>

        <p>
          Administra los restaurantes asociados a tu cuenta.
        </p>
      </div>
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

    <div v-if="loading" class="empty-state">
      Cargando restaurantes...
    </div>

    <div v-else class="restaurants-grid">
      <article
        v-for="restaurante in restaurantes"
        :key="restaurante._id"
        class="restaurant-card"
        :class="{
          'restaurant-card--selected':
            restauranteStore.idRestauranteActivo ===
            restaurante._id
        }"
      >
        <div class="restaurant-card__image">
          <img
            v-if="restaurante.url_imagen"
            :src="restaurante.url_imagen"
            :alt="restaurante.nombre"
          />

          <Store v-else :size="42" />
        </div>

        <div class="restaurant-card__body">
          <span class="restaurant-card__status">
            {{ formatearEstado(restaurante.estado) }}
          </span>

          <h2>{{ restaurante.nombre }}</h2>

          <p>{{ restaurante.direccion }}</p>

          <small>
            {{
              restaurante.id_categoria?.nombre ||
              "Sin categoría"
            }}
          </small>

          <div class="restaurant-card__actions">
            <button
              class="primary-button"
              type="button"
              @click="seleccionarRestaurante(restaurante)"
            >
              {{
                restauranteStore.idRestauranteActivo ===
                restaurante._id
                  ? "Seleccionado"
                  : "Administrar"
              }}
            </button>

            <button
                class="secondary-button"
                type="button"
                @click="irAEditarRestaurante(restaurante)"
            >
                Gestionar
            </button>
          </div>
        </div>
      </article>

      <button
        class="restaurant-card restaurant-card--create"
        type="button"
        @click="abrirCreacion"
      >
        <Plus :size="42" />

        <strong>Crear nuevo restaurante</strong>

        <span>
          Agrega otro restaurante a tu cuenta.
        </span>
      </button>
    </div>

    <div
      v-if="mostrarFormulario"
      class="modal-backdrop"
      @click.self="cerrarFormulario"
    >
      <div class="restaurant-modal">
        <div class="restaurant-modal__header">
          <div>
            <h2>Crear restaurante</h2>
            <p>
              Completa la información del restaurante.
            </p>
          </div>

          <button
            class="close-button"
            type="button"
            @click="cerrarFormulario"
          >
            <X :size="20" />
          </button>
        </div>

        <form
          class="restaurant-form"
          @submit.prevent="guardarRestaurante"
        >
          <div class="form-field">
            <label for="nombre">Nombre</label>

            <input
              id="nombre"
              v-model.trim="formulario.nombre"
              type="text"
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
              <option value="" disabled>
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

          <div class="form-field form-field--full">
            <label for="direccion">Dirección</label>

            <textarea
              id="direccion"
              v-model.trim="formulario.direccion"
              rows="3"
              required
            />
          </div>

          <div class="form-field">
            <label for="correo">
              Correo de contacto
            </label>

            <input
              id="correo"
              v-model.trim="formulario.correo_contacto"
              type="email"
              required
            />
          </div>

          <div class="form-field">
            <label for="telefono">Teléfono</label>

            <input
              id="telefono"
              v-model.trim="formulario.telefono"
              type="text"
              required
            />
          </div>

          <div class="form-field">
            <label for="longitud">Longitud</label>

            <input
              id="longitud"
              v-model.number="formulario.longitud"
              type="number"
              step="any"
              required
            />
          </div>

          <div class="form-field">
            <label for="latitud">Latitud</label>

            <input
              id="latitud"
              v-model.number="formulario.latitud"
              type="number"
              step="any"
              required
            />
          </div>

          <div class="form-field form-field--full">
            <label for="imagen">URL de imagen</label>

            <input
              id="imagen"
              v-model.trim="formulario.url_imagen"
              type="url"
            />
          </div>

          <fieldset class="form-field form-field--full">
            <legend>Tipos de entrega</legend>

            <label>
              <input
                v-model="formulario.tipos_entrega"
                type="checkbox"
                value="RETIRO_EN_LOCAL"
              />
              Retiro en el local
            </label>

            <label>
              <input
                v-model="formulario.tipos_entrega"
                type="checkbox"
                value="EXPRESS"
              />
              Express
            </label>

            <label>
              <input
                v-model="formulario.tipos_entrega"
                type="checkbox"
                value="ENTREGA_PROPIA"
              />
              Entrega propia
            </label>
          </fieldset>

          <div
            v-if="errorFormulario"
            class="form-error form-field--full"
          >
            {{ errorFormulario }}
          </div>

          <div class="form-actions form-field--full">
            <button
              class="secondary-button"
              type="button"
              :disabled="guardando"
              @click="cerrarFormulario"
            >
              Cancelar
            </button>

            <button
              class="primary-button"
              type="submit"
              :disabled="guardando"
            >
              {{ guardando ? "Guardando..." : "Crear restaurante" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Plus,
  Store,
  X
} from "lucide-vue-next";

import { useUsuarioStore } from "../../stores/UsuarioStore";
import { useRestauranteStore } from "../../stores/RestauranteStore";

import { getCategoriasPorTipo } from "../../services/categoriaService";

import {
  crearRestaurante,
  getRestaurantesPorUsuario
} from "../../services/restauranteService";

const router = useRouter();
const usuarioStore = useUsuarioStore();
const restauranteStore = useRestauranteStore();

const restaurantes = ref([]);
const categorias = ref([]);
const loading = ref(true);
const guardando = ref(false);
const mostrarFormulario = ref(false);
const error = ref("");
const errorFormulario = ref("");
const mensajeExito = ref("");

const formularioInicial = () => ({
  nombre: "",
  id_categoria: "",
  direccion: "",
  correo_contacto: "",
  telefono: "",
  longitud: null,
  latitud: null,
  url_imagen: "",
  tipos_entrega: []
});

const formulario = reactive(formularioInicial());

async function cargarDatos() {
  try {
    loading.value = true;
    error.value = "";

    if (!usuarioStore.usuario) {
      usuarioStore.simularLoginAdministrador();
    }

    if (!usuarioStore.esAdministradorRestaurante) {
      throw new Error(
        "El usuario no tiene permisos para administrar restaurantes."
      );
    }

    const [listaRestaurantes, listaCategorias] =
      await Promise.all([
        getRestaurantesPorUsuario(
          usuarioStore.usuario._id
        ),
        getCategoriasPorTipo("RESTAURANTE")
      ]);

    restaurantes.value = listaRestaurantes;
    categorias.value = listaCategorias;
  } catch (err) {
    error.value = obtenerMensajeError(
      err,
      "No fue posible cargar los restaurantes."
    );
  } finally {
    loading.value = false;
  }
}

function abrirCreacion() {

  Object.assign(
    formulario,
    formularioInicial()
  );

  errorFormulario.value = "";
  mostrarFormulario.value = true;
}

function irAEditarRestaurante(restaurante) {
  router.push({
    name: "restaurant-edit",
    params: {
      id: restaurante._id
    }
  });
}

function cerrarFormulario() {
  if (guardando.value) {
    return;
  }

  mostrarFormulario.value = false;
  errorFormulario.value = "";
}

async function guardarRestaurante() {
  try {
    guardando.value = true;
    errorFormulario.value = "";
    mensajeExito.value = "";

    if (formulario.tipos_entrega.length === 0) {
      throw new Error(
        "Selecciona al menos un tipo de entrega."
      );
    }

    const datosRestaurante = {
      id_categoria: formulario.id_categoria,
      nombre: formulario.nombre,
      direccion: formulario.direccion,
      correo_contacto:
        formulario.correo_contacto,
      telefonos: [formulario.telefono],
      ubicacion: {
        type: "Point",
        coordinates: [
          Number(formulario.longitud),
          Number(formulario.latitud)
        ]
      },
      url_imagen: formulario.url_imagen,
      tipos_entrega: formulario.tipos_entrega
    };

      await crearRestaurante({
        ...datosRestaurante,
        id_usuario: usuarioStore.usuario._id
      });

      mensajeExito.value =
        "Restaurante creado correctamente.";

    cerrarFormulario();
    await cargarDatos();
  } catch (err) {
    errorFormulario.value = obtenerMensajeError(
      err,
      "No fue posible guardar el restaurante."
    );
  } finally {
    guardando.value = false;
  }
}

function seleccionarRestaurante(restaurante) {
  restauranteStore.seleccionarRestaurante(
    restaurante
  );

  router.push("/restaurante/perfil");
}

function formatearEstado(estado) {
  const estados = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    SUSPENDIDO: "Suspendido"
  };

  return estados[estado] || estado;
}

function obtenerMensajeError(
  err,
  mensajePredeterminado
) {
  return (
    err.response?.data?.mensaje ||
    err.message ||
    mensajePredeterminado
  );
}

onMounted(cargarDatos);
</script>

<style scoped>
.restaurants-view {
  width: 100%;
}

.restaurants-view__heading {
  margin-bottom: 24px;
}

.restaurants-view__heading h1 {
  margin: 0;
  font-size: 29px;
}

.restaurants-view__heading p {
  margin: 7px 0 0;
  color: var(--text-muted);
}

.restaurants-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
}

.restaurant-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  text-align: left;
}

.restaurant-card--selected {
  outline: 2px solid var(--green-main);
}

.restaurant-card__image {
  display: grid;
  height: 165px;
  place-items: center;
  overflow: hidden;
  background: #edf3ef;
  color: #668071;
}

.restaurant-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-card__body {
  padding: 18px;
}

.restaurant-card__body h2 {
  margin: 8px 0;
  font-size: 20px;
}

.restaurant-card__body p {
  margin: 0 0 8px;
  color: var(--text-muted);
}

.restaurant-card__status {
  color: var(--green-main);
  font-size: 12px;
  font-weight: 700;
}

.restaurant-card__actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.restaurant-card--create {
  display: flex;
  min-height: 340px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  color: var(--green-main);
  cursor: pointer;
}

.restaurant-card--create span {
  color: var(--text-muted);
  text-align: center;
}

.primary-button,
.secondary-button {
  min-height: 42px;
  padding: 0 15px;
  border-radius: 9px;
  cursor: pointer;
  font: inherit;
  font-weight: 650;
}

.primary-button {
  border: none;
  background: var(--green-main);
  color: white;
}

.secondary-button {
  border: 1px solid var(--border);
  background: white;
}

.alert,
.empty-state {
  margin-bottom: 18px;
  padding: 16px;
  border-radius: 10px;
}

.alert--success {
  background: #e9f8ee;
  color: #146c37;
}

.alert--error,
.form-error {
  background: #fef0ef;
  color: #b42318;
}

.modal-backdrop {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 29, 24, 0.55);
}

.restaurant-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 16px;
  background: white;
}

.restaurant-modal__header {
  display: flex;
  justify-content: space-between;
  padding: 24px 26px;
  border-bottom: 1px solid var(--border);
}

.restaurant-modal__header h2 {
  margin: 0;
}

.restaurant-modal__header p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

.close-button {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 9px;
  cursor: pointer;
}

.restaurant-form {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 17px;
  padding: 25px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: 9px;
  font: inherit;
}

.form-field label,
.form-field legend {
  font-weight: 650;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-error {
  padding: 12px;
  border-radius: 9px;
}

@media (max-width: 700px) {
  .restaurant-form {
    grid-template-columns: 1fr;
  }

  .form-field--full {
    grid-column: auto;
  }
}
</style>