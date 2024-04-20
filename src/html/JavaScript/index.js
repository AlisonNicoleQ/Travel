//index.js

document.addEventListener('DOMContentLoaded', () => {
    const vamosButton = document.querySelector('.vamos-button');
    
    vamosButton.addEventListener('click', () => {
        const sectionInfo = document.getElementById('section-info');
        console.log(sectionInfo); // Verificar si sectionInfo está seleccionando correctamente el elemento
        
        if (sectionInfo) {
            const targetPosition = sectionInfo.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // Duración del desplazamiento en milisegundos
            const startTime = performance.now();
            
            const easeOutCubic = (t) => t * (2 - t);
            
            const scroll = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                window.scrollTo(0, startPosition + distance * easeOutCubic(progress));
                
                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
            };
            
            requestAnimationFrame(scroll);
        } else {
            console.error('El elemento section-info no fue encontrado.'); // Mostrar un mensaje de error si sectionInfo es null
        }
    });
    
    const storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);
        // Do something with the storedClienteId, like displaying it in the UI
    } else {
        console.log('No stored Cliente ID found.');
        // Handle the case where the storedClienteId is null or undefined
    }
});

