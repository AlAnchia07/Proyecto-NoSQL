<template>
  <section class="restaurant-profile">
    <div class="profile-heading">
      <div>
        <h1>Perfil del restaurante</h1>

        <p>
          Consulta y actualiza la información de tu restaurante.
        </p>
      </div>

      <button
        v-if="!modoEdicion"
        class="primary-button"
        type="button"
        :disabled="loading"
        @click="activarEdicion"
      >
        <Pencil :size="18" />
        Editar información
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

    <div v-if="loading" class="profile-message">
      Cargando información del restaurante...
    </div>

    <form
      v-else
      class="profile-card"
      @submit.prevent="guardarCambios"
    >
      <div class="profile-card__header">
        <div class="restaurant-image">
          <img
            v-if="formulario.url_imagen"
            :src="formulario.url_imagen"
            :alt="formulario.nombre"
            @error="ocultarImagen"
          />

          <div v-else class="restaurant-image__placeholder">
            <Store :size="42" />
          </div>
        </div>

        <div>
          <h2>{{ formulario.nombre || "Restaurante" }}</h2>

          <span
            class="status-badge"
            :class="`status-badge--${formulario.estado.toLowerCase()}`"
          >
            {{ formatearEstado(formulario.estado) }}
          </span>
        </div>
      </div>

      <div class="profile-form">
        <div class="form-field">
          <label for="nombre">
            Nombre del restaurante
          </label>

          <input
            id="nombre"
            v-model.trim="formulario.nombre"
            type="text"
            maxlength="100"
            :disabled="!modoEdicion"
            required
          />
        </div>

        <div class="form-field">
          <label for="categoria">Categoría</label>

          <select
            id="categoria"
            v-model="formulario.id_categoria"
            :disabled="!modoEdicion"
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

        <div class="form-field form-field--full">
          <label for="direccion">Dirección</label>

          <textarea
            id="direccion"
            v-model.trim="formulario.direccion"
            rows="3"
            maxlength="250"
            :disabled="!modoEdicion"
            required
          />
        </div>

        <div class="form-field">
          <label for="correo">Correo de contacto</label>

          <input
            id="correo"
            v-model.trim="formulario.correo_contacto"
            type="email"
            :disabled="!modoEdicion"
            required
          />
        </div>

        <div class="form-field">
          <label for="telefonoPrincipal">
            Teléfono principal
          </label>

          <input
            id="telefonoPrincipal"
            v-model.trim="formulario.telefono_principal"
            type="text"
            :disabled="!modoEdicion"
            required
          />
        </div>

        <div class="form-field">
          <label for="telefonoSecundario">
            Teléfono secundario
          </label>

          <input
            id="telefonoSecundario"
            v-model.trim="formulario.telefono_secundario"
            type="text"
            :disabled="!modoEdicion"
          />
        </div>

        <div class="form-field">
          <label for="estado">Estado</label>

          <select
            id="estado"
            v-model="formulario.estado"
            :disabled="!modoEdicion"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SUSPENDIDO">Suspendido</option>
          </select>
        </div>

        <div class="form-field form-field--full">
          <label for="imagen">URL de la imagen</label>

          <input
            id="imagen"
            v-model.trim="formulario.url_imagen"
            type="url"
            placeholder="https://..."
            :disabled="!modoEdicion"
          />
        </div>

        <fieldset class="delivery-fieldset form-field--full">
          <legend>Tipos de entrega</legend>

          <label class="checkbox-option">
            <input
              v-model="formulario.tipos_entrega"
              type="checkbox"
              value="RETIRO_EN_LOCAL"
              :disabled="!modoEdicion"
            />

            Retiro en el local
          </label>

          <label class="checkbox-option">
            <input
              v-model="formulario.tipos_entrega"
              type="checkbox"
              value="EXPRESS"
              :disabled="!modoEdicion"
            />

            Express
          </label>

          <label class="checkbox-option">
            <input
              v-model="formulario.tipos_entrega"
              type="checkbox"
              value="ENTREGA_PROPIA"
              :disabled="!modoEdicion"
            />

            Entrega propia
          </label>
        </fieldset>

        <div class="coordinates-section form-field--full">
          <div class="coordinates-section__heading">
            <div>
              <h3>Ubicación</h3>

              <p>
                Recuerda que MongoDB utiliza longitud y
                latitud, en ese orden.
              </p>
            </div>
          </div>

          <div class="coordinates-grid">
            <div class="form-field">
              <label for="longitud">Longitud</label>

              <input
                id="longitud"
                v-model.number="formulario.longitud"
                type="number"
                step="any"
                :disabled="!modoEdicion"
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
                :disabled="!modoEdicion"
                required
              />
            </div>
          </div>
        </div>

        <div class="schedule-section form-field--full">
          <div class="schedule-section__heading">
            <div>
              <h3>Horario</h3>

              <p>
                Indica la hora de apertura y cierre para cada día.
              </p>
            </div>
          </div>

          <div class="schedule-list">
            <div
              v-for="dia in diasSemana"
              :key="dia.clave"
              class="schedule-row"
            >
              <strong>{{ dia.etiqueta }}</strong>

              <div class="schedule-time">
                <label :for="`${dia.clave}-apertura`">
                  Apertura
                </label>

                <input
                  :id="`${dia.clave}-apertura`"
                  v-model="
                    formulario.horario[dia.clave].apertura
                  "
                  type="time"
                  :disabled="!modoEdicion"
                />
              </div>

              <div class="schedule-time">
                <label :for="`${dia.clave}-cierre`">
                  Cierre
                </label>

                <input
                  :id="`${dia.clave}-cierre`"
                  v-model="
                    formulario.horario[dia.clave].cierre
                  "
                  type="time"
                  :disabled="!modoEdicion"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="errorFormulario"
          class="form-error form-field--full"
        >
          {{ errorFormulario }}
        </div>

        <div
          v-if="modoEdicion"
          class="profile-actions form-field--full"
        >
          <button
            class="secondary-button"
            type="button"
            :disabled="guardando"
            @click="cancelarEdicion"
          >
            Cancelar
          </button>

          <button
            class="primary-button"
            type="submit"
            :disabled="guardando"
          >
            {{
              guardando
                ? "Guardando..."
                : "Guardar cambios"
            }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  Pencil,
  Store
} from "lucide-vue-next";

