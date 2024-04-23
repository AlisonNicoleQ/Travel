// Inicializar el mapa

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado');

    var map = L.map('map-container').setView([8.5664, -83.578], 10); // Coordenadas del Parque Nacional Corcovado

// Agregar capa de mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var markers = L.layerGroup(); // Grupo de marcadores

// Ejemplo de datos de puntos de interés
var pointsOfInterest = [
    { name: "Tour 1", latlng: [8.5664, -83.578], type: "tour" },
    { name: "Hotel 1", latlng: [8.57, -83.58], type: "hotel" },
    {
        name: "PARQUE NACIONAL CORCOVADO",
        latlng: [8.56, -83.59],
        type: "attraction",
        description: "Esta es una descripción del Parque Nacional Corcovado.",
        photo: "https://example.com/corcovado.jpg"
    }
];

// Iterar sobre los datos y crear los marcadores
pointsOfInterest.forEach(function (point) {
    var marker = L.marker(point.latlng);
    marker.bindPopup(point.name);
    marker.feature = { properties: { type: point.type } }; // Asignar tipo al marcador
    markers.addLayer(marker);
});

markers.addTo(map); // Añadir marcadores al mapa

function filterMarkers() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var filterValues = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Iterar sobre todos los marcadores y mostrar u ocultar según los filtros seleccionados
    markers.eachLayer(function (marker) {
        var markerType = marker.feature.properties.type;
        if (filterValues.includes(markerType)) {
            map.addLayer(marker); // Cambiado de `marker.addTo(map)` a `map.addLayer(marker)`
        } else {
            map.removeLayer(marker);
        }
    });
}
});

