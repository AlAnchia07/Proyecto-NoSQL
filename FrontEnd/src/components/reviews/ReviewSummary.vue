<script setup>
    import { computed } from "vue";

    const props = defineProps({
        resumen: {
            type: Array
        }
    })

    const promedio = computed(() => {
        return (props.resumen[0]?.resumen[0]?.promedio ?? 0).toFixed(2);
    });

    function claseEstrella(numero) {
        if (numero <= Math.floor(promedio.value)) {
            return "bi bi-star-fill";
        }

        if (numero - 0.5 <= promedio.value) {
            return "bi bi-star-half";
        }

        return "bi bi-star";
    }

    function cantidadEstrella(estrella){
        const resultado = props.resumen[0]?.distribucion
            .find(item => item._id === estrella);

        return resultado ? resultado.cantidad : 0;
    }

    function porcentajeEstrella(estrella){
        const cantidad = cantidadEstrella(estrella);

        const total = props.resumen[0]?.resumen[0]?.total ?? 0;

        if(total===0) return 0;

        return(cantidad / total) * 100;
    }

</script>

<template>
    <div class="container">
        <div class="d-flex gap-2 justify-content-center align-items-center">
            <div class="d-flex gap-1 flex-column justify-content-center align-items-center">
                <p class="promedio mb-0" v-if="resumen.length">
                    {{ promedio }}
                </p>
                <p class="promedio mb-0" v-else>
                    0.00
                </p>
                <div class="estrellas">
                    <i v-for="n in 5" 
                        :key="n"
                        :class="claseEstrella(n)"
                        style="color:#FFA401">
                    </i>
                </div>
                <p class="cantidad" v-if="resumen.length">
                    ( {{ resumen[0].resumen[0]?.total}} reseñas)
                </p>
                <p class="cantidad" v-else>
                    (0 reseñas)
                </p>
            </div>
        </div>
        <div>
            <div 
            v-for="estrella in 5" 
            :key="estrella" 
            class="rating-row"
>
                <div class="estrellas-label">
                    <span>{{ estrella }}</span>
                    <i class="bi bi-star-fill"></i>
                </div>

                <div class="progress">
                    <div 
                        class="progress-bar"
                        :style="{ width: porcentajeEstrella(estrella) + '%' }"
                    ></div>
                </div>

                <small class="cantidad-rating">
                    {{ cantidadEstrella(estrella) }}
                </small>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .promedio{
        font-size:2.5rem;
    }

    .cantidad {
        font-size: 0.85rem;
        color:rgb(99, 99, 99);
    }

    .rating-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.estrellas-label {
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    line-height: 1;
}

.estrellas-label i {
    color: #FFA401;
    font-size: 14px;
}

.progress {
    flex: 1;
    height: 10px;
    overflow: hidden;
}

.progress-bar {
    background-color: #FFA401;
}

.cantidad-rating {
    width: 25px;
    text-align: right;
}
</style>