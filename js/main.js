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
        p.innerHTML = `Precio: <strong>$${productoARenderizar.precio}</strong><br>Stock: <strong>${productoARenderizar.stock}</strong>`;

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

// Modificar stock y cantidadCarrito del producto en el array productos, y agregar producto al carrito y al Local Storage
function agregarAlCarrito(productoAAgregar, cantidadAAgregar) {

    // Modifico stock y cantidadCarrito del producto en el array original
    productos[productoAAgregar.id].cantidadCarrito += parseInt(cantidadAAgregar);
    productos[productoAAgregar.id].stock -= parseInt(cantidadAAgregar);


    // Si el carrito está vacío, agrego el producto
    if (carrito === null) {

        carrito = [productoAAgregar];

    } else {

        const indexProductoAAgregar = carrito.findIndex( (el) => {

            return el.id === productoAAgregar.id;
    
        });
    
        // Si el producto no estaba ya en el carrito, lo agrego
        indexProductoAAgregar === -1 && carrito.push(productoAAgregar);

    }

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
        tdCantidad.innerText = productoCarritoARenderizar.cantidadCarrito;

        const tdEliminar = document.createElement("td");

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-danger";
        botonEliminar.innerText = "Eliminar";

        // Eliminar del carrito (evento de click)
        botonEliminar.addEventListener("click", () => {

            let cantidadAEliminar = productoCarritoARenderizar.cantidadCarrito;

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

// Modificar stock y cantidadCarrito del producto en el array productos ///////////// NOMBRE FUNCION
function eliminarProducto(productoAEliminar, cantidadAEliminar) {

    const indexProductoAEliminar = productos.findIndex( (el) => {

        return productoAEliminar.id === el.id;

    });

    indexProductoAEliminar !== -1 && (productos[indexProductoAEliminar].cantidadCarrito -= parseInt(cantidadAEliminar)), (productos[indexProductoAEliminar].stock += parseInt(cantidadAEliminar));

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

// Mostrar alert al eliminar un producto del carrito
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

        if (carrito.length > 0) {

            alertBotonFinalizar();

        } else {

            Swal.fire({

                icon: "warning",
                title: "El carrito está vacío",
                showConfirmButton: false,
                timer: 1300

              });

        }
    });
}

// Mostrar alert y eliminar productos del carrito
function alertBotonFinalizar() {

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

          carrito = [];

          console.log(carrito);

          localStorage.setItem("carrito", JSON.stringify(carrito));

          renderizarTablaCarrito(carrito);

        }

      });
}

function totalProductos() {
    
    const total = carrito.reduce( (acc, obj) => {

        return acc + (obj.precio * obj.cantidadCarrito);

    }, 0);

    return total;

}

// Obtengo el carrito del Local Storage, para renderizar la tabla en el front
function obtenerCarritoLS() {

    carrito = JSON.parse(localStorage.getItem("carrito"));

    carrito && renderizarTablaCarrito(carrito);

}

// Obtengo los productos del archivo JSON productos.json
function obtenerProductosJSON() {
 
        fetch("../productos.json").then( (response) => {

            return response.json();

        }).then( (resJson) => {

            // Pusheo los objetos de productos.json al array vacío `productos`
            productos.push(...resJson);

            // Si no hay nada en el carrito, renderizo los productos del array `productos`
            if (carrito === null) {

                renderizarProductos(productos);

                localStorage.setItem("productos", JSON.stringify(productos));

            // Si hay algo en el carrito, obtengo los productos del Local Storage y los renderizo
            } else {

                productos = JSON.parse(localStorage.getItem("productos"));

                renderizarProductos(productos);

            }
            
        });
}

// Inicializar el select para filtrar productos por categoría
function inicializarSelectFiltro() {

    const select = document.getElementById("selectFiltro");

    select.addEventListener("click", () => {

        const value = select.value;

        switch (value) {

            case "default":

                filtrarDefault();

                break;

            case "teclados":

                filtrarTeclados();

                break;

            case "switches":

                filtrarSwitches();

                break;

            case "keycaps":

                filtrarKeycaps();

                break;

        }
    });
}

function filtrarDefault() {

    const productosFiltrados = productos.sort( (a, b) => a.id - b.id );

    renderizarProductos(productosFiltrados);

}

function filtrarTeclados() {

    const productosFiltrados = productos.filter( (el) => {

        return el.categoria === "teclados";

    });

    renderizarProductos(productosFiltrados);

}

function filtrarSwitches() {

    const productosFiltrados = productos.filter( (el) => {

        return el.categoria === "switches";

    });

    renderizarProductos(productosFiltrados);

}

function filtrarKeycaps() {

    const productosFiltrados = productos.filter( (el) => {

        return el.categoria === "keycaps";

    });

    renderizarProductos(productosFiltrados);

}

// Variables

let productos = [];

let carrito = [];

let cantidadAAgregar = 0;

// Inicio

obtenerProductosJSON();

inicializarSelectFiltro();

obtenerCarritoLS();

botonFinalizar()