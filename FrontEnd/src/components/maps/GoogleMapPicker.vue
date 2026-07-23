<template>

    <input
        ref="searchInput"
        class="buscador"
        placeholder="Buscar ubicación..."
    />

    <div 
        ref="mapElement"
        class="mapa">
    </div>

</template>


<script setup>

import { ref, onMounted } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";


const mapElement = ref(null);
const searchInput = ref(null);


const emit = defineEmits([
    "ubicacionSeleccionada"
]);


const ubicacionInicial = {
    lat: 9.9281,
    lng: -84.0907
};



onMounted(async () => {


    setOptions({
        key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        v: "weekly"
    });

    const { Map } = await importLibrary("maps");
    const { Autocomplete } = await importLibrary("places");

    const map = new Map(
        mapElement.value,
        {
            center: ubicacionInicial,
            zoom: 14
        }
    );

    const marker = new google.maps.Marker({
        map,
        position: ubicacionInicial,
        draggable: true
    });



    configurarBuscador(
        Autocomplete,
        map,
        marker
    );



    configurarClickMapa(
        map,
        marker
    );



    configurarArrastreMarker(
        marker
    );


});


function configurarBuscador(Autocomplete,map,marker){

    const autocomplete = new Autocomplete(
        searchInput.value,
        {
            componentRestrictions:{
                country:"cr"
            }
        }
    );


    autocomplete.addListener(
        "place_changed",
        () => {
            const lugar =
                autocomplete.getPlace();

            if(!lugar.geometry){
                return;
            }

            const posicion = {
                lat: lugar.geometry.location.lat(),
                lng: lugar.geometry.location.lng()
            };

            moverMapa(
                map,
                marker,
                posicion
            );

            emit(
                "ubicacionSeleccionada",
                posicion
            );

        }
    );

}



function configurarClickMapa(
    map,
    marker
){

    map.addListener(
        "click",
        (event)=>{


            const posicion = {
                lat:event.latLng.lat(),
                lng:event.latLng.lng()
            };


            marker.setPosition(
                posicion
            );


            emit(
                "ubicacionSeleccionada",
                posicion
            );

        }
    );

}



function configurarArrastreMarker(
    marker
){

    marker.addListener(
        "dragend",
        ()=>{

            const posicion =
                marker.getPosition();


            emit(
                "ubicacionSeleccionada",
                {
                    lat: posicion.lat(),
                    lng: posicion.lng()
                }
            );


        }
    );

}


function moverMapa(
    map,
    marker,
    posicion
){

    map.setCenter(
        posicion
    );


    map.setZoom(
        16
    );


    marker.setPosition(
        posicion
    );

}


</script>



<style scoped>

.buscador{
    width:40%;
    padding:10px;
    margin-bottom:10px;
}


.mapa{
    width:40%;
    height:400px;
    border-radius:10px;
}

</style>