// ========================================
//    MODALES PARA OFERTAS
// ========================================

//=========================================
// Modal para agregar ofertas
//=========================================
// Obtener elementos del modal
const modalOferta = document.getElementById('modal-agregar-oferta');
const btnAgregarOferta = document.querySelector('#agregar-oferta');
const spanCloseOferta = document.querySelector('#modal-agregar-oferta .close');

// Abrir modal cuando se hace clic en "Agregar Oferta"
btnAgregarOferta.addEventListener('click', function() {
    modalOferta.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanCloseOferta.addEventListener('click', function() {
    modalOferta.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalOferta) {
        modalOferta.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalOferta.style.display === 'block') {
        modalOferta.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

//=========================================
// Funcionalidad para ofertas
//=========================================

// Función para generar código automático de oferta
function generarCodigoOferta() {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    
    return `OF-${año}${mes}${dia}-${hora}${minuto}`;
}

// Generar código automático al abrir el modal
btnAgregarOferta.addEventListener('click', function() {
    const codigoOferta = document.getElementById('cod-oferta');
    if (codigoOferta) {
        codigoOferta.value = generarCodigoOferta();
    }
});

// Validar fechas de la oferta
document.addEventListener('DOMContentLoaded', function() {
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (fechaInicio && fechaFin) {
        // Establecer fecha mínima como hoy
        const hoy = new Date().toISOString().split('T')[0];
        fechaInicio.min = hoy;
        
        // Validar que fecha fin sea posterior a fecha inicio
        fechaInicio.addEventListener('change', function() {
            fechaFin.min = this.value;
        });
    }
});

// Función para guardar oferta
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardarOferta = document.getElementById('guardar-oferta');
    const btnCancelarOferta = document.getElementById('cancelar-oferta');
    
    if (btnGuardarOferta) {
        btnGuardarOferta.addEventListener('click', function() {
            // Aquí puedes agregar la lógica para guardar la oferta
            console.log('Guardando oferta...');
            // Cerrar modal después de guardar
            modalOferta.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (btnCancelarOferta) {
        btnCancelarOferta.addEventListener('click', function() {
            modalOferta.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// =============================
// Mostrar campos dinámicos según alcance en el modal de oferta
// =============================

document.addEventListener('DOMContentLoaded', function() {
    const alcanceOferta = document.getElementById('alcance-oferta');
    const campoMarca = document.getElementById('campo-marca');
    const campoCategoria = document.getElementById('campo-categoria');
    const campoProducto = document.getElementById('campo-producto');

    function cargarMarcas() {
        fetch('/api/marcas')
            .then(res => res.json())
            .then(marcas => {
                const select = document.getElementById('marcas');
                select.innerHTML = '<option value="">Seleccionar Marca</option>';
                marcas.forEach(marca => {
                    select.innerHTML += `<option value="${marca.id_marca}">${marca.nombre}</option>`;
                });
            });
    }
    function cargarCategorias() {
        fetch('/api/categorias')
            .then(res => res.json())
            .then(categorias => {
                const select = document.getElementById('categorias');
                select.innerHTML = '<option value="">Seleccionar Categoría</option>';
                categorias.forEach(cat => {
                    select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
                });
            });
    }
    function cargarProductos() {
        fetch('/api/productos')
            .then(res => res.json())
            .then(productos => {
                const select = document.getElementById('productos');
                select.innerHTML = '<option value="">Seleccionar Producto</option>';
                productos.forEach(prod => {
                    select.innerHTML += `<option value="${prod.id_producto}">${prod.nombre}</option>`;
                });
            });
    }

    if (alcanceOferta) {
        alcanceOferta.addEventListener('change', function() {
            campoMarca.style.display = 'none';
            campoCategoria.style.display = 'none';
            campoProducto.style.display = 'none';
            if (this.value === 'marca') {
                campoMarca.style.display = 'block';
                cargarMarcas();
            } else if (this.value === 'categoria') {
                campoCategoria.style.display = 'block';
                cargarCategorias();
            } else if (this.value === 'producto') {
                campoProducto.style.display = 'block';
                cargarProductos();
            }
        });
    }
});

//=========================================
// Funciones para las acciones de la tabla
//=========================================

function verOferta(id) {
    console.log('Ver oferta con ID:', id);
    // Implementar lógica para ver detalles de la oferta
}

function editarOferta(id) {
    console.log('Editar oferta con ID:', id);
    // Implementar lógica para editar oferta
}

function eliminarOferta(id) {
    console.log('Eliminar oferta con ID:', id);
    // Implementar lógica para eliminar oferta
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
        // Lógica de eliminación
    }
}