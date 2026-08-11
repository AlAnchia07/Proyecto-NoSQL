<script setup>
import { ref, onMounted } from 'vue'
import { User, Mail, Shield, KeyRound, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { obtenerPerfilService, actualizarPerfilService } from '@/services/usuarioService'

const cargando = ref(true)
const mensajeExito = ref('')
const mensajeError = ref('')

const admin = ref({
  _id: '',
  nombre: '',
  correo: '',
  rol: '',
  createdAt: ''
})

const form = ref({
  nombre: '',
  correo: '',
  nuevaContrasena: '',
  confirmarContrasena: ''
})

const cargarDatosAdmin = async () => {
  try {
    cargando.value = true
    const data = await obtenerPerfilService()
    
    admin.value = data
    form.value.nombre = data.nombre
    form.value.correo = data.correo
  } catch (error) {
    mensajeError.value = error.mensaje || 'No se pudo cargar la información del perfil.'
  } finally {
    cargando.value = false
  }
}

const actualizarPerfil = async () => {
  mensajeExito.value = ''
  mensajeError.value = ''

  if (form.value.nuevaContrasena && form.value.nuevaContrasena !== form.value.confirmarContrasena) {
    mensajeError.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    const payload = {
      nombre: form.value.nombre,
      correo: form.value.correo,
    }
    
    if (form.value.nuevaContrasena) {
      payload.contrasena = form.value.nuevaContrasena
    }

    const respuesta = await actualizarPerfilService(payload)
    
    mensajeExito.value = respuesta.mensaje || 'Perfil actualizado exitosamente.'
    admin.value.nombre = form.value.nombre
    admin.value.correo = form.value.correo
    form.value.nuevaContrasena = ''
    form.value.confirmarContrasena = ''
  } catch (error) {
    mensajeError.value = error.mensaje || 'Error al actualizar el perfil.'
  }
}

onMounted(() => {
  cargarDatosAdmin()
})
</script>

<template>
  <div class="admin-profile-view">
    <div class="profile-header">
      <h2>Mi Perfil de Administrador</h2>
      <p>Administra la información de tu cuenta y credenciales de acceso.</p>
    </div>

    <div v-if="cargando" class="loading-state">Cargando perfil...</div>

    <div v-else class="profile-container">
      <!-- Tarjeta de Información General -->
      <div class="profile-card info-card">
        <div class="avatar-section">
          <div class="avatar-placeholder">
            <User :size="48" />
          </div>
          <h3>{{ admin.nombre }}</h3>
          <span class="badge-role">
            <Shield :size="14" /> {{ admin.rol }}
          </span>
        </div>

        <div class="attributes-list">
          <div class="attribute-item">
            <span class="attr-label">ID de Usuario:</span>
            <span class="attr-value mono">{{ admin._id }}</span>
          </div>
          <div class="attribute-item">
            <span class="attr-label">Correo electrónico:</span>
            <span class="attr-value">{{ admin.correo }}</span>
          </div>
          <div class="attribute-item">
            <span class="attr-label">Fecha de Registro:</span>
            <span class="attr-value">{{ admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/D' }}</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Edición / Formulario -->
      <div class="profile-card form-card">
        <h3>Editar Datos</h3>

        <div v-if="mensajeExito" class="alert alert-success">
          <CheckCircle2 :size="18" /> {{ mensajeExito }}
        </div>
        <div v-if="mensajeError" class="alert alert-error">
          <AlertCircle :size="18" /> {{ mensajeError }}
        </div>

        <form @submit.prevent="actualizarPerfil" class="profile-form">
          <div class="form-group">
            <label><User :size="16" /> Nombre completo</label>
            <input type="text" v-model="form.nombre" required />
          </div>

          <div class="form-group">
            <label><Mail :size="16" /> Correo electrónico</label>
            <input type="email" v-model="form.correo" required />
          </div>

          <hr class="divider" />

          <h4>Cambiar Contraseña (Opcional)</h4>

          <div class="form-group">
            <label><KeyRound :size="16" /> Nueva contraseña</label>
            <input type="password" v-model="form.nuevaContrasena" placeholder="Dejar en blanco para no cambiar" />
          </div>

          <div class="form-group">
            <label><KeyRound :size="16" /> Confirmar nueva contraseña</label>
            <input type="password" v-model="form.confirmarContrasena" placeholder="Repite la contraseña" />
          </div>

          <button type="submit" class="btn-primary">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-profile-view {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 0.3rem;
}

.profile-header p {
  color: #6b7280;
}

.profile-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  border: 1px solid #e5e7eb;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-section h3 {
  font-size: 1.2rem;
  color: #1f2937;
  margin-bottom: 0.4rem;
}

.badge-role {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.attributes-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.attr-label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.attr-value {
  font-size: 0.95rem;
  color: #111827;
  word-break: break-all;
}

.attr-value.mono {
  font-family: monospace;
  font-size: 0.85rem;
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.form-card h3 {
  font-size: 1.2rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.form-card h4 {
  font-size: 0.95rem;
  color: #374151;
  margin: 1.2rem 0 0.8rem 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
}

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.7rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>