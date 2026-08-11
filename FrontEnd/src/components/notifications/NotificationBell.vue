<script setup>
import { contarNoLeidas } from '@/services/NotificacionService';
import { marcarLeidas } from '@/services/NotificacionService';
import { useUsuarioStore } from "../../stores/UsuarioStore";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Bell } from "lucide-vue-next";

const props = defineProps({
    rutaNotificaciones: {
        type: String,
        required: true
    }
});

const router = useRouter();
const usuarioStore = useUsuarioStore();

const contadorNoLeidas = ref(0);

let intervalo;

async function actualizarNoLeidas() {
    try {
        const datos = await contarNoLeidas(
            usuarioStore.usuario._id
        );

        contadorNoLeidas.value = datos.cantidad;

    } catch (error) {
        console.error(error);
    }
}

async function marcarNotificacionesLeidas() {
    try {
        await marcarLeidas(
            usuarioStore.usuario._id
        );

    } catch (error) {
        console.error(error);
    }
}

async function abrirNotificaciones() {
    await marcarNotificacionesLeidas();

    contadorNoLeidas.value = 0;

    router.push(props.rutaNotificaciones);
}

onMounted(() => {
    actualizarNoLeidas();

    intervalo = setInterval(() => {
        actualizarNoLeidas();
    }, 5000);
});

onUnmounted(() => {
    clearInterval(intervalo);
});
</script>

<template>
    <button
        type="button"
        class="notification-bell"
        aria-label="Notificaciones"
        @click="abrirNotificaciones"
    >
        <Bell />


        <span 
            v-if="contadorNoLeidas > 0"
            class="contador"
            >
            {{ contadorNoLeidas }}
        </span>
  </button>
</template>

<style scoped>
    .campana {
        position: relative;
        cursor: pointer;
        display: inline-block;
        transition: transform .2s ease;
    }

    .campana:hover {
        transform: scale(1.15);
    }   

    .campana i {
        font-size: 1.8rem;
    }



    i{
        color: rgb(83, 83, 83);
    }

    .contador {
        position: absolute;
        top: -1px;
        right: -6px;

        background: red;
        color: white;

        width: 20px;
        height: 20px;
        border-radius: 50%;

        font-size: .75rem;
        font-weight: bold;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-bell {
        position: relative;
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border: none;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
}
</style>