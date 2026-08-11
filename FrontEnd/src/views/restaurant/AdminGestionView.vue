<!-- src/views/auth/AdminGestionView.vue -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { UserPlus, Edit, Trash2, X } from 'lucide-vue-next'
import { useUsuarioStore } from "@/stores/UsuarioStore";
import { getRestaurantesPorUsuario } from "@/services/restauranteService";

// Estados principales
const empleados = ref([])
const restaurantes = ref([])
const loading = ref(false)
const error = ref('')
const mensajeExito = ref('')
const usuarioStore = useUsuarioStore();

// Estado del Modal (Crear / Editar)
const showModal = ref(false)
const modoEdicion = ref(false)

// Formulario reactivo
const form = ref({
  id: null,
  nombre: '',
  correo: '',
  contrasena: '',
  rol: 'EMPLEADO',
  restaurante: ''
})

// Cargar empleados y restaurantes al montar la vista
onMounted(async () => {
  await cargarEmpleados()
  await cargarRestaurantes()
})

const cargarEmpleados = async () => {
  try {
    loading.value = true
    const res = await axios.get('http://localhost:5000/api/usuarios')
    // Filtramos para mostrar estrictamente solo los que tengan rol EMPLEADO
    empleados.value = res.data.filter(u => (u.rol || '').toUpperCase() === 'EMPLEADO')
  } catch (err) {
    console.error(err)
    error.value = 'Error al cargar la lista de empleados.'
  } finally {
    loading.value = false
  }
}

const cargarRestaurantes = async () => {
  try {
    const idUsuario = usuarioStore.usuario?._id

    if (!idUsuario) {
      throw new Error(
        'No se pudo identificar al administrador actual.'
      )
    }

    const data = await getRestaurantesPorUsuario(
      idUsuario
    )

    restaurantes.value =
      Array.isArray(data) ? data : []
  } catch (err) {
    console.error(
      'Error al cargar restaurantes:',
      err
    )

    error.value =
      err.response?.data?.mensaje ||
      err.message ||
      'No fue posible cargar los restaurantes.'
  }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  form.value = {
    id: null,
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'EMPLEADO',
    restaurante: ''
  }
  showModal.value = true
}

const abrirModalEditar = (empleado) => {
  modoEdicion.value = true
  form.value = {
    id: empleado._id,
    nombre: empleado.nombre,
    correo: empleado.correo,
    contrasena: '', // La contraseña se deja en blanco si no se desea cambiar
    rol: 'EMPLEADO',
    restaurante: empleado.restaurante?._id || empleado.restaurante || ''
  }
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
}

const guardarEmpleado = async () => {
  try {
    error.value = ''
    mensajeExito.value = ''

    const datosEnviar = {
      nombre: form.value.nombre,
      correo: form.value.correo,
      rol: 'EMPLEADO',
      restaurante: form.value.restaurante || null
    }

    if (form.value.contrasena) {
      datosEnviar.contrasena = form.value.contrasena
    }

    if (modoEdicion.value) {
      await axios.put(`http://localhost:5000/api/usuarios/${form.value.id}`, datosEnviar)
      mensajeExito.value = 'Empleado actualizado correctamente.'
    } else {
      if (!form.value.contrasena) {
        error.value = 'La contraseña es obligatoria para nuevos empleados.'
        return
      }
      await axios.post('http://localhost:5000/api/auth/register', datosEnviar)
      mensajeExito.value = 'Empleado creado exitosamente.'
    }

    cerrarModal()
    await cargarEmpleados()
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.mensaje || 'Error al guardar el empleado.'
  }
}

const eliminarEmpleado = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) return

  try {
    error.value = ''
    await axios.delete(`http://localhost:5000/api/usuarios/${id}`)
    mensajeExito.value = 'Empleado eliminado correctamente.'
    await cargarEmpleados()
  } catch (err) {
    console.error(err)
    error.value = 'Error al eliminar el empleado.'
  }
}

</script>

<template>
  <div class="usuarios-container">
    <div class="header-section">
      <div>
        <h1>Gestión de Empleados</h1>
        <p>Administra las cuentas del personal y asígnales un restaurante.</p>
      </div>
      <button class="btn-primary" @click="abrirModalCrear">
        <UserPlus :size="18" />
        Nuevo Empleado
      </button>
    </div>

    <!-- Mensajes de feedback -->
    <div v-if="error" class="alert alert-error">{{ error }}</div>
    <div v-if="mensajeExito" class="alert alert-success">{{ mensajeExito }}</div>

    <!-- Tabla de Empleados -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">Cargando empleados...</div>
      
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Restaurante Asignado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in empleados" :key="emp._id">
            <td class="font-medium">{{ emp.nombre }}</td>
            <td>{{ emp.correo }}</td>
            <td>
              <span class="badge-restaurant">
                {{ emp.restaurante?.nombre || 'Sin restaurante asignado' }}
              </span>
            </td>
            <td class="text-right actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(emp)" title="Editar">
                <Edit :size="16" />
              </button>
              <button class="btn-icon btn-delete" @click="eliminarEmpleado(emp._id)" title="Eliminar">
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
          <tr v-if="empleados.length === 0">
            <td colspan="4" class="empty-state">No hay empleados registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario Crear / Editar -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ modoEdicion ? 'Editar Empleado' : 'Registrar Nuevo Empleado' }}</h2>
          <button class="btn-close" @click="cerrarModal"><X :size="20" /></button>
        </div>

        <form @submit.prevent="guardarEmpleado" class="modal-form">
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" v-model="form.nombre" required placeholder="Ej. Carlos Pérez" />
          </div>

          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" v-model="form.correo" required placeholder="empleado@biteup.com" />
          </div>

          <div class="form-group">
            <label>Contraseña {{ modoEdicion ? '(Opcional)' : '' }}</label>
            <input type="password" v-model="form.contrasena" :required="!modoEdicion" placeholder="••••••••" />
          </div>

          <div class="form-group">
            <label>Restaurante asignado</label>
            <select v-model="form.restaurante" required>
              <option disabled value="">
                Seleccione un restaurante
              </option>

              <option
                v-for="rest in restaurantes"
                :key="rest._id"
                :value="rest._id"
              >
                {{ rest.nombre }} - {{ rest.direccion }}
              </option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usuarios-container {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h1 {
  margin: 0;
  font-size: 24px;
  color: #172033;
}

.header-section p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #0b5635;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #08472d;
}

.alert {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert-error {
  background-color: #fdecec;
  color: #b42318;
}

.alert-success {
  background-color: #ecfdf3;
  color: #027a48;
}

.table-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}

.font-medium {
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.badge-restaurant {
  background-color: #e6f4ea;
  color: #13713d;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-edit {
  color: #2057a6;
}

.btn-edit:hover {
  background-color: #eff6ff;
}

.btn-delete {
  color: #b42318;
}

.btn-delete:hover {
  background-color: #fdecec;
}

.loading-state, .empty-state {
  padding: 32px;
  text-align: center;
  color: #64748b;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 16px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #172033;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.form-group input, .form-group select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.form-group input:focus, .form-group select:focus {
  border-color: #0b5635;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #334155;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}
</style>