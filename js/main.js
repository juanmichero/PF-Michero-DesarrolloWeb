// Clases

class Producto {

    constructor(id, nombre, categoria, precio, stock, cantidadCarrito) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.cantidadCarrito = cantidadCarrito;
    }
}

// Funciones

// Renderizar los productos ingresdos al front
function renderizarProductos(productosARenderizar) {

    const container = document.getElementById("container");
    container.innerHTML = "";

    for (const productoARenderizar of productosARenderizar) {

        // Crear los elementos para renderizar en el front
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
        p.innerHTML = `Categoría: <strong>${productoARenderizar.categoria}</strong><br>Precio: <strong>$${productoARenderizar.precio}</strong><br>Stock: <strong>${productoARenderizar.stock}</strong>`;

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

                alert("STOCK INSUFICIENTE"); // sweetalert

            } else if (cantidadAAgregar < 1){

                alert("INGRESE UNA CANTIDAD VÁLIDA");

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

// Agregar los productos al carrito
function agregarAlCarrito(productoAAgregar, cantidadAAgregar) {

    const indexProductoAAgregar = carrito.findIndex( (el) => {

        return el.id === productoAAgregar.id;

    });

    // Modifico stock y cantidadCarrito del producto en el array original
    productos[productoAAgregar.id].cantidadCarrito += parseInt(cantidadAAgregar);
    productos[productoAAgregar.id].stock -= parseInt(cantidadAAgregar);

    // Si el producto no estaba ya en el carrito, lo agrego
    if (indexProductoAAgregar === -1) {

        carrito.push(productoAAgregar);

    }

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

        });

        // Insertar elementos
        tdEliminar.append(botonEliminar);
        tr.append(tdNombre, tdPrecio, tdCantidad, tdEliminar);
        tbody.append(tr);
    }
} 

// 
function eliminarProducto(productoAEliminar, cantidadAEliminar) {

    const indexProductoAEliminar = productos.findIndex( (el) => {

        return productoAEliminar.id === el.id;

    });

    if (indexProductoAEliminar !== -1) {

        // Modifico stock y cantidadCarrito del producto en el array original
        productos[indexProductoAEliminar].cantidadCarrito -= parseInt(cantidadAEliminar);

        productos[indexProductoAEliminar].stock += parseInt(cantidadAEliminar);

    }

    renderizarProductos(productos);

}

// Eliminar producto del carrito
function eliminarDelCarrito(productoAEliminar) {

    const indexProductoAEliminar = carrito.findIndex( (el) => {

        return productoAEliminar.id === el.id;

    });

    carrito.splice(indexProductoAEliminar, 1);

    renderizarTablaCarrito(carrito);

}

// Inicializar el select para filtrar productos por categoría
function inicializarFiltro() {

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
    new Producto(0, "QK65", "teclados", 220, 20, 0),
    new Producto(1, "Cycle7", "teclados", 130, 25, 0),
    new Producto(2, "Tokyo60", "teclados", 100, 30, 0),
    new Producto(3, "Unikorn", "teclados", 500, 5, 0),
    new Producto(4, "Oil Kings", "switches", 50, 20, 0),
    new Producto(5, "Crystals", "switches", 30, 30, 0),
    new Producto(6, "Rose Reds", "switches", 20, 40, 0),
    new Producto(7, "Kang Whites", "switches", 15, 50, 0),
    new Producto(8, "Watermelon", "keycaps", 100, 20, 0),
    new Producto(9, "Monokai", "keycaps", 120, 15, 0),
    new Producto(10, "WoB", "keycaps", 75, 30, 0),
    new Producto(11, "Godspeed", "keycaps", 160, 10, 0),
];

let carrito = [];

let cantidadAAgregar = 0;

// Inicio
renderizarProductos(productos);

inicializarFiltro();