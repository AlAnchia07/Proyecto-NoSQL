<script setup>
import { ref, onMounted } from 'vue'
import { obtenerUsuariosService, actualizarUsuarioService, eliminarUsuarioService } from '@/services/usuarioService'
import { registrarClienteService } from '@/services/authService' // O el servicio que uses para crear cuentas
import { Plus, Edit, Trash2, X, Building, User, Mail, Lock } from 'lucide-vue-next'

// Estados reactivos
const empleados = ref([])
const loading = ref(false)
const error = ref('')
const mensajeExito = ref('')

// Control de Modal
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const idUsuarioActual = ref(null)

// Formulario
const form = ref({
  nombre: '',
  correo: '',
  contrasena: '',
  rol: 'EMPLEADO',
  restaurante: ''
})

// Cargar empleados al montar la vista
const cargarEmpleados = async () => {
  try {
    loading.value = true
    const data = await obtenerUsuariosService()
    // Filtramos solo los que tienen el rol EMPLEADO
    empleados.value = data.filter(u => (u.rol || '').toUpperCase() === 'EMPLEADO')
  } catch (err) {
    error.value = err.mensaje || 'Error al cargar la lista de empleados.'
  } finally {
    loading.value = false
  }
}

// Abrir modal para crear
const abrirModalCrear = () => {
  modoEdicion.value = false
  idUsuarioActual.value = null
  form.value = { nombre: '', correo: '', contrasena: '', rol: 'EMPLEADO', restaurante: '' }
  mostrarModal.value = true
}

// Abrir modal para editar
const abrirModalEditar = (empleado) => {
  modoEdicion.value = true
  idUsuarioActual.value = empleado._id
  form.value = {
    nombre: empleado.nombre,
    correo: empleado.correo,
    contrasena: '', // Vacía por seguridad, solo se cambia si escriben una nueva
    rol: empleado.rol,
    restaurante: empleado.restaurante?._id || empleado.restaurante || ''
  }
  mostrarModal.value = true
}

// Guardar (Crear o Actualizar)
const guardarEmpleado = async () => {
  try {
    error.value = ''
    mensajeExito.value = ''

    if (modoEdicion.value) {
      await actualizarUsuarioService(idUsuarioActual.value, form.value)
      mensajeExito.value = 'Empleado actualizado exitosamente.'
    } else {
      await registrarClienteService(form.value) // O tu servicio de creación
      mensajeExito.value = 'Empleado registrado exitosamente.'
    }

    mostrarModal.value = false
    await cargarEmpleados()
  } catch (err) {
    error.value = err.mensaje || 'Ocurrió un error al guardar el empleado.'
  }
}

// Eliminar empleado
const eliminarEmpleado = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) return

  try {
    error.value = ''
    await eliminarUsuarioService(id)
    mensajeExito.value = 'Empleado eliminado exitosamente.'
    await cargarEmpleados()
  } catch (err) {
    error.value = err.mensaje || 'Error al eliminar el empleado.'
  }
}

onMounted(() => {
  cargarEmpleados()
})
</script>

<template>
  <div class="admin-gestion">
    <div class="gestion-header">
      <h2>Gestión de Empleados</h2>
      <button class="btn-primary" @click="abrirModalCrear">
        <Plus :size="18" /> Nuevo Empleado
      </button>
    </div>

    <!-- Mensajes de feedback -->
    <div v-if="error" class="alert alert-error">{{ error }}</div>
    <div v-if="mensajeExito" class="alert alert-success">{{ mensajeExito }}</div>

    <!-- Tabla de Empleados -->
    <div class="table-container">
      <div v-if="loading" class="loading">Cargando empleados...</div>
      <table v-else class="gestion-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Restaurante Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in empleados" :key="emp._id">
            <td>{{ emp.nombre }}</td>
            <td>{{ emp.correo }}</td>
            <td>{{ emp.restaurante?.nombre || 'No asignado' }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="abrirModalEditar(emp)" title="Editar">
                <Edit :size="18" />
              </button>
              <button class="btn-icon delete" @click="eliminarEmpleado(emp._id)" title="Eliminar">
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
          <tr v-if="empleados.length === 0 && !loading">
            <td colspan="4" class="no-data">No hay empleados registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modoEdicion ? 'Editar Empleado' : 'Registrar Nuevo Empleado' }}</h3>
          <button class="close-btn" @click="mostrarModal = false"><X :size="20" /></button>
        </div>

        <form @submit.prevent="guardarEmpleado" class="modal-form">
          <div class="form-group">
            <label><User :size="16" /> Nombre</label>
            <input type="text" v-model="form.nombre" required placeholder="Nombre completo" />
          </div>

          <div class="form-group">
            <label><Mail :size="16" /> Correo electrónico</label>
            <input type="email" v-model="form.correo" required placeholder="correo@ejemplo.com" />
          </div>

          <div class="form-group">
            <label><Lock :size="16" /> Contraseña {{ modoEdicion ? '(Opcional)' : '' }}</label>
            <input type="password" v-model="form.contrasena" :required="!modoEdicion" placeholder="********" />
          </div>

          <div class="form-group">
            <label><Building :size="16" /> ID de Restaurante (Asignación)</label>
            <input type="text" v-model="form.restaurante" placeholder="ID del restaurante de MongoDB" required />
            <!-- Opcional: Si tienes un select de restaurantes cargados, puedes cambiarlo por un <select> -->
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-gestion {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.alert {
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.gestion-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.gestion-table th, .gestion-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.gestion-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
}

.btn-icon.edit {
  color: #d97706;
}

.btn-icon.edit:hover {
  background-color: #fef3c7;
}

.btn-icon.delete {
  color: #dc2626;
}

.btn-icon.delete:hover {
  background-color: #fee2e2;
}

.no-data, .loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>