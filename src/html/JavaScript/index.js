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
