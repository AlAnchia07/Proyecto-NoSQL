<script setup>
import { ref, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useUsuarioStore } from "../../stores/UsuarioStore";
import ModalGenerico from "./ModalGenerico.vue";
import ModalReseña from "./ModalReseña.vue";

const usuarioStore = useUsuarioStore();

const mostrarModal = ref(false);
const mostrarModalEdicion = ref(false);

const props = defineProps({
    reseña: {
        type: Object,
        required: true
    }
});

const emit = defineEmits([
    "borrar", "editar"
]);

function borrarReseña(){
    mostrarModal.value = false;
    emit("borrar",props.reseña._id);
}

function editarReseña(datos) {
    mostrarModalEdicion.value = false;
    emit("editar", {id: props.reseña._id, calificacion: datos.calificacion, comentario: datos.comentario});
}

function tiempoTranscurrido(fecha) {
    return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es
    });
}

onMounted(() => {
        usuarioStore.simularLogin();
    });

</script>

<template>
    <div class="card reseña-card p-2">
        <div class="card-body">

            <div class="d-flex justify-content-between">

                <div class="d-flex align-items-center gap-3">
                    <img 
                        :src="props.reseña.id_cliente.url_imagen"
                        class="img-fluid rounded-circle"
                        alt="Perfil"
                        style="width:40px;height:40px;object-fit:cover;"
                    >

                    <p class="mb-0 fw-medium">
                        {{ props.reseña.id_cliente.nombre }}
                    </p>
                </div>


                <div class="d-flex gap-2 rounded-4 py-2 px-3 rating">
                    <i class="bi bi-star-fill"></i>
                    <p class="mb-0">
                        {{ props.reseña.calificacion }}
                    </p>
                </div>

            </div>


            <div class="pt-3 comentario">
                <p>
                    {{ props.reseña.comentario }}
                </p>
            </div>

            <div class="d-flex justify-content-between">
                <small class="fecha-reseña">
                    {{ tiempoTranscurrido(props.reseña.fecha) }}
                </small>

                <div class="d-flex gap-2" v-if="usuarioStore.perfil._id === props.reseña.id_cliente._id">
                    <i class="bi bi-pencil actions text-success" @click="mostrarModalEdicion = true"></i>
                    <i class="bi bi-trash actions text-danger" @click="mostrarModal = true"></i>
                </div>
            </div>

            <Transition name="modal">
                <ModalGenerico v-if="mostrarModal" @cerrar="mostrarModal = false" >
                    <div class="d-flex flex-column justify-content-start gap-2 pt-2">
                        <h3>Eliminar Reseña</h3>
                        <p class="pt-2">¿Deseas eliminar tu reseña?</p>
                        <button class="btn btn-danger" @click="borrarReseña">Eliminar</button>
                    </div>
                </ModalGenerico>
            </Transition>
            
            <ModalReseña
                v-if="mostrarModalEdicion"
                @cerrar="mostrarModalEdicion = false"
                :modo = "'editar'"
                :reseña = props.reseña
                @editar= "editarReseña"
            />

        </div>
    </div>
</template>


<style scoped>

.reseña-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.rating {
    border: 2px solid #FFA401;
    color:#FFA401;
}

.comentario {
    color:rgb(77,77,77);
}

.fecha-reseña {
    font-size:0.75rem;
    color:rgb(99,99,99);
}

.actions{
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform .2s;
}

.actions:hover {
    transform: scale(1.15);
}

.modal-enter-active, .modal-leave-active{
    transition: opacity .2s ease;
}

.modal-enter-from, .modal-leave-active {
    opacity: 0;
}

</style>