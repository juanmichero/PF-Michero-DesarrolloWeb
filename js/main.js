// Funciones

// Renderizar los productos ingresados al front
function renderizarProductos(productosARenderizar) {

    const container = document.getElementById("container");
    container.innerHTML = "";

    for (const productoARenderizar of productosARenderizar) {

        const divCard = document.createElement("div");
        divCard.className = "card m-2 div-card";
        divCard.style = "width: 20rem;";

        const divCardBody = document.createElement("div");
        divCardBody.className = "card-body div-card-body";

        const h5 = document.createElement("h5");
        h5.className = "card-title";
        h5.innerText = productoARenderizar.nombre;

        const p = document.createElement("p");
        p.className = "card-text";
        p.innerHTML = `Categoria: <strong>${productoARenderizar.categoria}</strong><br>Precio: <strong>$${productoARenderizar.precio}</strong><br>Stock: <strong>${productoARenderizar.stock}</strong>`;

        const divAnadirCarrito = document.createElement("div");
        divAnadirCarrito.className = "d-inline-flex align-items-center justify-content-between";

        const botonAnadir = document.createElement("button");
        botonAnadir.className = "btn boton-anadir";
        botonAnadir.innerText = "Añadir al carrito"

        const inputCantidad = document.createElement("input");
        inputCantidad.className = "form-control w-25 ms-3 input-cantidad";
        inputCantidad.min = 1;
        inputCantidad.max = productoARenderizar.stock;
        inputCantidad.type = "number";
        inputCantidad.value = 1;

        // Agregar al carrito (evento de click)
        botonAnadir.addEventListener("click", () => {

            let cantidadAAgregar = inputCantidad.value;

            if (cantidadAAgregar > productoARenderizar.stock) {

                Swal.fire({

                    position: "center",
                    icon: "warning",
                    title: "STOCK INSUFICIENTE",
                    showConfirmButton: false,
                    timer: 1200

                  });

            } else if (cantidadAAgregar < 1){

                Swal.fire({

                    position: "center",
                    icon: "error",
                    title: "INGRESE UNA CANTIDAD VÁLIDA",
                    showConfirmButton: false,
                    timer: 1200

                  });

            } else {

                agregarAlCarrito(productoARenderizar, cantidadAAgregar);
                
            }
        });

        // Insertar elementos
        divAnadirCarrito.append(botonAnadir, inputCantidad)
        divCardBody.append(h5, p, divAnadirCarrito);
        divCard.append(divCardBody);
        container.append(divCard);

    }
}

// Agregar los productos al carrito, modificando sus valores en el array `productos`, pusheando al carrito y añadiendo al Local Storage
function agregarAlCarrito(productoAAgregar, cantidadAAgregar) {

    // Modifico stock y cantidad del producto
    productos[productoAAgregar.id].cantidad += parseInt(cantidadAAgregar);
    productos[productoAAgregar.id].stock -= parseInt(cantidadAAgregar);

    // Si el carrito está vacío, agrego el producto
    if (carrito === null || carrito.length === 0) {

        carrito = [productoAAgregar];

    } else {

        const indexProductoAAgregar = carrito.findIndex( (el) => {

            return el.id === productoAAgregar.id;
    
        });

        // Si el carrito no está vacío, pusheo el producto
        if (indexProductoAAgregar === -1) {

            carrito.push(productoAAgregar);
        
        // Si en el carrito ya estaba el producto, lo saco y lo vuelvo a agregar con la cantidad correspondiente
        } else {

            carrito.splice(indexProductoAAgregar, 1);
            carrito.push(productoAAgregar);

        }

    }

    // Subo al Local Storage los cambios en el array de productos y carrito, y renderizo en el front
    localStorage.setItem("productos", JSON.stringify(productos));

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderizarProductos(productos);

    renderizarTablaCarrito(carrito);

}

// Renderizar la tabla de productos en el carrito en el front
function renderizarTablaCarrito(productosCarritoARenderizar) {

    const tbody = document.querySelector("#carrito table tbody");
    tbody.innerHTML = "";

    for (const productoCarritoARenderizar of productosCarritoARenderizar) {

        const tr = document.createElement("tr");
        
        const tdNombre = document.createElement("td");
        tdNombre.innerText = productoCarritoARenderizar.nombre;

        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = `$${productoCarritoARenderizar.precio}`;

        const tdCantidad = document.createElement("td");
        tdCantidad.innerText = productoCarritoARenderizar.cantidad;

        const tdEliminar = document.createElement("td");

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-danger";
        botonEliminar.innerText = "Eliminar";

        // Eliminar del carrito (evento de click)
        botonEliminar.addEventListener("click", () => {

            let cantidadAEliminar = productoCarritoARenderizar.cantidad;

            eliminarProducto(productoCarritoARenderizar, cantidadAEliminar);

            eliminarDelCarrito(productoCarritoARenderizar);

            alertEliminarCarrito(productoCarritoARenderizar);

        });

        // Insertar elementos
        tdEliminar.append(botonEliminar);
        tr.append(tdNombre, tdPrecio, tdCantidad, tdEliminar);
        tbody.append(tr);
    }
}

