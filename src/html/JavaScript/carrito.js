
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

                const deleteDetalleCarrito = await fetch('/api/deleteCarrito', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_detalle_carrito: element.id_detalle_carrito })
                });

                if (deleteDetalleCarrito.ok) 
                {
                    console.log('Item borrado:', element.id_detalle_carrito);
                    GetCartItems();
                    return { success: true };
                } else 
                {
                    return { success: false };
                }
                
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

    //guardamos los valores de cada input
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    let expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const direccion = document.getElementById('direccion').value;


    //si estan vaios, retornamos y damos un error
    if (cardNumber.trim() === '' || cardName.trim() === '' || expiryDate.trim() === '' || cvv.trim() === '' || direccion.trim() === '') {
        alert('Recuerde llenar los detalles de la tarjeta.');
        return;
    }  

    const year = new Date().getFullYear();
    expiryDate = expiryDate.split('/');
    
    //convertimos la fecha de expiracion a formato de fecha
    const fechaExpConvert = new Date(`${year}-${expiryDate[0]}-${expiryDate[1]}`);


    let storedClienteId = sessionStorage.getItem('clienteId');
    if (storedClienteId) {
        console.log('Stored Cliente ID:', storedClienteId);

        try {
            // buscamos los items del carrito
            const response = await fetch('/api/getCarrito', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_cliente: parseInt(storedClienteId) })
            });
            if (response.ok) {
                const cartItems = await response.json();

                const id_detalle_carritoArray = cartItems.map((item) => item.id_detalle_carrito);

                for(const id_detalle_carrito of id_detalle_carritoArray){
                    //agregar los detalles a tabla pago. si es exitoso seguimos procesando el pago.
                    const res = await fetch('/api/addPago', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }, 
                        body: JSON.stringify({ ID_cliente: parseInt(storedClienteId), ID_tipo_m: null, id_detalle_carrito: id_detalle_carrito, numero_tarjeta: cardNumber, nombre_titular: cardName, fecha_expiracion: fechaExpConvert, cvv: parseInt(cvv), direccion: direccion})
                    });

                    if (!res.ok) {
                        //hubo un error con el pago en base de datos, retornamos un error
                        throw new Error('No se pudo procesar el pago.');
                    }
                    else{
                        //si no hubo error, seguimos con el proceso de pago
                        //verificamos si el "processPayment" es exitoso
                        const paymentResult = await processPayment(cartItems);

                        // vemo si es exitoso o no
                        if (paymentResult.success) {
                            
                            alert('Pago exitoso!');
                        } else {
                            
                            alert('Pago fallido!');
                        }
                    }
                }                
                
            } 
            else{ throw new Error('Error consiguiendo los items del carrito'); }


        } catch (error) {
            console.error('Error procesando pago:', error);
            alert('Error procesando pago. Intente de nuevo.');
        }
    } else {
        console.log('No stored Cliente ID found.');
        alert('Recuerde iniciar sesión para poder realizar la compra.');
    }
}