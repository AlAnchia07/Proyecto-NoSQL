<script setup>    
import { contarNoLeidas } from '@/services/NotificacionService';
import { marcarLeidas } from '@/services/NotificacionService';
import { useUsuarioStore } from "../../stores/UsuarioStore";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const usuarioStore = useUsuarioStore();

const contadorNoLeidas = ref(0);

async function actualizarNoLeidas() {
    try {
        const datos = await contarNoLeidas(
            usuarioStore.usuario._id
        );

        console.log( usuarioStore.usuario._id);

        contadorNoLeidas.value = datos.cantidad;
    
    } catch(error) {
         console.error(error);
    }
}

async function marcarNotificacionesLeidas() {
    try {
        const datos = await marcarLeidas(
            usuarioStore.usuario._id
        );
    
    } catch(error) {
         console.error(error);
    }
}

function abrirNotificaciones() {
    marcarNotificacionesLeidas();
    router.push("/notificaciones");
}

onMounted(actualizarNoLeidas);
</script>

<template>
    <div class="campana m-4" @click="abrirNotificaciones">
        <i class="bi bi-bell"></i>

        <span v-if="contadorNoLeidas > 0" class="contador">
            {{ contadorNoLeidas }}
        </span>
    </div>
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
</style>