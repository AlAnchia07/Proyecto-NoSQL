<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registrarClienteService } from '../../../services/authService';

const router = useRouter()

const form = ref({
  nombre: '',
  correo: '',
  contrasena: '',
  rol: 'CLIENTE', 
  restaurante: null
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    const datosEnvio = {
      nombre: form.value.nombre,
      correo: form.value.correo,
      contrasena: form.value.contrasena,
      rol: form.value.rol,
      restaurante: form.value.rol === 'EMPLEADO' ? form.value.restaurante : null
    }

    await registrarClienteService(datosEnvio)
    router.push('/login')
  } catch (err) {
    console.error("ERROR COMPLETO DEL BACKEND:", err) // <--- MIRA ESTO EN LA CONSOLA (F12)
    error.value = err.mensaje || err.error || 'No fue posible completar el registro.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Crear cuenta</h1>
        <p>Regístrate para comenzar.</p>
      </div>

      <div v-if="error" class="auth-message auth-message--error">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="form.nombre" required placeholder="Tu nombre" />
        </div>

        <div class="form-group">
          <label for="correo">Correo</label>
          <input type="email" id="correo" v-model="form.correo" required placeholder="correo@ejemplo.com" />
        </div>

        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" v-model="form.contrasena" required placeholder="••••••••" />
        </div>

        <div class="form-group">
          <label for="rol">Rol</label>
          <select id="rol" v-model="form.rol" class="form-select">
            <option value="CLIENTE">Cliente</option>
            <option value="RESTAURANTE">Restaurante</option>
          </select>
        </div>

        
        <div class="form-group" v-if="form.rol === 'EMPLEADO'">
          <label for="restaurante">ID Restaurante (Solo empleado)</label>
          <input type="text" id="restaurante" v-model="form.restaurante" placeholder="Ej. ID del restaurante" />
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.auth-header {
  margin-bottom: 24px;
  text-align: center;
}

.auth-header h1 {
  margin: 0;
  color: #172033;
  font-size: 26px;
}

.auth-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

.auth-message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.auth-message--error {
  background-color: #fdecec;
  color: #b42318;
}

.auth-form {
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
  color: #172033;
  font-size: 13px;
  font-weight: 600;
}

.form-group input, .form-select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #172033;
  outline: none;
  background-color: #fff;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-select:focus {
  border-color: #2057a6;
}

.auth-button {
  margin-top: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #172033;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-button:hover {
  background-color: #2057a6;
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.auth-footer a {
  color: #2057a6;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>