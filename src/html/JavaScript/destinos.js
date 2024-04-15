//Variable 
var reservaVisible = false;
let storedClienteId = null;

//Ayuda a que la pagina recarge primero
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){
    
    //Btn para eliminar la reserva
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i=0;i<botonesEliminarItem.length; i++){
        var button = botonesEliminarItem[i];
        button.addEventListener('click',eliminarItemReserva);
    }

    //Btn suma
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(var i=0;i<botonesSumarCantidad.length; i++){
        var button = botonesSumarCantidad[i];
        button.addEventListener('click',sumarCantidad);
    }

     //Btn resta
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for(var i=0;i<botonesRestarCantidad.length; i++){
        var button = botonesRestarCantidad[i];
        button.addEventListener('click',restarCantidad);
    }

    //Btn reserva
    var botonesAgregarReserva = document.getElementsByClassName('boton-item');
    for(var i=0; i<botonesAgregarReserva.length;i++){
        var button = botonesAgregarReserva[i];
        button.addEventListener('click', agregarReservaClicked);
    }

    //Btn pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClicked)

    //Conseguimos el ID del cliente
    storedClienteId = sessionStorage.getItem('clienteId');
        if (storedClienteId) {
            console.log('Stored Cliente ID:', storedClienteId);
            // Do something with the storedClienteId, like displaying it in the UI
        } else {
            console.log('No stored Cliente ID found.');
            // Handle the case where the storedClienteId is null or undefined
        }
}

async function pagarClicked() {
    // Gather information about selected items
    const items = document.querySelectorAll('.reserva-item');

    const reservationData = [];

    items.forEach(async item => {
        const title = item.querySelector('.reserva-item-titulo').innerText;
        const priceString = item.querySelector('.reserva-item-precio').innerText;
        const quantityString = item.querySelector('.reserva-item-cantidad').value;

        const price = parseFloat(priceString.replace('₡', '').replace(',', ''));
        const subtotal = price * quantityString;
        const quantity = parseInt(item.querySelector('.reserva-item-cantidad').value);

        console.log("Price" + price);
        console.log("subtotal" + subtotal);


        reservationData.push({ title, priceString, quantityString });

        // Send reservation data to the server
        const res = await fetch('/api/addCarrito', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_cliente: parseInt(storedClienteId), item: title, precio: price, cantidad: quantity, subtotal: subtotal})
        })
        if(res.ok){
            const data = await res.json();
            console.log('Item added to cart:', data);

            var reservaItems = document.getElementsByClassName('reserva-items')[0];
            while (reservaItems.hasChildNodes()){
                reservaItems.removeChild(reservaItems.firstChild)
            }

            actualizarTotalReserva();
            ocultarReserva();
        }
        else{
            const errorData = await res.json();
            console.error('Error adding item to cart:', errorData);
        }
    });    
}

//Funcion que controla el boton clickeado de agregar a la lista de resevas
function agregarReservaClicked(event){
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    console.log(imagenSrc);

    agregarItemAReserva(titulo, precio, imagenSrc);

    hacerVisibleReserva();
}

//Funcion que hace visible la lista de reservas
function hacerVisibleReserva(){
    reservaVisible = true;
    var reserva = document.getElementsByClassName('reserva')[0];
    reserva.style.marginRight = '0';
    reserva.style.opacity = '1';

    var items =document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

//Funcion que agrega un destino a la lista de la reserva
function agregarItemAReserva(titulo, precio, imagenSrc){
    var item = document.createElement('div');
    item.classList.add = ('item');
    var itemsReserva = document.getElementsByClassName('reserva-items')[0];

    //Evitar repetir el destino
    var nombresItemsReserva = itemsReserva.getElementsByClassName('reserva-item-titulo');
    for(var i=0;i < nombresItemsReserva.length;i++){
        if(nombresItemsReserva[i].innerText==titulo){
            alert("El destino ya está en la lista");
            return;
        }
    }

    var itemReservaContenido = `
        <div class="reserva-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="reserva-item-detalles">
                <span class="reserva-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="reserva-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="reserva-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    item.innerHTML = itemReservaContenido;
    itemsReserva.append(item);

    //Eliminar nuevo destino
     item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemReserva);

    //Restar cantidad de personas
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click',restarCantidad);

    //Sumar cantidad de personas
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click',sumarCantidad);

    //Actualizar total
    actualizarTotalReserva();
}
//Aumentar en uno la cantidad de personas
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('reserva-item-cantidad')[0].value);
    var cantidadActual = selector.getElementsByClassName('reserva-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('reserva-item-cantidad')[0].value = cantidadActual;
    actualizarTotalReserva();
}
//Resto en uno la cantidad de personas
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('reserva-item-cantidad')[0].value);
    var cantidadActual = selector.getElementsByClassName('reserva-item-cantidad')[0].value;
    cantidadActual--;
    if(cantidadActual>=1){
        selector.getElementsByClassName('reserva-item-cantidad')[0].value = cantidadActual;
        actualizarTotalReserva();
    }
}


//Elimina destino seleccionado
function eliminarItemReserva(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    //Actualiza el total 
    actualizarTotalReserva();

    //reconoce si hay elementos en la lista de reserva
    //Si no hay se oculta
    ocultarReserva();
}



//Funcion que controla si hay elementos en la lista. Si no hay se oculta.
function ocultarReserva(){
    var reservaItems = document.getElementsByClassName('reserva-items')[0];
    if(reservaItems.childElementCount==0){
        var reserva = document.getElementsByClassName('reserva')[0];
        reserva.style.marginRight = '-100%';
        reserva.style.opacity = '0';
        reservaVisible = false;
    
        var items =document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}


//Actualiza el total
function actualizarTotalReserva(){
    //seleccionamos el contenedor carrito
    var reservaContenedor = document.getElementsByClassName('reserva')[0];
    var reservaItems = reservaContenedor.getElementsByClassName('reserva-item');
    var total = 0;
    //recorre cada destino en la lista para actualizar el total
    for(var i=0; i< reservaItems.length;i++){
        var item = reservaItems[i];
        var precioElemento = item.getElementsByClassName('reserva-item-precio')[0];
   
        var precio = parseFloat(precioElemento.innerText.replace('₡','').replace('.',''));
        var cantidadItem = item.getElementsByClassName('reserva-item-cantidad')[0];
        console.log(precio);
        var cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100)/100;

    document.getElementsByClassName('reserva-precio-total')[0].innerText = '₡'+total.toLocaleString("es") + "";

}