import { getCategoriasPorTipo } from "../../services/categoriaService";
import {
  editarRestaurante,
  getRestaurantePorId
} from "../../services/restauranteService";

const loading = ref(true);
const guardando = ref(false);
const modoEdicion = ref(false);
const error = ref("");
const errorFormulario = ref("");
const mensajeExito = ref("");
const categorias = ref([]);
const restauranteOriginal = ref(null);

/*
 * Utiliza el mismo _id de restaurante que colocaste
 * en RestaurantProductsView.vue.
 */
const idRestauranteTemporal =
  "6a666c9eaa03eadb7870e707";

const crearHorarioInicial = () => ({
  lunes: {
    apertura: "",
    cierre: ""
  },
  martes: {
    apertura: "",
    cierre: ""
  },
  miercoles: {
    apertura: "",
    cierre: ""
  },
  jueves: {
    apertura: "",
    cierre: ""
  },
  viernes: {
    apertura: "",
    cierre: ""
  },
  sabado: {
    apertura: "",
    cierre: ""
  },
  domingo: {
    apertura: "",
    cierre: ""
  }
});

const formulario = reactive({
  nombre: "",
  id_categoria: "",
  direccion: "",
  correo_contacto: "",
  telefono_principal: "",
  telefono_secundario: "",
  url_imagen: "",
  estado: "ACTIVO",
  tipos_entrega: [],
  longitud: null,
  latitud: null,
  horario: crearHorarioInicial()
});

const diasSemana = [
  {
    clave: "lunes",
    etiqueta: "Lunes"
  },
  {
    clave: "martes",
    etiqueta: "Martes"
  },
  {
    clave: "miercoles",
    etiqueta: "Miércoles"
  },
  {
    clave: "jueves",
    etiqueta: "Jueves"
  },
  {
    clave: "viernes",
    etiqueta: "Viernes"
  },
  {
    clave: "sabado",
    etiqueta: "Sábado"
  },
  {
    clave: "domingo",
    etiqueta: "Domingo"
  }
];

