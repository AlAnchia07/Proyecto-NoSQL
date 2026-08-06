<script setup>
    const emit = defineEmits(["cerrar"]);
</script>

<template>
    <div class="overlay">
        <div class="modal-box">
            <div class="d-flex flex-column justify-content-start">
                <i @click="emit('cerrar')" class="bi bi-x cerrar-modal"></i>
            </div>
            <slot></slot>
        </div>
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
        width: 50%;
        max-width: 400px;
    }

    i {
        font-size: 2rem;
        cursor: pointer;
        transition: transform .15s;
    }

    i:hover {
        color:red;
    }

    .cerrar-modal{
        display: inline-block;
        width: fit-content;
    }
</style>