// Modificar stock y cantidad del producto en el array productos
function eliminarProducto(productoAEliminar, cantidadAEliminar) {

    const indexProductoAEliminar = productos.findIndex( (el) => {

        return productoAEliminar.id === el.id;

    });

    indexProductoAEliminar !== -1 && (productos[indexProductoAEliminar].cantidad -= parseInt(cantidadAEliminar)), (productos[indexProductoAEliminar].stock += parseInt(cantidadAEliminar));

    localStorage.setItem("productos", JSON.stringify(productos));

    renderizarProductos(productos);

}

// Eliminar producto del carrito y del Local Storage
function eliminarDelCarrito(productoAEliminar) {

    const indexProductoAEliminar = carrito.findIndex( (el) => {

        return productoAEliminar.id === el.id;

    });

    carrito.splice(indexProductoAEliminar, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderizarTablaCarrito(carrito);

}

// Mostrar alert al eliminar un producto del carrito, dependiendo de la categoria
function alertEliminarCarrito(productoCarritoARenderizar) {

    const categoria = productoCarritoARenderizar.categoria;

    switch (categoria) {

        case "switches":

            Swal.fire({

                icon: "warning",
                title: productoCarritoARenderizar.nombre + " han sido eliminados del carrito",
                showConfirmButton: false,
                timer: 1300

            });

            break;
        
        case "keycaps":

            Swal.fire({

                icon: "warning",
                title: productoCarritoARenderizar.nombre + " han sido eliminadas del carrito",
                showConfirmButton: false,
                timer: 1300

            });

            break;

        case "teclados":

            Swal.fire({

                icon: "warning",
                title: productoCarritoARenderizar.nombre + " ha sido eliminado del carrito",
                showConfirmButton: false,
                timer: 1300

            });

            break;
            
    }

}

// Botón para finalizar compra
function botonFinalizar() {

    const botonFinalizar = document.getElementById("finalizar");

    botonFinalizar.addEventListener("click", () => {

        if (carrito === null || carrito.length < 1) {

            Swal.fire({

                icon: "warning",
                title: "El carrito está vacío",
                showConfirmButton: false,
                timer: 1300

              });

        } else {

            finalizarCompra();

        }
    });
}

// Finalizar la compra, mostrando un alert y eliminando los productos del carrito
function finalizarCompra() {

    Swal.fire({

        title: "¿Seguro que desea finalizar la compra?",
        text: "El total es $" + totalProductos(),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#23ce6b",
        cancelButtonColor: "#d33",
        confirmButtonText: "Finalizar",
        cancelButtonText: "Cancelar"

      }).then((result) => {

        if (result.isConfirmed) {

          Swal.fire({

            title: "¡Compra realizada con éxito!",
            text: "",
            icon: "success",
            showConfirmButton: false,
            timer: 1300

          });

          productosCompradosLS();

          carrito = [];

          localStorage.setItem("carrito", JSON.stringify(carrito));

          renderizarTablaCarrito(carrito);

        }

      });
}

// Calcular el precio total de los productos al finalizar la compra
function totalProductos() {
    
    const total = carrito.reduce( (acc, obj) => {

        return acc + (obj.precio * obj.cantidad);

    }, 0);

    return total;

}

// Añado los productos comprados al Local Storage, dividios por compra
function productosCompradosLS() {

    // Si no hay nada en el array de productos comprados, agrego lo que está en el carrito
    if (productosComprados === null) {

        productosComprados = [carrito];

    // Si hay algo, lo pusheo
    } else {

        productosComprados.push(carrito);

    }

    // Una vez agregados los productos al array de productos comprados, modifico la `cantidad` de cada producto del array de productos original para que vuelva a 0
    productos.forEach( (el) => {

        el.cantidad = 0;

    });

    localStorage.setItem("productos", JSON.stringify(productos));

    localStorage.setItem("compra", JSON.stringify(productosComprados));

}

// Obtengo el carrito del Local Storage, para renderizar la tabla en el front
function obtenerCarritoLS() {

    carrito = JSON.parse(localStorage.getItem("carrito"));

    carrito && renderizarTablaCarrito(carrito);

}

// Obtengo los productos comprados del Local Storage, para validar los productos a renderizar en el front
function obtenerProductosCompradosLS() {

    productosComprados = JSON.parse(localStorage.getItem("compra"));

    return productosComprados;

}

// Obtengo los productos del archivo JSON de productos
function obtenerProductosJSON() {
 
        fetch("../productos.json").then( (response) => {

            return response.json();
    
        }).then( (resJson) => {
    
            // Pusheo los objetos de productos.json al array vacío `productos`
            productos.push(...resJson);
    
            render();

        });

}

// Renderizo los productos al front dependiendo de si hay productos en el carrito o si ya fueron comprados
function render() {

    // Si no hay nada en el carrito (o en el array de productos comprados), renderizo los productos del array `productos`
    if (carrito === null || carrito.length === 0 && productosComprados === null) {

        renderizarProductos(productos);

        localStorage.setItem("productos", JSON.stringify(productos));

    // Si hay algo en el carrito, obtengo los productos del Local Storage y los renderizo
    } else {

        productos = JSON.parse(localStorage.getItem("productos"));

        renderizarProductos(productos);

    }

}

// Variables

let productos = [];

let carrito = null;

let productosComprados = null;

let cantidadAAgregar = 0;

// Inicio

obtenerCarritoLS();

obtenerProductosCompradosLS();

obtenerProductosJSON();

botonFinalizar();