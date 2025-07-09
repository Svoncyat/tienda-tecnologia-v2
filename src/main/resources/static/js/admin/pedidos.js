//=========================================
// Modal para agregar pedido
//=========================================
// Obtener elementos del modal
const modalpedido = document.getElementById('modal-agregar-pedido');
const btnAgregarPedido = document.querySelector('#agregar-pedido');
const spanClosepedido = document.querySelector('#modal-agregar-pedido .close');

// Abrir modal cuando se hace clic en "Agregar compra"
btnAgregarPedido.addEventListener('click', function() {
    modalpedido.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanClosepedido.addEventListener('click', function() {
    modalpedido.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalpedido) {
        modalpedido.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalpedido.style.display === 'block') {
        modalpedido.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});