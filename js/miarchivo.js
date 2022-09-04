
buscoProductosEnBaseDeDatos();

const arrayBaseDeDatos = [];

//fetch para buscar productos de mi base de datos
function buscoProductosEnBaseDeDatos() {
    return (
        fetch("js/data.json")
            .then((response) => response.json())
                .then(informacion => {                        
                    informacion.forEach((producto) => {
                        arrayBaseDeDatos.push(
                            new Zapatilla(                        
                                producto.id,
                                producto.marca,
                                producto.precio,
                                producto.stock,
                                producto.precioPorCantidad,
                                producto.seleccionado
                            )
                        );
                    })})
                    
                    .then(() => {
                        cargarInicioAlHtml(arrayBaseDeDatos);                            
                    })
            
    )    
}


function darFuncionamientoAMarca(numeroID, limiteStock, precioPorCantidadZapa, totalAgregado, nombreZapa){
    const botonMenos = document.getElementById(`boton-menos-${numeroID}`);
    const botonMas = document.getElementById(`boton-mas-${numeroID}`);
    const cantidad = document.getElementById(`cantidad-${numeroID}`);
    const agregarCarrito = document.getElementById(`boton-agregar-carrito-${numeroID}`);
    const vaciarCarrito = document.getElementById("vaciarCarrito");
    const mostrandoEnTotalAgregado = document.getElementById(`multiPrecioCantidad-${numeroID}`)
    
    //boton agregar al carrito
    agregarCarrito.addEventListener('click', function(){
        if (cantidad.value > 0){
            let cantidadSeleccionada = Number(cantidad.value);
           
            const zapa =  arrayBaseDeDatos.find(zapa => zapa.id == numeroID)
            zapa.stock -= cantidadSeleccionada;
            cargarInicioAlHtml(arrayBaseDeDatos);
            
            cantidad.value = 0;            
          
            miCarrito.push( new ZapatillaSeleccionada (numeroID, nombreZapa, totalAgregado, cantidadSeleccionada));

            actualizarHTMLDelCarrito(miCarrito);


            Toastify({
                text: `Zapatilla ${nombreZapa} agregada con exito!`,
                duration: 2000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} 
              }).showToast();

            const enJson = JSON.stringify(miCarrito);
            
            localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
        }
    })

    //vaciar carrito
    vaciarCarrito.addEventListener("click", function(){
       
        miCarrito.forEach(function(itemCarrito){
           
            let zapa = arrayBaseDeDatos.find(function(zapa){
                return itemCarrito.id == zapa.id;
            });
            zapa.stock += itemCarrito.cantidadSeleccionada;
        });

        cargarInicioAlHtml(arrayBaseDeDatos);
        miCarrito.splice(0,miCarrito.length);
        actualizarHTMLDelCarrito(miCarrito);
        localStorage.setItem("miCarrito", JSON.stringify(miCarrito));

         //aplicando sweet alert al vaciar el carrito  
           swal({
            title: "Vaciaste el carrito",
            text: "Click en OK para continuar",
            icon: "warning",
            button: "OK",
          }).then((result) => {
            swal({
                title: "Continua navegando",               
                icon: "success",
                button: "OK",})
            }          
        ) 
    });

   //botonMas suma la cantidad de zapatillas que se agregan
    botonMas.addEventListener('click', function (){

        if (cantidad.value<limiteStock){
            cantidad.value++;   // aplicando operador ternario
            totalAgregado = precioPorCantidadZapa * cantidad.value;
            mostrandoEnTotalAgregado.innerHTML= `Total a agregar: $${totalAgregado}`;
        }
    });

    botonMenos.addEventListener('click', function (){
        if(cantidad.value > 0){
           
            cantidad.value--;   // aplicando operador ternario    
            totalAgregado = precioPorCantidadZapa * cantidad.value;
            mostrandoEnTotalAgregado.innerHTML= `Total a agregar: $${totalAgregado}`;
        }
    });
}


//funcion constructora de los objetos dentro del array zapas

function Zapatilla (id, marca, precio, stock,  precioPorCantidad, seleccionado) {
    this.id = id;
    this.marca = marca;
    this.precio = precio;
    this.stock=stock;
    this.precioPorCantidad = precio * seleccionado;
    this.seleccionado = seleccionado;
}


// funcion creadora de zapatillas que se agregan al carrito miCarrito
function ZapatillaSeleccionada (id, marca, precio, cantidadSeleccionada) {
    this.id = id ;
    this.marca = marca;
    this.precio = precio;
    this.cantidadSeleccionada = cantidadSeleccionada;
    this.posicion = miCarrito.length;
}

//array que es lo que compraria el usuario

