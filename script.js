// Primero guardo en estas variables los elementos del HTML que voy a utilizar.
const nombre = document.getElementById("nombre");
const color = document.getElementById("color");
const modo = document.getElementById("modo");
const formulario = document.getElementById("formulario");
const botonRestablecer = document.getElementById("restablecer");
const contenedor = document.getElementById("contenedor-bienvenida");

// Con esta función busco una cookie por su nombre y devuelvo su valor.
function leerCookie(nombreCookie) {
    // El navegador me da todas las cookies juntas, separadas por punto y coma.
    const cookies = document.cookie.split(";");

    // Reviso las cookies una por una hasta encontrar la que necesito.
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const inicioCookie = nombreCookie + "=";

        // Si esta cookie empieza con el nombre que busco, devuelvo lo que viene después del igual.
        if (cookie.indexOf(inicioCookie) === 0) {
            return cookie.substring(inicioCookie.length);
        }
    }

    // Si no encuentro esa cookie, devuelvo null para saber que no está guardada.
    return null;
}

// Con esta función quito el tema anterior y pongo el tema elegido.
function cambiarTema() {
    document.body.classList.remove("modo-claro");
    document.body.classList.remove("modo-oscuro");

    // Añado al body la clase CSS que corresponde al valor del selector.
    if (modo.value === "oscuro") {
        document.body.classList.add("modo-oscuro");
    } else {
        document.body.classList.add("modo-claro");
    }
}

// Con esta función creo y muestro el mensaje de bienvenida.
function mostrarBienvenida(mensaje) {
    // Quito el contenido anterior para no repetir los mensajes.
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }

    // Creo el encabezado y se escribe el nombre que hay en el formulario.
    const titulo = document.createElement("h2");
    titulo.textContent = "¡Bienvenido " + nombre.value + "!";

    // Creo un párrafo y le pongo el mensaje que recibo como parámetro.
    const parrafo = document.createElement("p");
    parrafo.textContent = mensaje;

    // Añado los dos elementos al contenedor vacío del HTML.
    contenedor.appendChild(titulo);
    contenedor.appendChild(parrafo);
}

// Cuando se carga el script, leo las tres preferencias guardadas en cookies.
const nombreGuardado = leerCookie("usuario");
const colorGuardado = leerCookie("color");
const modoGuardado = leerCookie("modo");

// Si encuentro un nombre, lo pongo en el campo y muestro la bienvenida.
if (nombreGuardado !== null) {
    nombre.value = nombreGuardado;
    mostrarBienvenida("Has recuperado tus preferencias guardadas.");
}

// Si encuentro un color, lo pongo en el selector y lo aplico al fondo.
if (colorGuardado !== null) {
    color.value = colorGuardado;
    document.body.style.backgroundColor = colorGuardado;
}

// Si encuentro un tema, lo pongo en el selector y aplico su clase CSS.
if (modoGuardado !== null) {
    modo.value = modoGuardado;
    cambiarTema();
}

// Cada vez que cambio el selector de color, se actualiza el fondo.
color.addEventListener("input", () => {
    document.body.style.backgroundColor = color.value;
});

// Cada vez que elijo otro tema, cambio la clase del body.
modo.addEventListener("change", () => {
    cambiarTema();
});

// Cuando envío el formulario, guardo las preferencias en cookies.
formulario.addEventListener("submit", (evento) => {
    // Evito que el formulario recargue la página al enviarse.
    evento.preventDefault();

    // Calculo la fecha de caducidad: siete días desde este momento.
    const fechaCaducidad = new Date();
    fechaCaducidad.setTime(fechaCaducidad.getTime() + 7 * 24 * 60 * 60 * 1000);
    const caducidad = "expires=" + fechaCaducidad.toUTCString();

    // Guardo el nombre y el color con una duración de siete días.
    document.cookie = "usuario=" + nombre.value + ";" + caducidad;
    document.cookie = "color=" + color.value + ";" + caducidad;

    // Guardo el tema sin fecha de caducidad, ya que es una cookie de sesión.
    document.cookie = "modo=" + modo.value;

    // Muestro un mensaje para confirmar que he guardado las preferencias.
    mostrarBienvenida("Tus preferencias se han guardado correctamente.");
});

// Cuando pulso el botón, borro las cookies y devuelvo la página a su estado inicial.
botonRestablecer.addEventListener("click", () => {
    // Pongo una fecha pasada para que el navegador elimine las cookies.
    const caducidad = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "usuario=;" + caducidad;
    document.cookie = "color=;" + caducidad;
    document.cookie = "modo=;" + caducidad;

    // Quito el color y las clases de los dos temas.
    document.body.style.backgroundColor = "";
    document.body.classList.remove("modo-claro");
    document.body.classList.remove("modo-oscuro");

    // Vacío los campos y dejo sus valores iniciales.
    nombre.value = "";
    color.value = "#ffffff";
    modo.value = "claro";

    // Elimino del contenedor los elementos de bienvenida que había creado.
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
});
