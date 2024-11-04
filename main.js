// Variables
let manoCrupier = [];
let manoJugador = [];
let mazo = [];
let puntuacionCrupier = 0;
let puntuacionJugador = 0;

// Función para cargar el mazo desde el archivo JSON
async function cargarMazo() {
    try {
        const respuesta = await fetch('data/mazo.json');
        mazo = await respuesta.json();
        mazo = mazo.sort(() => Math.random() - 0.5); // Mezcla el mazo después de cargarlo
    } catch (error) {
        console.error("Error al cargar el mazo:", error);
    }
}

// Función para calcular la puntuación de una mano
function calcularPuntuacion(mano) {
    let puntuacion = 0;
    let cantidadAses = 0;
    for (let carta of mano) {
        if (carta.valor === "A") {
            cantidadAses++;
            puntuacion += 11;
        } else if (["K", "Q", "J"].includes(carta.valor)) {
            puntuacion += 10;
        } else {
            puntuacion += parseInt(carta.valor);
        }
    }
    while (puntuacion > 21 && cantidadAses > 0) {
        puntuacion -= 10;
        cantidadAses--;
    }
    return puntuacion;
}

// Función para agregar cartas al DOM
function mostrarCartas() {
    const cartasCrupierDiv = document.getElementById("cartas-crupier");
    const cartasJugadorDiv = document.getElementById("cartas-jugador");
    cartasCrupierDiv.innerHTML = "";
    cartasJugadorDiv.innerHTML = "";

    manoCrupier.forEach(carta => {
        const cartaDiv = document.createElement("div");
        cartaDiv.textContent = `${carta.valor} de ${carta.palo}`;
        cartasCrupierDiv.appendChild(cartaDiv);
    });

    manoJugador.forEach(carta => {
        const cartaDiv = document.createElement("div");
        cartaDiv.textContent = `${carta.valor} de ${carta.palo}`;
        cartasJugadorDiv.appendChild(cartaDiv);
    });

    document.getElementById("puntuacion-crupier").textContent = `Puntuación: ${puntuacionCrupier}`;
    document.getElementById("puntuacion-jugador").textContent = `Puntuación: ${puntuacionJugador}`;
}

// Función para iniciar una nueva mano
async function iniciarJuego() {
    await cargarMazo();
    manoCrupier = [mazo.pop(), mazo.pop()];
    manoJugador = [mazo.pop(), mazo.pop()];
    actualizarPuntuaciones();
    mostrarCartas();
}

// Actualizar las puntuaciones
function actualizarPuntuaciones() {
    puntuacionCrupier = calcularPuntuacion(manoCrupier);
    puntuacionJugador = calcularPuntuacion(manoJugador);
}

// Función para el botón de "Pedir Carta"
function pedirCarta() {
    manoJugador.push(mazo.pop());
    actualizarPuntuaciones();
    mostrarCartas();

    if (puntuacionJugador > 21) {
        Swal.fire("Juego Terminado", "¡Te pasaste de 21!", "error");
    }
}

// Función para el botón de "Plantarse"
function plantarse() {
    while (puntuacionCrupier < 17) {
        manoCrupier.push(mazo.pop());
        puntuacionCrupier = calcularPuntuacion(manoCrupier);
    }
    mostrarCartas();

    if (puntuacionCrupier > 21) {
        Swal.fire("¡Felicidades!", "El crupier se pasó de 21, ¡ganaste!", "success");
    } else if (puntuacionCrupier > puntuacionJugador) {
        Swal.fire("Juego Terminado", "¡El crupier gana!", "error");
    } else if (puntuacionCrupier < puntuacionJugador) {
        Swal.fire("¡Felicidades!", "¡Ganaste!", "success");
    } else {
        Swal.fire("Empate", "Nadie gana.", "info");
    }
}

// Event Listeners
document.getElementById("boton-pedir").addEventListener("click", pedirCarta);
document.getElementById("boton-plantarse").addEventListener("click", plantarse);
document.getElementById("boton-reiniciar").addEventListener("click", iniciarJuego);

// Inicia el juego
iniciarJuego();