async function cargarDatos() {
  try {
    loading.value = true;
    error.value = "";

    const [restaurante, categoriasRestaurante] =
      await Promise.all([
        getRestaurantePorId(idRestauranteTemporal),
        getCategoriasPorTipo("RESTAURANTE")
      ]);

    categorias.value = categoriasRestaurante;
    restauranteOriginal.value = restaurante;

    asignarRestauranteAlFormulario(restaurante);
  } catch (err) {
    console.error(err);

    error.value = obtenerMensajeError(
      err,
      "No fue posible cargar la información del restaurante."
    );
  } finally {
    loading.value = false;
  }
}

function asignarRestauranteAlFormulario(restaurante) {
  const telefonos = restaurante.telefonos || [];

  const categoria =
    restaurante.id_categoria?._id ||
    restaurante.id_categoria ||
    "";

  Object.assign(formulario, {
    nombre: restaurante.nombre || "",
    id_categoria: categoria,
    direccion: restaurante.direccion || "",
    correo_contacto:
      restaurante.correo_contacto || "",
    telefono_principal: telefonos[0] || "",
    telefono_secundario: telefonos[1] || "",
    url_imagen: restaurante.url_imagen || "",
    estado: restaurante.estado || "ACTIVO",
    tipos_entrega: [
      ...(restaurante.tipos_entrega || [])
    ],
    longitud:
      restaurante.ubicacion?.coordinates?.[0] ??
      null,
    latitud:
      restaurante.ubicacion?.coordinates?.[1] ??
      null,
    horario: normalizarHorario(restaurante.horario)
  });
}

function normalizarHorario(horario = {}) {
  const horarioNormalizado = crearHorarioInicial();

  Object.keys(horarioNormalizado).forEach((dia) => {
    horarioNormalizado[dia] = {
      apertura: horario[dia]?.apertura || "",
      cierre: horario[dia]?.cierre || ""
    };
  });

  return horarioNormalizado;
}

function activarEdicion() {
  modoEdicion.value = true;
  errorFormulario.value = "";
  mensajeExito.value = "";
}

function cancelarEdicion() {
  if (restauranteOriginal.value) {
    asignarRestauranteAlFormulario(
      restauranteOriginal.value
    );
  }

  modoEdicion.value = false;
  errorFormulario.value = "";
}

async function guardarCambios() {
  try {
    guardando.value = true;
    errorFormulario.value = "";
    mensajeExito.value = "";

    validarFormulario();

    const telefonos = [
      formulario.telefono_principal,
      formulario.telefono_secundario
    ].filter((telefono) => telefono?.trim());

    const datosRestaurante = {
      nombre: formulario.nombre,
      id_categoria: formulario.id_categoria,
      direccion: formulario.direccion,
      correo_contacto:
        formulario.correo_contacto,
      telefonos,
      url_imagen: formulario.url_imagen,
      estado: formulario.estado,
      tipos_entrega: formulario.tipos_entrega,
      ubicacion: {
        type: "Point",
        coordinates: [
          Number(formulario.longitud),
          Number(formulario.latitud)
        ]
      },
      horario: formulario.horario
    };

    const respuesta = await editarRestaurante(
      idRestauranteTemporal,
      datosRestaurante
    );

    restauranteOriginal.value =
      respuesta.restaurante;

    asignarRestauranteAlFormulario(
      respuesta.restaurante
    );

    modoEdicion.value = false;
    mensajeExito.value =
      "Información del restaurante actualizada correctamente.";
  } catch (err) {
    console.error(err);

    errorFormulario.value = obtenerMensajeError(
      err,
      "No fue posible actualizar el restaurante."
    );
  } finally {
    guardando.value = false;
  }
}

