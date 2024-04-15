let itemsCarrito = {};

if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', GetCartItems)
}else{
    GetCartItems();
}

async function GetCartItems(){
    // Retrieve stored clienteId from sessionStorage
    let storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);
        // Fetch cart items for the client from the server
        try {
            const response = await fetch('/api/getCarrito', {
                method: 'PUT', // Use PUT method for retrieving cart items
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_cliente: parseInt(storedClienteId) })
            });
            if (response.ok) {
                const data = await response.json();
                itemsCarrito = data; // Store retrieved cart items in itemsCarrito object
                console.log('Cart items retrieved:', itemsCarrito);
            } else {
                throw new Error('Failed to retrieve cart items');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    } else {
        console.log('No stored Cliente ID found.');
        // Handle the case where the storedClienteId is null or undefined
    }
}


//   2. GENERAL 
const tblCarrito = document.querySelector("#tblCarrito tbody");
const frm = document.querySelector("#frm")
var idSeleccionado = null;


// 3. METODOS
const cargarTabla = ()=>{
    let filas = "";
    

    itemsCarrito.forEach((item, indice)=>{
        filas += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.apellido}</td>
                <td>${item.direccion}</td>
                <td>${item.correo}</td>
                <td>

                <td>
                    <button type="button" class="btn btn-outline-danger" onclick="borraPersona(${ indice })">Borrar</button>
                </td>
            </tr> 
                ` ;
    });
    tblCarrito.innerHTML = filas;
}

cargarTabla();

function borraPersona(id) {
    if(confirm("¿Desea borrar el registro?")){
        itemsCarrito.splice(id,1)
        cargarTabla();
    }
}
