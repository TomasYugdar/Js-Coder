// Array para almacenar el historial de pagos
let historialPagos = JSON.parse(localStorage.getItem('historialPagos')) || [];

// Función para agregar un pago al historial
function agregarPago(montoTotal, numeroCuotas) {
    let pago = {
        montoTotal: montoTotal,
        numeroCuotas: numeroCuotas,
        montoPorCuota: montoTotal / numeroCuotas
    };
    historialPagos.push(pago); // Agregamos el pago al array
    // Guardar historial en el localStorage
    localStorage.setItem('historialPagos', JSON.stringify(historialPagos));
    mostrarHistorialPagos();
}

// Función para mostrar el historial de pagos en el DOM
function mostrarHistorialPagos() {
    const historialDiv = document.getElementById('historial');
    historialDiv.innerHTML = ''; // Limpiar el historial previo

    historialPagos.forEach((pago, index) => {
        const pagoElement = document.createElement('div');
        pagoElement.className = 'pago';
        pagoElement.textContent = `Pago ${index + 1}: Monto Total: $${pago.montoTotal.toFixed(2)}, Número de Cuotas: ${pago.numeroCuotas}, Monto por Cuota: $${pago.montoPorCuota.toFixed(2)}`;
        historialDiv.appendChild(pagoElement);
    });
}

// Evento para calcular pagos al enviar el formulario
document.getElementById('pagoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe
    const montoTotal = parseFloat(document.getElementById('montoTotal').value);
    const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value);
    // Agrego el pago al historial
    agregarPago(montoTotal, numeroCuotas);
    
    // Limpiar el formulario
    document.getElementById('pagoForm').reset();
});

// Evento para filtrar pagos
document.getElementById('filtrarPagosBtn').addEventListener('click', function() {
    const montoMinimo = parseFloat(prompt("Ingresa el monto mínimo para filtrar:")); // Cambiar a un input en el futuro
    const pagosFiltrados = filtrarPagosPorMonto(montoMinimo);
    
    // Mostrar resultados de filtro
    const resultadoFiltradoDiv = document.createElement('div');
    resultadoFiltradoDiv.innerHTML = `<strong>Pagos mayores a $${montoMinimo}:</strong> ${JSON.stringify(pagosFiltrados)}`;
    document.getElementById('historial').appendChild(resultadoFiltradoDiv);
});

// Función para filtrar los pagos
function filtrarPagosPorMonto(montoMinimo) {
    return historialPagos.filter(pago => pago.montoTotal > montoMinimo);
}

// Mostrar el historial al cargar la página
mostrarHistorialPagos();
