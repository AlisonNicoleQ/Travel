// logintest.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const name = formData.get('name'); // Extract name from form data
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, correo: email, contrasena: password }) // Include name in the request body
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Cliente creado:', data);
        // Redirect to a different page or display a success message
      } else {
        const errorData = await response.json();
        console.error('Error al crear el cliente:', errorData);
        // Display an error message to the user
      }
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      // Handle other errors (e.g., network issues)
    }
  });
  