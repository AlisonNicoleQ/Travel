//index.js

document.addEventListener('DOMContentLoaded', () => {
    const storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);
        // Do something with the storedClienteId, like displaying it in the UI
    } else {
        console.log('No stored Cliente ID found.');
        // Handle the case where the storedClienteId is null or undefined
    }
});

/* var navBar = document.querySelector('.section-navBar');
        
        // Función para fijar la barra de navegación
        function fixNavBar() {
            if (window.scrollY > navBar.offsetTop) {
                navBar.style.position = 'fixed';
                navBar.style.top = '0';
            } else {
                navBar.style.position = 'static';
            }
        }
        
        // Llamar a la función al cargar y desplazar la página
        window.addEventListener('load', fixNavBar);
        window.addEventListener('scroll', fixNavBar); */