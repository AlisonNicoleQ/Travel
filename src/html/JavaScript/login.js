// logintest.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const name = formData.get('name'); // Extract name from form data
  const email = formData.get('email');
  const password = formData.get('password');
  const phoneNumber = formData.get('phone');

  displayCreatingAccountMessage();

  try {
      const response = await fetch('/api/clientes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre: name, telefono: phoneNumber, correo: email, contrasena: password }) // Include name in the request body
      });
  
      if (response.ok) {
          const data = await response.json();
          console.log('Cliente creado:', data);
          // hide login container
          document.getElementById("login-container").style.display = "none";
          displayResponseMessage('Account created successfully!');
          
      } else {
          const errorData = await response.json();
          console.error('Error al crear el cliente:', errorData);
          displayResponseMessage(`Error: ${errorData.message}`, true);
      }
  } catch (error) {
      console.error('Error al crear el cliente:', error);
      displayResponseMessage('Error: Network issue, please try again later.', true);
  }
});


function displayCreatingAccountMessage() {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerText = 'Creating account...';
    alertDiv.style.display = 'block';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.backgroundColor = '#ffffff'; // White background
    alertDiv.style.padding = '20px'; // Add padding for better visibility
    alertDiv.style.borderRadius = '10px'; // Rounded corners
}

function displayResponseMessage(message, isError) {
  const alertDiv = document.getElementById('alert');
  alertDiv.style.backgroundColor = isError ? '#ffcccc' : '#ffffff'; // White background for success, light red for error

  // Clear any existing content
  alertDiv.innerHTML = '';

  // Create message paragraph element
  const messageParagraph = document.createElement('p');
  messageParagraph.textContent = message;

  // Append message paragraph to alertDiv
  alertDiv.appendChild(messageParagraph);

  // Create OK button
  const okButton = document.createElement('button');
  okButton.textContent = 'OK';
  okButton.style.marginTop = '10px'; // Add some margin between message and button

  // Add event listener to hide alert on OK button click
  okButton.addEventListener('click', () => {
      alertDiv.style.display = 'none';
  });

  // Append OK button to alertDiv
  alertDiv.appendChild(okButton);

  // Make the alertDiv visible
  alertDiv.style.display = 'block';
}
