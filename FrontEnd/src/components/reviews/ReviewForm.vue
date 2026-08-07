<script setup>
    import { ref, onMounted } from "vue";
    import { crearReseña } from "@/services/ResenaService";
    import ModalReseña from "./ModalReseña.vue";
    import { useUsuarioStore } from "@/stores/UsuarioStore.js";

    const usuarioStore = useUsuarioStore();
    const mostrarModal = ref(false);

    const props = defineProps({
        modo: {
            type: String,
            default: "crear"
        },
        idRestaurante: {
            type: String
        }
    })

    const emit = defineEmits([
        "actualizar"
    ]);

    async function guardarReseña(datos){
        if(props.modo === "editar"){
            //Editar
        } else {
            try{
                const nuevaReseña = {
                    id_cliente: usuarioStore.perfil._id,
                    id_restaurante: props.idRestaurante,
                    comentario: datos.comentario,
                    calificacion: datos.calificacion
                };

                const respuesta = await crearReseña(nuevaReseña);
                console.log(respuesta);
                mostrarModal.value = false;
                emit("actualizar");
            }catch(error){
                console.log(error);
            }
        }
    }




</script>

<template>
        <button @click="mostrarModal = true" type="button" class="btn btn-success" style="width: 12rem;">
            <i class="bi bi-pen-fill"></i>  <strong>Nueva reseña</strong>
        </button>

    <ModalReseña
        :modo="modo"
        v-if="mostrarModal"
        @cerrar="mostrarModal = false"
        @guardar = "guardarReseña"
    />
</template>

<style scoped>
    
</style>