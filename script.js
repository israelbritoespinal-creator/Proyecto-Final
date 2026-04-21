const CLAVE_USUARIOS = "mercaditoNenaUsuarios";
const CLAVE_SESION = "mercaditoNenaSesion";
const CLAVE_PRODUCTOS = "mercaditoNenaProductos";
const CLAVE_CARRITO = "mercaditoNenaCarrito";

const ADMIN_PREDETERMINADO = {
    nombre: "Israel",
    apellidos: "Brito Espinal",
    telefono: "",
    correo: "israelbritoespinal@gmail.com",
    usuario: "Admin",
    clave: "Maico700",
    rol: "admin"
};

const PRODUCTOS_PREDETERMINADOS = [
    { id: "tomate", nombre: "Tomate", descripcion: "Ideal para ensaladas, salsas y platos del dia.", precio: 40, imagen: "img/tomate.jpeg", destacado: true, oferta: null, agotado: false },
    { id: "papa", nombre: "Papa", descripcion: "Versatil, rendidora y perfecta para cualquier comida.", precio: 35, imagen: "img/papa.jpeg", destacado: true, oferta: null, agotado: false },
    { id: "lechuga", nombre: "Lechuga", descripcion: "Crujiente y fresca para platos ligeros y saludables.", precio: 30, imagen: "img/lechuga.jpeg", destacado: true, oferta: null, agotado: false },
    { id: "ajiverde", nombre: "Aji verde", descripcion: "Fresco y aromatico para sazonar tus comidas.", precio: 25, imagen: "img/ajiverde.jpg", destacado: false, oferta: null, agotado: false },
    { id: "zanahoria", nombre: "Zanahoria", descripcion: "Color, textura y nutrientes en cada compra.", precio: 45, imagen: "img/zanahoria.jpeg", destacado: false, oferta: null, agotado: false },
    { id: "cebolla-morada", nombre: "Cebolla morada", descripcion: "Aporta sabor y aroma para sofritos y ensaladas.", precio: 50, imagen: "img/cebollamorada.jpg", destacado: false, oferta: null, agotado: false },
    { id: "pimiento-verde", nombre: "Pimiento verde", descripcion: "Ideal para guisos, salteados y platos del dia.", precio: 55, imagen: "img/pimientoverde.jpg", destacado: false, oferta: null, agotado: false },
    { id: "yuca", nombre: "Yuca", descripcion: "Rendidora, suave y excelente para hervidos, casabes y acompanantes caseros.", precio: 40, imagen: "img/yuca.jpg", destacado: false, oferta: null, agotado: false },
    { id: "pepino", nombre: "Pepino", descripcion: "Refrescante y ligero para ensaladas y jugos.", precio: 35, imagen: "img/pepino.jpg", destacado: false, oferta: null, agotado: false },
    { id: "repollo", nombre: "Repollo", descripcion: "Crujiente y practico para ensaladas o guarniciones.", precio: 45, imagen: "img/lechuga.jpeg", destacado: false, oferta: null, agotado: false },
    { id: "tomate-cherry", nombre: "Tomate cherry", descripcion: "Perfecto para ensaladas frescas y decoracion de platos.", precio: 60, imagen: "img/tomatecherry.webp", destacado: false, oferta: null, agotado: false },
    { id: "remolacha", nombre: "Remolacha", descripcion: "Color intenso y gran aporte para comidas saludables.", precio: 50, imagen: "img/remolacha.webp", destacado: false, oferta: null, agotado: false },
    { id: "platano-verde", nombre: "Platano verde", descripcion: "Un clasico dominicano para mangus y frituras.", precio: 25, imagen: "img/platanoverde.jpg", destacado: false, oferta: null, agotado: false },
    { id: "maiz-dulce", nombre: "Maiz dulce", descripcion: "Ideal para acompanantes, sopas y recetas criollas.", precio: 60, imagen: "img/maizdulce.avif", destacado: false, oferta: null, agotado: false },
    { id: "auyama", nombre: "Auyama", descripcion: "Excelente para cremas, hervidos y platos caseros.", precio: 70, imagen: "img/auyama.jpg", destacado: false, oferta: null, agotado: false },
    { id: "combo-yuca", nombre: "Combo de yuca", descripcion: "Oferta especial para preparar hervidos y acompanantes.", precio: 70, imagen: "img/combodeyuca.webp", destacado: false, oferta: { precioAnterior: 80 }, agotado: false },
    { id: "recaito", nombre: "Recaito fresco", descripcion: "Mas sabor para tus platos con mejor precio por tiempo limitado.", precio: 20, imagen: "img/recaitofresco.jpg", destacado: false, oferta: { precioAnterior: 30 }, agotado: false }
];

