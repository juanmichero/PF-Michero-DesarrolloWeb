// Clases

// class Producto {

//     constructor(id, nombre, categoria, precio, stock, cantidadCarrito) {
//         this.id = id;
//         this.nombre = nombre;
//         this.categoria = categoria;
//         this.precio = precio;
//         this.stock = stock;
//         this.cantidadCarrito = cantidadCarrito;
//     }
// }

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
                    position: 'center',
                    icon: 'warning',
                    title: 'STOCK INSUFICIENTE',
                    showConfirmButton: false,
                    timer: 1200
                  });

            } else if (cantidadAAgregar < 1){

                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'INGRESE UNA CANTIDAD VÁLIDA',
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

// Agregar los productos al carrito y al Local Storage
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

// Mostrar alert al eliminar un producto del carrito ////////////// USAR SWITCH
function alertEliminarCarrito(productoCarritoARenderizar) {

    if (productoCarritoARenderizar.categoria === "switches") {

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: productoCarritoARenderizar.nombre + ' han sido eliminados del carrito',
            showConfirmButton: false,
            timer: 1300
          });

    } else if (productoCarritoARenderizar.categoria === "keycaps") {

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: productoCarritoARenderizar.nombre + ' han sido eliminadas del carrito',
            showConfirmButton: false,
            timer: 1300
          });

    } else {

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: productoCarritoARenderizar.nombre + ' ha sido eliminado del carrito',
            showConfirmButton: false,
            timer: 1300
          });

    }
}

// Modificar stock y cantidadCarrito del producto en el array productos
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

// Obtengo el carrito del Local Storage, para renderizar la tabla en el front
function obtenerCarritoLS() {

    carrito = JSON.parse(localStorage.getItem("carrito"));

    carrito && renderizarTablaCarrito(carrito);

}

// Obtengo los productos del archivo JSON productos.json
function obtenerProductosJSON() {

        fetch('../productos.json').then( (response) => {

            return response.json();

        }).then( (resJson) => {

            // Pusheo los objetos de productos.json al array vacío "productos"
            productos.push(...resJson);

            // Renderizo los productos al front
            renderizarProductos(productos);

            localStorage.setItem("productos", JSON.stringify(productos));

        });
}

// Inicializar el select para ordenar los productos por nombre y precio
/* function inicializarSelectOrden() {

    const select = document.getElementById("selectOrden");

    select.addEventListener("click", () => {

        const value = select.value;

        switch (value) {

            case "default":

                filtrarDefault();

                break;

            case "precioA":

                ordenarPorPrecioA();

                break;

            case "precioD":

                ordenarPorPrecioD();

                break;

            case "nombreAZ":

                ordenarPorNombreAZ();

                break;

            case "nombreZA":

                ordenarPorNombreZA();

                break;    

        }
    });
} */

/* function ordenarPorPrecioA() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.precio > b.precio) {

            return 1;

        } else if (a.precio < b.precio) {

            return -1;
        }

        return 0;
    });

    renderizarProductos(productosOrdenados);
} */

/* function ordenarPorPrecioD() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.precio > b.precio) {

            return -1;

        } else if (a.precio < b.precio) {

            return 1;
        }

        return 0;
    });

    renderizarProductos(productosOrdenados);
} */

/* function ordenarPorNombreAZ() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.nombre.toUpperCase() > b.nombre.toUpperCase()) {

            return 1;

        } else if (a.nombre.toUpperCase() < b.nombre.toUpperCase()) {

            return -1;

        }

        return 0;
    });

    renderizarProductos(productosOrdenados);
} */

/* function ordenarPorNombreZA() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.nombre.toUpperCase() > b.nombre.toUpperCase()) {

            return -1;

        } else if (a.nombre.toUpperCase() < b.nombre.toUpperCase()) {

            return 1;

        }

        return 0;
    });

    renderizarProductos(productosOrdenados);
} */

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

const productos = [
    // new Producto(0, "QK65", "teclados", 220, 20, 0),
    // new Producto(1, "Cycle7", "teclados", 130, 25, 0),
    // new Producto(2, "Tokyo60", "teclados", 100, 30, 0),
    // new Producto(3, "Unikorn", "teclados", 500, 5, 0),
    // new Producto(4, "Oil Kings", "switches", 50, 20, 0),
    // new Producto(5, "Crystals", "switches", 30, 30, 0),
    // new Producto(6, "Rose Reds", "switches", 20, 40, 0),
    // new Producto(7, "Kang Whites", "switches", 15, 50, 0),
    // new Producto(8, "Watermelon", "keycaps", 100, 20, 0),
    // new Producto(9, "Monokai", "keycaps", 120, 15, 0),
    // new Producto(10, "WoB", "keycaps", 75, 30, 0),
    // new Producto(11, "Godspeed", "keycaps", 160, 10, 0),
];

let carrito = [];

let cantidadAAgregar = 0;

// Inicio

obtenerProductosJSON();

// localStorage.setItem("productos", JSON.stringify(productos));

// renderizarProductos(productos);

inicializarSelectFiltro();

obtenerCarritoLS();

// obtenerProductosDelLS();