document.addEventListener('DOMContentLoaded', function () {
    const listaReservas = document.getElementById('lista-reservas');

    function eliminarReserva(event) {
        const reserva = event.target.parentElement;
        reserva.remove();
    }

    function agregarReserva(titulo, precio, imagen) {
        const reservaItem = document.createElement('li');
        reservaItem.classList.add('reserva-item');

        const markup = `
            <img src="${imagen}" alt="">
            <div class="info-reserva">
                <p class="titulo-reserva">${titulo}</p>
                <p class="precio-reserva">Precio: ₡${precio}</p>
                <button class="eliminar-reserva" title="Eliminar Reserva"><i class="fas fa-trash"></i></button>
                <div class="apuntes" contenteditable="true" placeholder="Apuntes..."></div>
                <div class="reseña" contenteditable="true" placeholder="Escribe una reseña..."></div>
            </div>
        `;

        reservaItem.innerHTML = markup;
        listaReservas.appendChild(reservaItem);

        reservaItem.querySelector('.eliminar-reserva').addEventListener('click', eliminarReserva);
    }

    // Ejemplo de reserva preexistente
    agregarReserva('Tour Bosque Nuboso de Monteverde', 20000, '../style/imgActividades/Tour por el Bosque Nuboso de Monteverde.jpg');
    agregarReserva('Tour Isla Tortuga Cruiser', 80000, '../style/imgActividades/Isla Tortuga Cruiser.jpg');
    agregarReserva('Recorrido nocturno en Monteverde', 15000, '../style/imgActividades/Recorrido nocturno en Monteverde.jpg');

});