let carritoGuardado = JSON.parse(localStorage.getItem("miCarrito"));
const miCarrito = carritoGuardado ?? [];
actualizarHTMLDelCarrito(miCarrito);



console.log(carritoGuardado, "viendo localstorage")

/*
localStorage.setItem("Piloto", JSON.stringify(miObjeto));
//Para leer el objeto Json
var piloto = JSON.parse(localStorage.getItem("Piloto"));
*/


function actualizarHTMLDelCarrito(elementosDelCarrito){
    const sumall = elementosDelCarrito.map(item => item.precio).reduce((prev, curr) => prev + curr, 0);
    const elementoTotalDelCarrito = document.getElementById("totalCarrito");
    elementoTotalDelCarrito.innerHTML= `TOTAL: $${sumall}`;
    const elementoMiCarrito = document.getElementById("tablaProductosAgregados");
    elementoMiCarrito.innerHTML = "";

    //elementos del carrito
    elementosDelCarrito.forEach((producto) => {        
        const htmlLineaDelCarrito = `
            <tr>
                <td>${producto.posicion}</td>
                <td id="columID-${producto.posicion}">${producto.id}</td>
                <td id="columMarca-${producto.posicion}">${producto.marca}</td>
                <td id="columPrecio-${producto.posicion}">$${producto.precio}</td>
                <td id="columCantidad-${producto.posicion}">${producto.cantidadSeleccionada}</td>
                <td><button id="eliminarDelCarrito-${producto.posicion}">Eliminar</button></td>
                <td></td>  
            </tr>`  

        elementoMiCarrito.insertAdjacentHTML('beforeend', htmlLineaDelCarrito);
     
         //dar funcionamiento al boton eliminar
        const botonEliminar = document.getElementById(`eliminarDelCarrito-${producto.posicion}`);

        /*console.log({botonEliminar})*/
        botonEliminar.addEventListener('click', function (){
         
            const indiceAEliminar = elementosDelCarrito.findIndex(function(elemento){    
                return elemento.id == producto.id;            
            });
            let objetoCarritoEliminado = elementosDelCarrito[indiceAEliminar]
           
            let objetoProbandoOriginal = arrayBaseDeDatos.find((probando) => probando.id == objetoCarritoEliminado.id)
           
            objetoProbandoOriginal.stock = parseInt(objetoProbandoOriginal.stock) + parseInt(objetoCarritoEliminado.cantidadSeleccionada);
           
            //DEVOLVER STOCK CATALOGO
            elementosDelCarrito.splice(indiceAEliminar,1);
            actualizarHTMLDelCarrito(elementosDelCarrito);
            cargarInicioAlHtml(arrayBaseDeDatos);
            localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
            //toastify al eliminar elemento del carrito
            Toastify({
                text: `Zapatilla ${producto.marca} eliminada.`,
                duration: 2000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                  background: "linear-gradient(to right, #b0ad00,  #f52727)",
                },
                onClick: function(){} 
              }).showToast();

        });

    });
   
};


//funcion para llamar arrayBaseDeDatos al cargarinicioalhtml
function cargarInicioAlHtml(elementosDelCatalogo){

    const catalogo = document.getElementById("catalogo");

    catalogo.innerHTML = "";

    elementosDelCatalogo.forEach(function(zapa) {
        const htmlDeUnaCard = `
            <div class="card">
                <img src="./img/zapas.webp" class="card-img-top" alt="Imagen"/>
                <div class="card-body">
                    <h5 id="card-title-nombre">${zapa.marca}</h5>   
                    <p>Precio unitario: $${zapa.precio}</p>
                    <p id="multiPrecioCantidad-${zapa.id}">Total a agregar: $${zapa.precioPorCantidad}</p>
                    <p id="card-text-stock-${zapa.id}"><small type:"numer">Stock: ${zapa.stock}</small></p>
                    <button id="boton-mas-${zapa.id}" class="">+++</button>
                    <button id="boton-menos-${zapa.id}" class="">----</button>
                    <button id="boton-agregar-carrito-${zapa.id}" class="">Agregar al carrito</button>
                    <input id="cantidad-${zapa.id}" type="number" name="cantidad" value="0" readonly/> 
                    <p type="text" id="contador-${zapa.id}" class="card-text"></p>                     
                </div>             
            </div>        
        `;

        catalogo.insertAdjacentHTML('beforeend', htmlDeUnaCard);
        darFuncionamientoAMarca(zapa.id, zapa.stock, zapa.precio, zapa.precioPorCantidad, zapa.marca, zapa.seleccionado)
    });

} 


document.addEventListener('DOMContentLoaded', function(){
    cargarInicioAlHtml(arrayBaseDeDatos);  
});

