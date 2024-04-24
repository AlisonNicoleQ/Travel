document.addEventListener('DOMContentLoaded', function () {
    // Obtener las actividades
    const actividades = [
        {
            title: 'Tour Bosque Nuboso de Monteverde',
            start: '2024-04-20T09:00',
            image: '../style/imgActividades/Tour por el Bosque Nuboso de Monteverde.jpg',
            price: '₡20000'
        },
        {
            title: 'Tour Isla Tortuga Cruiser',
            start: '2024-04-21T10:00',
            image: '../style/imgActividades/Isla Tortuga Cruiser.jpg',
            price: '₡80000'
        },
        {
            title: 'Recorrido nocturno en Monteverde',
            start: '2024-04-22T18:00',
            image: '../style/imgActividades/Recorrido nocturno en Monteverde.jpg',
            price: '₡15000'
        },
        {
            title: 'Tour Parque Nacional Marino Ballena',
            start: '2024-04-23T11:30',
            image: '../style/imgActividades/Tour Parque Nacional Marino Ballena.jpg',
            price: '₡45000'
        },
        {
            title: 'Adventure Park Vista Golfo',
            start: '2024-04-24T14:00',
            image: '../style/imgActividades/Adventure Park Vista Golfo.jpg',
            price: '₡55000'
        },
        {
            title: 'Tour puentes colgantes',
            start: '2024-04-25T15:30',
            image: '../style/imgActividades/puentes colgantes en la selva tropical.jpg',
            price: '₡65000'
        },
        {
            title: 'Jungle & Rivers Buggy & Crocodile tour',
            start: '2024-04-26T16:45',
            image: '../style/imgActividades/Jungle & Rivers Buggy.jpg',
            price: '₡85000'
        },
        {
            title: 'Tour de Bioluminiscencia',
            start: '2024-04-27T08:30',
            image: '../style/imgActividades/Tour de Bioluminiscencia en Kayak.jpg',
            price: '₡20000'
        }
    ];

    // Inicializar FullCalendar
    $('#calendario').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultDate: '2024-04-20',
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventLimit: true, // allow "more" link when too many events
        events: actividades,
        eventRender: function(event, element) {
            element.find('.fc-title').html(`<span class="titulo-item">${event.title}</span> <br> <img src="${event.image}" alt="" class="img-item">`);
            element.find('.fc-time').html(`Precio: ${event.price}`);
        }
    });
});