function validarFormulario() {
  if (
    formulario.longitud === null ||
    formulario.latitud === null ||
    formulario.longitud === "" ||
    formulario.latitud === ""
  ) {
    throw new Error(
      "La longitud y la latitud son obligatorias."
    );
  }

  if (formulario.tipos_entrega.length === 0) {
    throw new Error(
      "Debes seleccionar al menos un tipo de entrega."
    );
  }

  Object.entries(formulario.horario).forEach(
    ([dia, horarioDia]) => {
      const tieneApertura =
        Boolean(horarioDia.apertura);

      const tieneCierre =
        Boolean(horarioDia.cierre);

      if (tieneApertura !== tieneCierre) {
        throw new Error(
          `Debes completar tanto la apertura como el cierre de ${dia}.`
        );
      }

      if (
        tieneApertura &&
        horarioDia.cierre <= horarioDia.apertura
      ) {
        throw new Error(
          `La hora de cierre de ${dia} debe ser posterior a la apertura.`
        );
      }
    }
  );
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

function formatearEstado(estado) {
  const estados = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    SUSPENDIDO: "Suspendido"
  };

  return estados[estado] || estado;
}

function ocultarImagen(event) {
  event.target.style.display = "none";
}

onMounted(cargarDatos);
</script>

<style scoped>
.restaurant-profile {
  width: 100%;
}

.profile-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.profile-heading h1 {
  margin: 0;
  font-size: 29px;
  font-weight: 750;
}

.profile-heading p {
  margin: 7px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  min-height: 43px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-weight: 650;
}

.primary-button {
  background-color: var(--green-main);
  color: #ffffff;
}

.secondary-button {
  border: 1px solid var(--border);
  background-color: var(--surface);
  color: var(--text-main);
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
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

.profile-message {
  padding: 35px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  color: var(--text-muted);
  text-align: center;
}

.profile-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  box-shadow: 0 8px 24px rgba(15, 77, 47, 0.06);
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 26px;
  border-bottom: 1px solid var(--border);
}

.restaurant-image {
  width: 105px;
  height: 105px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 15px;
  background-color: #edf3ef;
}

.restaurant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-image__placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #688075;
}

.profile-card__header h2 {
  margin: 0 0 10px;
  font-size: 23px;
}

.status-badge {
  display: inline-flex;
  min-height: 29px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge--activo {
  background-color: #e6f7ec;
  color: #16723b;
}

.status-badge--inactivo {
  background-color: #edf1f4;
  color: #5a6570;
}

.status-badge--suspendido {
  background-color: #fff4d6;
  color: #8a6500;
}

.profile-form {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 26px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field label,
.delivery-fieldset legend {
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

.form-field input:disabled,
.form-field textarea:disabled,
.form-field select:disabled {
  background-color: #f4f6f5;
  color: #5f6b64;
  cursor: default;
  opacity: 1;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: var(--green-main);
  outline: 2px solid rgba(49, 152, 78, 0.15);
}

.delivery-fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 24px;
  margin: 0;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.delivery-fieldset legend {
  padding: 0 7px;
}

.checkbox-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  font-size: 14px;
}

.checkbox-option input {
  width: 17px;
  min-height: auto;
  height: 17px;
}

.coordinates-section,
.schedule-section {
  padding-top: 10px;
}

.coordinates-section__heading,
.schedule-section__heading {
  margin-bottom: 14px;
}

.coordinates-section__heading h3,
.schedule-section__heading h3 {
  margin: 0;
  font-size: 18px;
}

.coordinates-section__heading p,
.schedule-section__heading p {
  margin: 5px 0 0;
  color: var(--text-muted);
  font-size: 13px;
}

.coordinates-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.schedule-list {
  display: grid;
  gap: 10px;
}

.schedule-row {
  display: grid;
  grid-template-columns:
    minmax(105px, 0.7fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr);
  align-items: end;
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.schedule-row > strong {
  align-self: center;
}

.schedule-time {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.schedule-time label {
  color: var(--text-muted);
  font-size: 12px;
}

.schedule-time input {
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font: inherit;
}

.schedule-time input:disabled {
  background-color: #f4f6f5;
  color: #5f6b64;
}

.form-error {
  padding: 11px 13px;
  border-radius: 9px;
  background-color: #fef0ef;
  color: #b42318;
  font-size: 13px;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 11px;
  margin-top: 5px;
}

@media (max-width: 760px) {
  .profile-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .profile-form,
  .coordinates-grid {
    grid-template-columns: 1fr;
  }

  .form-field--full {
    grid-column: auto;
  }

  .schedule-row {
    grid-template-columns: 1fr;
  }

  .profile-card__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>