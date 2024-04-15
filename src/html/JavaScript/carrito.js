
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
                cargarTabla(itemsCarrito);
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
const cargarTabla = (itemsCarrito)=>{
    let filas = "";   

    itemsCarrito.forEach((item)=>{
        filas += `
            <tr>
                <td>${item.item}</td>
                <td>${item.precio}</td>
                <td>${item.cantidad}</td>
                <td>${item.subtotal}</td>
                <td>

                <td>
                    <button type="button" class="btn btn-outline-danger" onclick="borrarItemCarrito(${ item.id_detalle_carrito })">Borrar</button>
                </td>
            </tr> 
                ` ;
    });
    tblCarrito.innerHTML = filas;
}

async function borrarItemCarrito(id) {
    if(confirm("¿Desea borrar el registro?")){
        try{
            const res = await fetch('/api/deleteCarrito', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_detalle_carrito: id })
            })

            if(res.ok){
                console.log('Item borrado:', id);
                GetCartItems();
            }
            else{
                throw new Error('Error borrando item');
            }
            
        }
        catch(error){
            console.error('Error borrando item:', error);
        }
        
    }
}
