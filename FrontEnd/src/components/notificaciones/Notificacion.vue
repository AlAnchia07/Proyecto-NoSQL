<script setup>
    const TITULOS = {
        PEDIDO: "Actualización de pedido",
        RESEÑA: "Sobre tu Reseña",
    };

    const ICONOS = {
        PEDIDO: "bi bi-truck-front-fill text-success",
        RESEÑA: "bi bi-star-fill text-warning",
    }

    const props = defineProps({
        notificacion: {
            type:Object
        }
    });

    function formatearHora(fecha) {
        return new Date(fecha).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    }
</script>

<template>
    <div class="notificacion notificacion-card">
        <div class="d-flex flex-column gap-2">
            <h6 class="mb-3"><span :class="ICONOS[notificacion.tipo]"></span> -{{ TITULOS[notificacion.tipo] }}</h6>
            <p>{{ notificacion.mensaje }}</p>
        </div>

        <small class="hour">{{ formatearHora(notificacion.fecha) }}</small>

        <i
            class="bi check"
            :class="notificacion.leido ?  'bi-check-all active' : 'bi-check inactive'" 
        ></i>
    </div>
</template>

<style scoped>
    .notificacion{
        position: relative;
        padding: 1rem;
        transition: background .2s;
    }

    .notificacion:hover{
        background: rgb(245,245,245);
    }

    .notificacion-card {
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        transition: .2s;
    }

    .notificacion-card:hover{
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .check{
        position: absolute;
        right: 12px;
        bottom: 12px;
        font-size: 1.1rem;
    }

    .hour{
        position: absolute;
        right: 12px;
        top: 12px;
        font-size: 0.75rem;
    }

    .active {
        color: rgb(0, 117, 172);
    }
    
    .inactive {
        color: grey;
    }

    p{
        font-size: 0.90rem;
    }

</style>