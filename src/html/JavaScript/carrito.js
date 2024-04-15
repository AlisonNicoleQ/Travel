
let itemsCarrito = {};
const lblTotal = document.getElementById('monto-total');
const btnPagar = document.getElementById('btnPagar');
btnPagar.addEventListener('click', handlePayment);
let storedClienteId = null;

if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', GetCartItems)
    console.log('lblTotal:', lblTotal);
}else{
    GetCartItems();
}

async function GetCartItems(){
    //traemos el cliente id del storage
    storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);

        try {
            const response = await fetch('/api/getCarrito', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_cliente: parseInt(storedClienteId) })
            });
            if (response.ok) {
                const data = await response.json();
                itemsCarrito = data;
                cargarTabla(itemsCarrito);

                let total = 0;
                itemsCarrito.forEach((item) => {
                    total += item.subtotal;
                });

                // Set the total amount in the UI
                lblTotal.innerText = "Total: " + total;

            } else {
                throw new Error('Failed to retrieve cart items');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    } else {
        console.log('No stored Cliente ID found.');
    }
}


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

async function processPayment(cartItems) {
    try {

        let today = new Date();
        let fecha = today.toISOString();

        const promises = cartItems.map(async (element) => {
            const response = await fetch('/api/addHistorial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },                
                body: JSON.stringify({ id_cliente: parseInt(storedClienteId), items: element.item, precio: element.precio, cantidad: element.cantidad, subtotal: element.subtotal, fecha_compra: fecha})
            });

            if (response.ok) {
                console.log('Historial de compra:', response);
                return { success: true };
            } else {
                return { success: false };
            }
        });

        // Wait for all fetch requests to complete
        const results = await Promise.all(promises);

        // Check if any request failed
        if (results.some(result => !result.success)) {
            return { success: false };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error('Error procesando pago:', error);
        return { success: false };
    }
}


async function handlePayment() {
    // Retrieve stored clienteId from sessionStorage
    let storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);

        try {
            // Fetch cart items for the client from the server
            const response = await fetch('/api/getCarrito', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_cliente: parseInt(storedClienteId) })
            });
            if (response.ok) {
                const cartItems = await response.json();

                // Process payment using cart items data
                const paymentResult = await processPayment(cartItems);

                // Handle payment result
                if (paymentResult.success) {
                    // Payment successful, display success message
                    alert('Payment successful!');
                } else {
                    // Payment failed, display error message
                    alert('Payment failed. Please try again.');
                }
            } else {
                throw new Error('Failed to retrieve cart items');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment. Please try again.');
        }
    } else {
        console.log('No stored Cliente ID found.');
        // Handle the case where the storedClienteId is null or undefined
    }
}