let carrito = [];
let datosRegistroTemporal = null;

function leerArchivoComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
        if (!archivo) {
            resolve("");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));
        reader.readAsDataURL(archivo);
    });
}

function mostrarVistaPreviaAdmin(evento) {
    const archivo = evento.target.files[0];
    const preview = document.getElementById("previewImagenAdmin");
    const previewImg = document.getElementById("previewImagenAdminImg");

    if (!archivo) {
        preview.classList.add("oculto");
        previewImg.src = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        preview.classList.remove("oculto");
    };
    reader.readAsDataURL(archivo);
}

function obtenerUsuarios() {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);
    const usuarios = guardados ? JSON.parse(guardados) : [];
    return usuarios.map((usuario) => ({
        nombre: usuario.nombre || "",
        apellidos: usuario.apellidos || "",
        telefono: usuario.telefono || "",
        correo: usuario.correo || "",
        usuario: usuario.usuario || "",
        clave: usuario.clave || "",
        rol: usuario.rol || "cliente"
    }));
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function asegurarAdmin() {
    const usuarios = obtenerUsuarios();
    const indiceAdmin = usuarios.findIndex((item) => item.correo === ADMIN_PREDETERMINADO.correo || item.usuario === ADMIN_PREDETERMINADO.usuario);

    if (indiceAdmin >= 0) {
        usuarios[indiceAdmin] = { ...usuarios[indiceAdmin], ...ADMIN_PREDETERMINADO };
    } else {
        usuarios.push(ADMIN_PREDETERMINADO);
    }

    guardarUsuarios(usuarios);
}

function obtenerSesion() {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
}

function guardarSesion(sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function obtenerProductos() {
    const guardados = localStorage.getItem(CLAVE_PRODUCTOS);
    return guardados ? JSON.parse(guardados) : PRODUCTOS_PREDETERMINADOS;
}

function guardarProductos(productos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function obtenerCarrito() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function obtenerProductoPorId(id) {
    return obtenerProductos().find((producto) => producto.id === id);
}

function crearTarjetaProducto(producto) {
    const precioVisible = producto.oferta
        ? `<p class="precio"><del>RD$${producto.oferta.precioAnterior}</del> RD$${producto.precio}</p>`
        : `<p class="precio">RD$${producto.precio}</p>`;

    const etiqueta = producto.oferta
        ? `<span class="etiqueta oferta-tag">Oferta</span>`
        : producto.destacado
            ? `<span class="etiqueta">${producto.nombre === "Tomate" ? "Favorito" : producto.nombre === "Papa" ? "Popular" : "Natural"}</span>`
            : producto.agotado
                ? `<span class="etiqueta">Agotado</span>`
                : "";

    const boton = producto.agotado
        ? `<button type="button" disabled>Agotado</button>`
        : `<button type="button" onclick="agregar('${producto.id}')">Agregar al carrito</button>`;

    return `
        <div class="producto ${producto.oferta ? "oferta" : ""}">
            ${etiqueta}
            <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            ${precioVisible}
            ${boton}
        </div>
    `;
}

function renderProductos() {
    const productos = obtenerProductos();
    document.getElementById("productosDestacados").innerHTML = productos
        .filter((producto) => producto.destacado && !producto.oferta)
        .slice(0, 3)
        .map(crearTarjetaProducto)
        .join("");

    document.getElementById("catalogoProductos").innerHTML = productos
        .filter((producto) => !producto.oferta)
        .map(crearTarjetaProducto)
        .join("");

    document.getElementById("ofertasProductos").innerHTML = productos
        .filter((producto) => producto.oferta)
        .map(crearTarjetaProducto)
        .join("");
}

function renderCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalNodo = document.getElementById("total");
    const cantidadNodo = document.getElementById("cantidadProductos");

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="carrito-vacio">Tu carrito esta vacio. Agrega productos para verlos aqui.</li>';
        totalNodo.textContent = "0";
        cantidadNodo.textContent = "0";
        return;
    }

    let total = 0;
    let cantidad = 0;

    lista.innerHTML = carrito.map((item) => {
        total += item.precio * item.cantidad;
        cantidad += item.cantidad;
        return `
            <li>
                ${item.nombre} x${item.cantidad} - RD$${item.precio * item.cantidad}
                <button type="button" class="boton-eliminar" onclick="eliminarDelCarrito('${item.id}')">Quitar</button>
            </li>
        `;
    }).join("");

    totalNodo.textContent = total;
    cantidadNodo.textContent = cantidad;
}

