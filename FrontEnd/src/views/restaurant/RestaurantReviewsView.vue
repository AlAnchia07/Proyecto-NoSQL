<template>
    <div>
        <h2><strong>Reseñas</strong></h2>
        <p>Visualiza las reseñas de tu restaurante</p>
        <ReviewList :mostrarFormulario="false" :idRestaurante="usuarioStore.perfil._id"/>
    </div>
    
</template>

<script setup>
    import ReviewList from "@/components/reviews/ReviewList.vue"
    import { useUsuarioStore } from "@/stores/UsuarioStore";
import { sr } from "date-fns/locale";

    const usuarioStore = useUsuarioStore();
    usuarioStore.simularLoginRestaurante();
</script>