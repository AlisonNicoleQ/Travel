// logintest.js

const userProfile = document.getElementById('user-profile');
const createAcc = document.getElementById('createAccount');
const login = document.getElementById('login');

let clienteId = null;

document.addEventListener('DOMContentLoaded', async () => { 
  // comienza "escondido"
  userProfile.classList.add('hide');
  createAcc.classList.add('hide');
});


document.getElementById('CreateAccountForm').addEventListener('submit', async (event) => {
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
          body: JSON.stringify({ nombre: name, telefono: phoneNumber, correo: email, contrasena: password })
      });
  
      if (response.ok) {
          const data = await response.json();
          console.log('Cliente creado:', data);
          // hide login container
          document.getElementById("login-container").style.display = "none";
          // show user profile
          userProfile.classList.remove('hide');
          displayResponseMessage('Account created successfully!');
          const cliente = data.cliente;
          const clienteName = cliente.nombre;
          const clienteEmail = cliente.correo;
          const clientePhone = cliente.telefono;
          clienteId = cliente.ID_cliente;

          console.log('Cliente Creado ID:', clienteId)

          // Displaying client details in HTML
          document.getElementById("user-name").textContent = clienteName;
          document.getElementById("user-email").textContent = clienteEmail;
          document.getElementById("user-phone").textContent = clientePhone;
          document.getElementById("user-password").textContent = password;
          document.getElementById("user-photo").textContent = cliente.imagen;
          
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

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const email = formData.get('login-email'); 
    const password = formData.get('login-password');
  
    displayCreatingAccountMessage('Logging in...');
  
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo: email, contrasena: password })
        });
  
        if (response.ok) {
            // Login successful
            const responseData = await response.json();
            displayResponseMessage('Logged in successfully!')
            userProfile.classList.remove('hide');
            document.getElementById("login-container").style.display = "none";

            const cliente = responseData.cliente;
            const clienteName = cliente.nombre;
            const clienteEmail = cliente.correo;
            const clientePhone = cliente.telefono;
            clienteId = cliente.ID_cliente;

            console.log('Cliente ID:', clienteId)

            // Displaying client details in HTML
            document.getElementById("user-name").textContent = clienteName;
            document.getElementById("user-email").textContent = clienteEmail;
            document.getElementById("user-phone").textContent = clientePhone;
            document.getElementById("user-password").textContent = password;
            document.getElementById("user-photo").textContent = cliente.imagen;

        } else {
            const errorData = await response.json();
            displayResponseMessage(`Error: ${errorData.message}`, true)
            // Optionally, display an error message to the user
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error: Internal server error');
        // Optionally, display an error message to the user
    }
});  


function displayCreatingAccountMessage(msg) {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerText = msg || 'Creating account...', // Default message;
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


function createAccount(){
  login.style.display = 'none';
  createAcc.classList.remove('hide');
}


async function EditInfo() {
    var button = document.getElementById('edit-info');
    var infoSpans = document.querySelectorAll('.user-info span');
    var updatedInfo = {};
    
    if (button.textContent === 'Edit') {
        infoSpans.forEach(function(span) {
            var input = document.createElement('input');
            input.value = span.textContent.trim();
            input.id = span.id.replace('user-', ''); // Setting input id without 'user-' prefix
            span.parentNode.replaceChild(input, span);
        });
        button.textContent = 'Save';
    } else {
        var inputFields = document.querySelectorAll('.user-info input');
        inputFields.forEach(function(input) {
            var span = document.createElement('span');
            span.textContent = input.value;
            span.id = 'user-' + input.id; // Setting span id with 'user-' prefix
            input.parentNode.replaceChild(span, input);

            // Using input id directly as key
            updatedInfo[input.id] = input.value;
        });

        console.log('Updated info:', updatedInfo); // Log updatedInfo object
        
        await Update(updatedInfo);

        button.textContent = 'Edit';
    }
}

async function Update(updatedInfo){
    try {

        let correo = updatedInfo.email;
        let contrasena = updatedInfo.password;
        let telefono = updatedInfo.phone;
        let nombre = updatedInfo.name;
        let imagen = updatedInfo.photo;

        console.log('Cliente a editar: [id:', clienteId,"]", "Correo:", correo, "Contraseña:", contrasena, "Telefono:", telefono, "Nombre:", nombre, "Imagen:", imagen);
                
        const response = await fetch('/api/updateCliente', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ID_cliente: clienteId, correo: correo, contrasena: contrasena, telefono: telefono, nombre: nombre, imagen: imagen})
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Cliente actualizado:', data);
            displayResponseMessage('Account updated successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar el cliente:', errorData);
            displayResponseMessage(`Error: ${errorData.error}`, true);
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        displayResponseMessage('Error: Network issue, please try again later.', true);
    }
}