function agregar(idProducto) {
    const producto = obtenerProductoPorId(idProducto);

    if (!producto || producto.agotado) {
        return;
    }

    const itemExistente = carrito.find((item) => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderCarrito();
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito
        .map((item) => item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item)
        .filter((item) => item.cantidad > 0);

    guardarCarrito();
    renderCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();
}

function mostrarMensaje(id, texto, color) {
    const nodo = document.getElementById(id);
    if (!nodo) {
        return;
    }
    nodo.textContent = texto;
    nodo.style.color = color;
}

function limpiarFormularioAdmin() {
    document.getElementById("adminNombre").value = "";
    document.getElementById("adminPrecio").value = "";
    document.getElementById("adminImagenArchivo").value = "";
    document.getElementById("adminDescripcion").value = "";
    document.getElementById("adminPrecioAnterior").value = "";
    document.getElementById("adminDestacado").value = "false";
    document.getElementById("previewImagenAdmin").classList.add("oculto");
    document.getElementById("previewImagenAdminImg").src = "";
}

function limpiarCamposLogin() {
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
}

function abrirModalRegistro() {
    document.getElementById("registroModal").classList.remove("oculto");
    document.getElementById("registroPaso1").classList.remove("oculto");
    document.getElementById("registroPaso2").classList.add("oculto");
    mostrarMensaje("mensajeRegistro", "", "#2f7d4a");
}

function cerrarModalRegistro() {
    document.getElementById("registroModal").classList.add("oculto");
    datosRegistroTemporal = null;
}

function continuarRegistro() {
    const nombre = document.getElementById("registroNombre").value.trim();
    const apellidos = document.getElementById("registroApellido").value.trim();
    const telefono = document.getElementById("registroTelefono").value.trim();
    const correo = document.getElementById("registroCorreo").value.trim();
    const clave = document.getElementById("registroClave").value.trim();

    if (!nombre || !apellidos || !telefono || !correo || !clave) {
        mostrarMensaje("mensajeRegistro", "Completa todos los datos personales antes de continuar.", "#c64132");
        return;
    }

    datosRegistroTemporal = { nombre, apellidos, telefono, correo, clave, rol: "cliente" };
    document.getElementById("registroPaso1").classList.add("oculto");
    document.getElementById("registroPaso2").classList.remove("oculto");
    mostrarMensaje("mensajeRegistro", "", "#2f7d4a");
}

function volverRegistro() {
    document.getElementById("registroPaso2").classList.add("oculto");
    document.getElementById("registroPaso1").classList.remove("oculto");
}

function registrarUsuario() {
    const usuarios = obtenerUsuarios();
    const usuario = document.getElementById("registroUsuario").value.trim();

    if (!datosRegistroTemporal) {
        mostrarMensaje("mensajeRegistro", "Completa primero el paso anterior.", "#c64132");
        return;
    }

    if (!usuario) {
        mostrarMensaje("mensajeRegistro", "Elige un nombre de usuario para tu cuenta.", "#c64132");
        return;
    }

    const existeCorreo = usuarios.some((item) => (item.correo || "").toLowerCase() === datosRegistroTemporal.correo.toLowerCase());
    const existeUsuario = usuarios.some((item) => (item.usuario || "").toLowerCase() === usuario.toLowerCase());
    const usuarioReservado = usuario.toLowerCase() === ADMIN_PREDETERMINADO.usuario.toLowerCase();
    const correoReservado = datosRegistroTemporal.correo.toLowerCase() === ADMIN_PREDETERMINADO.correo.toLowerCase();

    if (existeCorreo) {
        mostrarMensaje("mensajeRegistro", "Ese correo ya esta registrado.", "#c64132");
        return;
    }

    if (correoReservado) {
        mostrarMensaje("mensajeRegistro", "Ese correo esta reservado para la cuenta de administrador.", "#c64132");
        return;
    }

    if (existeUsuario) {
        mostrarMensaje("mensajeRegistro", "Ese nombre de usuario ya existe.", "#c64132");
        return;
    }

    if (usuarioReservado) {
        mostrarMensaje("mensajeRegistro", "El nombre de usuario Admin esta reservado para el administrador.", "#c64132");
        return;
    }

    usuarios.push({ ...datosRegistroTemporal, usuario });
    guardarUsuarios(usuarios);
    guardarSesion({
        usuario,
        correo: datosRegistroTemporal.correo,
        rol: "cliente"
    });
    mostrarMensaje("mensajeLogin", `Bienvenido, ${usuario}. Tu cuenta fue creada e iniciamos tu sesion.`, "#2f7d4a");
    cerrarModalRegistro();
    document.getElementById("registroNombre").value = "";
    document.getElementById("registroApellido").value = "";
    document.getElementById("registroTelefono").value = "";
    document.getElementById("registroCorreo").value = "";
    document.getElementById("registroClave").value = "";
    document.getElementById("registroUsuario").value = "";
    actualizarVistaSesion();
}

function login() {
    const acceso = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const usuarios = obtenerUsuarios();

    if (!acceso || !clave) {
        mostrarMensaje("mensajeLogin", "Completa usuario y contrasena para continuar.", "#d17b27");
        return;
    }

    const encontrado = usuarios.find((item) => {
        const coincideUsuario = (item.usuario || "").toLowerCase() === acceso.toLowerCase();
        const coincideCorreo = (item.correo || "").toLowerCase() === acceso.toLowerCase();
        return (coincideUsuario || coincideCorreo) && item.clave === clave;
    });

    if (!encontrado) {
        mostrarMensaje("mensajeLogin", "Usuario o contrasena incorrectos.", "#c64132");
        return;
    }

    guardarSesion({
        usuario: encontrado.usuario,
        correo: encontrado.correo,
        rol: encontrado.rol || "cliente"
    });

    limpiarCamposLogin();
    mostrarMensaje("mensajeLogin", "", "#2f7d4a");
    actualizarVistaSesion();
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    actualizarVistaSesion();
    mostrarMensaje("mensajeLogin", "Has cerrado sesion correctamente.", "#2f7d4a");
}

function actualizarVistaSesion() {
    const sesion = obtenerSesion();
    const authPanel = document.getElementById("authPanel");
    const sesionActiva = document.getElementById("sesionActiva");
    const usuarioActivo = document.getElementById("usuarioActivo");
    const adminPanel = document.getElementById("adminPanel");
    const adminNavLink = document.getElementById("adminNavLink");
    const loginNavLink = document.getElementById("loginNavLink");
    const header = document.querySelector(".top-bar");
    const hero = document.getElementById("inicio");
    const beneficios = document.querySelector(".beneficios");
    const destacados = document.getElementById("destacados");
    const catalogo = document.getElementById("catalogo");
    const ofertas = document.getElementById("ofertas");
    const carritoBox = document.getElementById("carrito");
    const loginBox = document.getElementById("login");
    const soporte = document.getElementById("soporte");
    const footer = document.querySelector("footer");

    if (sesion && sesion.usuario) {
        authPanel.classList.add("oculto");
        sesionActiva.classList.remove("oculto");
        usuarioActivo.textContent = `${sesion.usuario}${sesion.rol === "admin" ? " (Administrador)" : ""}`;
        mostrarMensaje("mensajeLogin", "", "#2f7d4a");
        loginNavLink.classList.add("oculto");
    } else {
        authPanel.classList.remove("oculto");
        sesionActiva.classList.add("oculto");
        usuarioActivo.textContent = "";
        loginNavLink.classList.remove("oculto");
    }

    if (sesion && sesion.rol === "admin") {
        document.body.classList.add("admin-mode");
        adminPanel.classList.remove("oculto");
        adminNavLink.classList.remove("oculto");
        header.classList.add("oculto");
        hero.classList.add("oculto");
        beneficios.classList.add("oculto");
        destacados.classList.add("oculto");
        catalogo.classList.add("oculto");
        ofertas.classList.add("oculto");
        carritoBox.classList.add("oculto");
        loginBox.classList.add("oculto");
        soporte.classList.add("oculto");
        footer.classList.add("oculto");
        renderAdmin();
        window.location.hash = "adminPanel";
    } else {
        document.body.classList.remove("admin-mode");
        adminPanel.classList.add("oculto");
        adminNavLink.classList.add("oculto");
        header.classList.remove("oculto");
        hero.classList.remove("oculto");
        beneficios.classList.remove("oculto");
        destacados.classList.remove("oculto");
        catalogo.classList.remove("oculto");
        ofertas.classList.remove("oculto");
        carritoBox.classList.remove("oculto");
        loginBox.classList.remove("oculto");
        soporte.classList.remove("oculto");
        footer.classList.remove("oculto");
    }
}

function abrirModalPago() {
    if (carrito.length === 0) {
        mostrarMensaje("mensajePago", "Tu carrito esta vacio. Agrega productos antes de pagar.", "#c64132");
    } else {
        mostrarMensaje("mensajePago", "", "#2f7d4a");
    }
    document.getElementById("pagoModal").classList.remove("oculto");
}

function cerrarModalPago() {
    document.getElementById("pagoModal").classList.add("oculto");
}

function procesarPago() {
    const sesion = obtenerSesion();
    const titular = document.getElementById("titularTarjeta").value.trim();
    const numero = document.getElementById("numeroTarjeta").value.trim();
    const codigo = document.getElementById("codigoSeguridad").value.trim();

    if (!sesion) {
        mostrarMensaje("mensajePago", "Debes iniciar sesion antes de finalizar la compra.", "#c64132");
        return;
    }

    if (carrito.length === 0) {
        mostrarMensaje("mensajePago", "No hay productos en el carrito.", "#c64132");
        return;
    }

    if (!titular || !numero || !codigo) {
        mostrarMensaje("mensajePago", "Completa los datos de la tarjeta para continuar.", "#d17b27");
        return;
    }

    mostrarMensaje("mensajePago", "Pago procesado correctamente. Gracias por tu compra.", "#2f7d4a");
    vaciarCarrito();
    document.getElementById("titularTarjeta").value = "";
    document.getElementById("numeroTarjeta").value = "";
    document.getElementById("codigoSeguridad").value = "";
}

async function agregarProductoAdmin() {
    const nombre = document.getElementById("adminNombre").value.trim();
    const precio = Number(document.getElementById("adminPrecio").value);
    const imagenArchivo = document.getElementById("adminImagenArchivo").files[0];
    const descripcion = document.getElementById("adminDescripcion").value.trim();
    const precioAnterior = Number(document.getElementById("adminPrecioAnterior").value);
    const destacado = document.getElementById("adminDestacado").value === "true";
    const productos = obtenerProductos();

    if (!nombre || !precio || !imagenArchivo || !descripcion) {
        mostrarMensaje("mensajeAdmin", "Completa nombre, precio, imagen y descripcion antes de guardar.", "#c64132");
        return;
    }

    let imagenFinal = "";

    try {
        imagenFinal = await leerArchivoComoDataURL(imagenArchivo);
    } catch (error) {
        mostrarMensaje("mensajeAdmin", "No se pudo cargar la imagen seleccionada.", "#c64132");
        return;
    }

    productos.unshift({
        id: `${nombre.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        nombre,
        descripcion,
        precio,
        imagen: imagenFinal,
        destacado,
        oferta: precioAnterior ? { precioAnterior } : null,
        agotado: false
    });

    guardarProductos(productos);
    limpiarFormularioAdmin();
    renderProductos();
    renderAdmin();
    mostrarMensaje("mensajeAdmin", `Producto guardado correctamente: ${nombre}.`, "#2f7d4a");
}

function actualizarPrecioProducto(id, valor) {
    const productos = obtenerProductos().map((producto) =>
        producto.id === id ? { ...producto, precio: Number(valor) || producto.precio } : producto
    );
    guardarProductos(productos);
    renderProductos();
    renderAdmin();
}

function actualizarOfertaProducto(id, valor) {
    const productos = obtenerProductos().map((producto) => {
        if (producto.id !== id) {
            return producto;
        }
        const precioAnterior = Number(valor);
        return { ...producto, oferta: precioAnterior ? { precioAnterior } : null };
    });
    guardarProductos(productos);
    renderProductos();
    renderAdmin();
}

function cambiarAgotado(id) {
    const productos = obtenerProductos().map((producto) =>
        producto.id === id ? { ...producto, agotado: !producto.agotado } : producto
    );
    guardarProductos(productos);
    renderProductos();
    renderAdmin();
}

function eliminarProductoAdmin(id) {
    const productos = obtenerProductos().filter((producto) => producto.id !== id);
    guardarProductos(productos);
    carrito = carrito.filter((item) => item.id !== id);
    guardarCarrito();
    renderProductos();
    renderCarrito();
    renderAdmin();
}

function renderAdmin() {
    const productos = [...obtenerProductos()];
    const tabla = document.getElementById("adminTablaProductos");
    const totalProductos = document.getElementById("adminTotalProductos");
    const totalOfertas = document.getElementById("adminTotalOfertas");
    const totalAgotados = document.getElementById("adminTotalAgotados");

    totalProductos.textContent = productos.length;
    totalOfertas.textContent = productos.filter((producto) => producto.oferta).length;
    totalAgotados.textContent = productos.filter((producto) => producto.agotado).length;

    tabla.innerHTML = productos.map((producto) => `
        <tr>
            <td>${producto.nombre}</td>
            <td>
                <input type="number" value="${producto.precio}" onchange="actualizarPrecioProducto('${producto.id}', this.value)">
            </td>
            <td>
                <input type="number" value="${producto.oferta ? producto.oferta.precioAnterior : ""}" onchange="actualizarOfertaProducto('${producto.id}', this.value)" placeholder="Sin oferta">
            </td>
            <td>${producto.agotado ? "Agotado" : "Disponible"}</td>
            <td class="acciones-admin">
                <button type="button" class="boton-mini" onclick="cambiarAgotado('${producto.id}')">${producto.agotado ? "Activar" : "Agotar"}</button>
                <button type="button" class="boton-mini danger" onclick="eliminarProductoAdmin('${producto.id}')">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

function iniciarApp() {
    asegurarAdmin();
    if (!localStorage.getItem(CLAVE_PRODUCTOS)) {
        guardarProductos(PRODUCTOS_PREDETERMINADOS);
    }
    carrito = obtenerCarrito();
    renderProductos();
    renderCarrito();
    actualizarVistaSesion();
}

iniciarApp();
