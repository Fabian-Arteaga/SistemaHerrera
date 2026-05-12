// Función para generar los detalles fijos automáticamente
function generarDetallesFijos() {
    // 1. Fecha actual automática
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // 2. Número de venta automático
    const numeroVenta = 'VTA-' + fechaActual.getTime().toString().slice(-8) + '-' + 
                        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // 3. Tipo de venta (Detalle)
    const tipoVenta = 'Detalle';
    
    // 4. Método de pago (Contado)
    const metodoPago = 'Contado';
    
    // Actualizar el DOM
    actualizarDetallesFijos(fechaFormateada, numeroVenta, tipoVenta, metodoPago);
}

// Función para actualizar los elementos en el HTML
function actualizarDetallesFijos(fecha, numeroVenta, tipoVenta, metodoPago) {
    // Buscamos los elementos por su texto o estructura
    const infoList = document.querySelector('.info-list');
    
    if (infoList) {
        const parrafos = infoList.querySelectorAll('p');
        
        parrafos.forEach(p => {
            const fuerte = p.querySelector('strong');
            if (fuerte) {
                const texto = fuerte.textContent.trim();
                
                if (texto === 'Venta:' && p.textContent.includes('[Detalle]')) {
                    p.innerHTML = `<strong>Venta:</strong> ${tipoVenta}`;
                }
                else if (texto === 'Nro Venta:') {
                    p.innerHTML = `<strong>Nro Venta:</strong> ${numeroVenta}`;
                }
                else if (texto === 'Fecha:') {
                    p.innerHTML = `<strong>Fecha:</strong> ${fecha}`;
                }
                else if (texto === 'Venta:' && p.textContent.includes('[Contado]')) {
                    p.innerHTML = `<strong>Venta:</strong> ${metodoPago}`;
                }
            }
        });
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño delay para asegurar que el layout se cargue
    setTimeout(() => {
        generarDetallesFijos();
    }, 600);
});

// Función para regenerar los datos
window.regenerarDetallesVenta = function() {
    generarDetallesFijos();
    console.log('Detalles de venta actualizados');
};