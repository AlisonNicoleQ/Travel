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
  const name = formData.get('name');
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
          
          document.getElementById("login-container").style.display = "none";

          userProfile.classList.remove('hide');
          displayResponseMessage('Account created successfully!');
          const cliente = data.cliente;
          const clienteName = cliente.nombre;
          const clienteEmail = cliente.correo;
          const clientePhone = cliente.telefono;
          clienteId = cliente.ID_cliente;

          console.log('Cliente Creado ID:', clienteId)
          sessionStorage.setItem('clienteId', clienteId);

          // Poner los valores en el HTML
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
            sessionStorage.setItem('clienteId', clienteId);

            // Poner los valores en el HTML
            document.getElementById("user-name").textContent = clienteName;
            document.getElementById("user-email").textContent = clienteEmail;
            document.getElementById("user-phone").textContent = clientePhone;
            document.getElementById("user-password").textContent = password;
            document.getElementById("user-photo").textContent = cliente.imagen;

        } else {
            const errorData = await response.json();
            displayResponseMessage(`Error: ${errorData.message}`, true)
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error: Internal server error');
    }
});  


function displayCreatingAccountMessage(msg) {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerText = msg || 'Creating account...', 
    alertDiv.style.display = 'block';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.backgroundColor = '#ffffff'; 
    alertDiv.style.padding = '20px'; 
    alertDiv.style.borderRadius = '10px'; 
}

function displayResponseMessage(message, isError) {
  const alertDiv = document.getElementById('alert');
  alertDiv.style.backgroundColor = isError ? '#ffcccc' : '#ffffff'; // Cambiar color de fondo

  // quitamos el contenido del div
  alertDiv.innerHTML = '';

  // creamos un parrafo
  const messageParagraph = document.createElement('p');
  messageParagraph.textContent = message;

  // agregamos el mensaje al div
  alertDiv.appendChild(messageParagraph);

  // Crear el boton
  const okButton = document.createElement('button');
  okButton.textContent = 'OK';
  okButton.style.marginTop = '10px'; // agregar margen superior

  // agregar evento del boton ok
  okButton.addEventListener('click', () => {
      alertDiv.style.display = 'none';
  });

  // agregar el boton ok
  alertDiv.appendChild(okButton);

  // Display alert
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
            input.id = span.id.replace('user-', ''); // Eliminando el prefijo 'user-' del id del span
            span.parentNode.replaceChild(input, span);
        });
        button.textContent = 'Save';
    } else {
        var inputFields = document.querySelectorAll('.user-info input');
        inputFields.forEach(function(input) {
            var span = document.createElement('span');
            span.textContent = input.value;
            span.id = 'user-' + input.id; // Poniendo el prefijo 'user-' al id del span
            input.parentNode.replaceChild(span, input);

            // USando el id del input como key para el objeto updatedInfo
            updatedInfo[input.id] = input.value;
        });

        console.log('Updated info:', updatedInfo);
        
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

//get user preferences:
document.getElementById('button_pref').addEventListener('click', async function() {
    // Get the value of the checkbox
    var notificationsCheckbox = document.getElementById('notificaciones');
    var notificationsValue = notificationsCheckbox.checked;
    
    // Get all radio buttons
    var radioButtons = document.querySelectorAll('.user-settings input[type="radio"]');
    
    // Object to store preferences
    var preferences = {
        notificaciones: notificationsValue
    };
    
    // Iterate through each radio button
    radioButtons.forEach(function(radioButton) {
        // Check if the radio button is checked
        if (radioButton.checked) {
            // Add radio button value to the object using the radio button name as key
            preferences[radioButton.name] = radioButton.value;
        }
    });

    // Log the preferences object
    console.log("User Preferences:", preferences);
    UpdatePref(preferences);
});


//update user preferences: 
//actualizamos las preferncias del usuario
async function UpdatePref(preferences){
    var preferencias = {
        notificaciones: preferences.notificaciones,
        moneda: preferences.moneda,
    }
    //creamos un objeto el cual puede ser utilizado despues para procesar esos datos mas facil

    const idioma = parseInt(preferences.idioma); //idioma se guarda como un int, ya que es una relacion foranea.
    console.log('Idioma:', idioma);

    var preferenciasString = JSON.stringify(preferencias);
    console.log(preferenciasString)

    try {
        const response = await fetch('/api/updatePreferences', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ID_cliente: clienteId, Preferencias: preferenciasString, idioma: idioma})
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

//Funcion para eliminar el id de la sesion
function Logout(){
    sessionStorage.removeItem('clienteId');

    console.log('Removed clienteId from session storage. Logged Out');
}