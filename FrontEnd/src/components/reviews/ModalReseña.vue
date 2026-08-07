<script setup>
import Reseña from './Reseña.vue';
import { ref, onMounted } from "vue";

    const emit = defineEmits(["cerrar", "guardar", "editar"]);

    const props = defineProps({
        modo: {
            type: String,
            default: "crear"
        },
        reseña: {
            type: Object,
            default: null
        }
    })

    const comentario = ref("");
    const calificacion = ref(0);
    const advertencia = ref(false);

    function guardar() {
        if (calificacion.value === 0) {
            advertencia.value = true;
            return;
        }

        if(props.modo === "crear"){
            advertencia.value = false;
            emit("guardar", {
                comentario: comentario.value,
                calificacion: calificacion.value
            });

        }else{
            emit("editar", {
                comentario: comentario.value,
                calificacion: calificacion.value
            });
        }
        
    }

    function asignarValores(){
        calificacion.value = props.reseña.calificacion;
        comentario.value = props.reseña.comentario;
    }

    onMounted(() => {
        if(props.modo === "editar"){
            asignarValores();
        }
    });

</script>

<template>
    <div class="overlay">
        <form class="modal-box" @submit.prevent="guardar">
            <div class="d-flex flex-column justify-content-start">
                <i @click="emit('cerrar')" class="bi bi-x cerrar-modal"></i>
                <h3 class="mb-0">{{ modo === "crear" ? "Nueva Reseña" : "Editar Reseña" }}</h3>
            </div>

            <div class="d-flex flex-column gap-2 pt-3">
                <label>Calificacion:</label>
                <div class="d-flex gap-1">
                    <i  
                        v-for="estrella in 5"  
                        :key="estrella"
                        class="bi estrella"
                        :class="estrella <= calificacion ? 'bi-star-fill' : 'bi-star'"   
                        @click="calificacion = estrella"           
                    ></i>
                </div>

                <small class="text-danger" v-if="advertencia">Selecciona una calificacion</small>

                <div class="d-flex flex-column gap-2 pt-3">
                    <label>Comentario:</label>
                    <textarea placeholder="Escibre tu opinion" v-model="comentario" required></textarea>
                </div>
            </div>

            <button type="submit" class="btn btn-success mt-3">
                <strong>{{ modo === "crear" ? "Publicar" : "Guardar" }}</strong>
            </button>
        </form>
    </div>
</template>

<style scoped>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.5);
        z-index: 9999;

        display:flex;
        justify-content:center;
        align-items:center;
    }


    .modal-box {
        background:white;
        padding:30px;
        border-radius:16px;
        width: 90%;
        max-width: 600px;
    }

    i {
        font-size: 2rem;
        color: #FFA401;
        cursor: pointer;
        transition: transform .15s;
    }

    i:hover {
        transform: scale(1.15);
    }

    .estrella {
        font-size:1.5rem;
    }

    textarea {
        width: 100%;
        min-height: 150px;
        resize: vertical;
        max-height: 300px;
    }

    .cerrar-modal:hover {
        transform: none;
    }

</style>