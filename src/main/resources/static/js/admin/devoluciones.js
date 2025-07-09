//=========================================
// Modal para agregar pedido
//=========================================
// Obtener elementos del modal
const modaldevolucion = document.getElementById('modal-agregar-devolucion');
const btnAgregarDevolucion = document.querySelector('#agregar-devolucion');
const spanClosedevolucion = document.querySelector('#modal-agregar-devolucion .close');

// Abrir modal cuando se hace clic en "Agregar compra"
btnAgregarDevolucion.addEventListener('click', function() {
    modaldevolucion.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanClosedevolucion.addEventListener('click', function() {
    modaldevolucion.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modaldevolucion) {
        modaldevolucion.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modaldevolucion.style.display === 'block') {
        modaldevolucion.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});