

//=========================================
// Modal para agregar compra
//=========================================
// Obtener elementos del modal
const modalcompra = document.getElementById('modal-agregar-compra');
const btnAgregarCompra = document.querySelector('#agregar-compra');
const spanClosecompra = document.querySelector('#modal-agregar-compra .close');

// Abrir modal cuando se hace clic en "Agregar compra"
btnAgregarCompra.addEventListener('click', function() {
    modalcompra.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanClosecompra.addEventListener('click', function() {
    modalcompra.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalcompra) {
        modalcompra.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalcompra.style.display === 'block') {
        modalcompra.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});