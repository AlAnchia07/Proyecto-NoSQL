<script setup>
import { ref, onMounted, computed } from "vue";
import { obtenerReseñasRestaurante } from "@/services/ResenaService";
import { obtenerResumenReseñas } from "@/services/ResenaService";
import { eliminarReseña } from "@/services/ResenaService";
import { actualizarReseña } from "@/services/ResenaService";
import ReseñaCard from "./Reseña.vue";
import FiltradoReseña from "./FiltradoReseñas.vue"
import FormularioReseña from "./FormularioReseña.vue";
import Resumen from "./ResumenReseñas.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const idRestaurante = route.params.id;

const reseñas = ref([]);
const filtroEstrellas = ref(null);
const resumen = ref([]);

const reseñasFiltradas = computed(() => {
    if(filtroEstrellas.value === null){
        return reseñas.value;
    }

    return reseñas.value.filter(reseña => reseña.calificacion === filtroEstrellas.value)
})

function cambiarFiltro(valor){
    filtroEstrellas.value = valor;
}

async function cargarReseñas() {
    try {
        const datos = await obtenerReseñasRestaurante(
            idRestaurante
        );

        reseñas.value = datos;

    } catch(error) {
        console.error(error);
    }
}

async function cargarResumen() {
    try{
        const datos = await obtenerResumenReseñas(
            idRestaurante
        )
        console.log(resumen)
        resumen.value = datos

    }catch (error){
        console.log(error);
    }
}

async function borrarReseña(id) {
    try{
        const respuesta = await eliminarReseña(
            id
        )

        console.log(respuesta);

        if(respuesta.confirmacion){
            console.log("Actualizando...");
            actualizarTodo();
        }

    }catch (error){
        console.log(error);
    }
}

async function modificarReseña(datos) {
    try{
        const respuesta = await actualizarReseña(
            datos.id, 
            {
                comentario: datos.comentario, 
                calificacion: datos.calificacion
            }
        )

        console.log(respuesta);

        if(respuesta.confirmacion){
            console.log("Actualizando...");
            actualizarTodo();
        }

    }catch (error){
        console.log(error);
    }
}

async function actualizarTodo() {
    await cargarReseñas();
    await cargarResumen();
}

onMounted(actualizarTodo);



</script>

<template>
    <div class="container d-flex flex-column gap-3 pt-4">

        <div class="d-flex justify-content-between pb-2">
            <Resumen :resumen="resumen"/>
        </div>

        <div class="d-flex flex-wrap gap-3 justify-content-between pb-2">
            <FiltradoReseña @filtrar="cambiarFiltro" :etiquetas="resumen"/>
            <FormularioReseña @actualizar="actualizarTodo" :idRestaurante="idRestaurante"/>
        </div>

        <TransitionGroup name="lista-reseñas" tag="div" class="d-flex flex-column gap-3">
            <ReseñaCard
                v-for="reseña in reseñasFiltradas"
                :key="reseña._id"
                :reseña="reseña"
                @borrar="borrarReseña"
                @editar="modificarReseña"
            />
        </TransitionGroup>
        
    </div>
</template>

<style scoped>
    .lista-reseñas-enter-active, .lista-reseñas-leave-active {
        transition: all 0.3s ease;
    }

    .lista-reseñas-enter-from {
        opacity: 0;
        transform: translateY(20px);
    }

    .lista-reseñas-leave-to{
        opacity: 0;
        transform: translateY(-20px);
    }
</style>