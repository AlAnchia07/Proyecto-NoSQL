<script setup>
    import {ref} from "vue";

    const emit = defineEmits([
        "filtrar"
    ]);

    const props = defineProps({
        etiquetas: {
            type: Array
        }
    })

    const filtroActivo = ref(null);

    function seleccionarFiltro(valor) {
        filtroActivo.value = valor;
        emit("filtrar",valor);
    }
</script>

<template>
    <div>
        <div class="d-flex justify-content-start gap-2 flex-wrap" >
            <div class="d-flex gap-2 rounded-4 py-2 px-3 rating" @click="seleccionarFiltro(null)" :class="{ active: filtroActivo === null }">
                <p class="mb-0">Todas</p>
            </div>
            <div class="d-flex gap-2 rounded-4 py-2 px-3 rating" v-for="etiqueta in etiquetas[0]?.distribucion" :key="etiqueta._id" 
            @click="seleccionarFiltro(etiqueta._id)" :class="{active: filtroActivo === etiqueta._id}">
                <i class="bi bi-star-fill"></i>
                <p class="mb-0">
                    {{ etiqueta._id }}
                </p>
                <p class="mb-0">({{ etiqueta.cantidad }})</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .rating {
        border: 2px solid #FFA401;
        color:#FFA401;
    }

    .rating:hover{
        color:white;
        background: #FFA401;
        cursor: pointer;
    }
    
    .active{
        color:white;
        background: #FFA401;
    }


</style>