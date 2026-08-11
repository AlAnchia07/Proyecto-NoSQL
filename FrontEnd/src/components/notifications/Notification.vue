<script setup>
    const TITULOS = {
        PEDIDO_ENVIADO: "Tu pedido ha sido recibido",
        PEDIDO_RECIBIDO: "Has recibido un pedido",
        RESEÑA: "Has recibido una reseña",
    };

    const ICONOS = {
        PEDIDO_ENVIADO: "bi bi-truck-front-fill text-success",
        PEDIDO_RECIBIDO: "bi bi-truck-front-fill text-success",
        RESEÑA: "bi bi-star-fill text-warning",
    }

    const ESTADOS_PEDIDO = [
        "PENDIENTE",
        "PREPARANDO",
        "LISTO_PARA_RETIRAR",
        "ENTREGADO",
        "CANCELADO"
    ];

    const props = defineProps({
        notificacion: {
            type:Object
        }
    });

    function formatearHora(fecha) {
        return new Date(fecha).toLocaleTimeString("es-CR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function obtenerTitulo(tipo) {
        if (ESTADOS_PEDIDO.includes(tipo)) {
            return "Actualización de tu pedido";
        }
        return TITULOS[tipo] || "Notificación";
    }

    function obtenerIcono(tipo) {
        if (ESTADOS_PEDIDO.includes(tipo)) {
            return "bi bi-truck-front-fill text-success";
        }
        return ICONOS[tipo] || "";
    }
</script>

<template>
    <div class="notificacion notificacion-card">
        <div class="d-flex flex-column gap-2">
            <h6 class="mb-3"><span :class="obtenerIcono(notificacion.tipo)"></span> -{{ obtenerTitulo(notificacion.tipo) }}</h6>
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