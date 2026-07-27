<!-- src/views/auth/LoginView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginService } from '../../services/authService'

const router = useRouter()

const form = ref({
  correo_registro: '',
  contraseña: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await loginService(form.value)

    // Guardar información básica de sesión (puedes adaptarlo si usas Pinia)
    localStorage.setItem('usuario_id', response.usuario_id)
    localStorage.setItem('tipo_usuario', response.tipo_usuario)
    if (response.perfil) {
      localStorage.setItem('perfil', JSON.stringify(response.perfil))
    }

    // Redirigir según el tipo de usuario o a la vista principal
    if (response.tipo_usuario === 'CLIENTE') {
      router.push('/pedidos') // O a la ruta de inicio de clientes
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error(err)
    error.value = err.mensaje || 'Credenciales inválidas o error al iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>
      </div>

      <div v-if="error" class="auth-message auth-message--error">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input type="email" id="correo" v-model="form.correo_registro" required placeholder="correo@ejemplo.com" />
        </div>

        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" v-model="form.contraseña" required placeholder="••••••••" />
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
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
  max-width: 420px;
  padding: 32px;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: var(--radius-md, 12px);
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
  color: var(--text-muted, #64748b);
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

.form-group input {
  padding: 10px 14px;
  border: 1px solid var(--border, #cbd5e1);
  border-radius: 8px;
  font-size: 14px;
  color: #172033;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
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
  color: var(--text-muted, #64748b);
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