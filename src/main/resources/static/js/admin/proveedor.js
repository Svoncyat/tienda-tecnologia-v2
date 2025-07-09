//=========================================
// Modal para agregar proveedor
//=========================================
// Obtener elementos del modal
const modalproveedor = document.getElementById('modal-agregar-proveedor');
const btnAgregarprovedor = document.querySelector('#agregar-proveedor');
const spanCloseproveedor = document.querySelector('#modal-agregar-proveedor .close');

// Abrir modal cuando se hace clic en "Agregar proveedor"
btnAgregarprovedor.addEventListener('click', function() {
    modalproveedor.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanCloseproveedor.addEventListener('click', function() {
    modalproveedor.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalproveedor) {
        modalproveedor.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalproveedor.style.display === 'block') {
        modalproveedor.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});