document.addEventListener('DOMContentLoaded', () => {
    // Referencias al Formulario de Selección
    const btnAceptar = document.querySelector('.btn-pri.btn-aceptar');
    const btnLimpiar = document.querySelector('.btn-sec.btn-limpiar');
    const tablaBody = document.querySelector('.pedido-table tbody');
    
    // Inputs del Selector
    const inputBuscar = document.querySelector('.search-box input');
    const inputLinea = document.querySelector('input[placeholder="Línea"]');
    const inputSabor = document.querySelector('input[placeholder="Sabor"]');
    const inputPresen = document.querySelector('input[placeholder="Presentación"]');
    const inputCant = document.querySelector('input[type="number"]');

    // Inputs de Totales
    const inputTotal = document.querySelector('.total-row input');
    const inputPago = document.querySelector('.pago-box input');
    const inputCambio = document.querySelector('.resumen-row:nth-child(3) input');
    const btnAceptarPago = document.querySelector('.btn-pago-aceptar');

    // 1. Función para calcular totales
    const actualizarTotales = () => {
        let totalAcumulado = 0;
        const filas = tablaBody.querySelectorAll('tr');
        
        filas.forEach(fila => {
            const subtotalTexto = fila.cells[3].innerText.replace(' C$', '').replace(',', '');
            totalAcumulado += parseFloat(subtotalTexto);
        });

        inputTotal.value = totalAcumulado.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' C$';
        actualizarCambio();
    };

    // 2. Función para calcular el cambio
    const actualizarCambio = () => {
        const total = parseFloat(inputTotal.value.replace(' C$', '').replace(',', '')) || 0;
        const pago = parseFloat(inputPago.value) || 0;
        const cambio = pago - total;

        if (cambio >= 0) {
            inputCambio.value = cambio.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' C$';
        } else {
            inputCambio.value = "0.00 C$";
        }
    };

    // 3. Evento Agregar Producto (Simulación)
    btnAceptar.addEventListener('click', () => {
        if (!inputBuscar.value) return alert("Por favor busca un producto");

        // Creamos la fila con los datos (en un caso real estos vendrían de tu DB)
        const nuevaFila = document.createElement('tr');
        const precioSimulado = 150.00;
        const subtotal = precioSimulado * inputCant.value;

        nuevaFila.innerHTML = `
            <td>${inputBuscar.value} (${inputSabor.value} ${inputPresen.value})</td>
            <td>${inputCant.value}</td>
            <td>${precioSimulado.toFixed(2)} C$</td>
            <td>${subtotal.toFixed(2)} C$</td>
        `;

        tablaBody.appendChild(nuevaFila);
        actualizarTotales();
        limpiarSelector();
    });

    // 4. Función Limpiar Selector
    const limpiarSelector = () => {
        inputBuscar.value = '';
        inputLinea.value = '';
        inputSabor.value = '';
        inputPresen.value = '';
        inputCant.value = 1;
    };

    btnLimpiar.addEventListener('click', limpiarSelector);

    // 5. Evento para el Pago
    btnAceptarPago.addEventListener('click', actualizarCambio);

    // Inicializar iconos de Lucide (si no están cargados por el topbar/sidebar)
    if (window.lucide) {
        lucide.createIcons();
    }
});