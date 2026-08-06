<script setup>
console.log("MONTANDO NOTIFICATIONS LIST");
import Notificacion from "./Notification.vue";
import { traerNotificaciones } from '@/services/NotificacionService';
import { ref,onMounted } from "vue";
import { useUsuarioStore } from "../../stores/UsuarioStore.js";

const notificaciones = ref();
const usuarioStore = useUsuarioStore();
usuarioStore.simularLoginCliente();

async function consultarNotificaciones(){
    try {
        const datos = await traerNotificaciones(
            usuarioStore.usuario._id
        );
        console.log(datos);
        notificaciones.value = datos;

    } catch(error) {
        console.error(error);
    }
}

function formatearDia(grupo) {
    const fecha = new Date(
        grupo._id.año,
        grupo._id.mes - 1,
        grupo._id.dia
    );

    return fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

onMounted(consultarNotificaciones);

</script>

<template>
    <div class="container">
        <h3>Notificaciones</h3>
        <p>Visualiza tu historial de notificaciones</p>
        <div class="d-flex flex-column justify-content-start gap-4 pt-2">
            <div v-for="grupo in notificaciones" :key="grupo._id.dia" class="pt-3">
                <h6><span class="bi bi-calendar"></span> - {{ formatearDia(grupo) }} -</h6>

                <div class="d-flex flex-column gap-3" >
                    <Notificacion 
                    v-for="notificacion in grupo.notificacion" :key="notificacion._id"
                    :notificacion="notificacion"                    
                    />
                </div>
            </div>
        </div>
    </div>
</template>