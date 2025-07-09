//=========================================
// Modal para agregar productos
//=========================================
// Obtener elementos del modal
const modalproductos = document.getElementById('modal-agregar-producto');
const btnAgregarProducto = document.querySelector('#agregar-producto');
const spanCloseproductos = document.querySelector('#modal-agregar-producto .close');

// Verificar que los elementos existen
console.log('Modal producto:', modalproductos);
console.log('Botón agregar producto:', btnAgregarProducto);
console.log('Botón cerrar modal:', spanCloseproductos);

// Verificar que el modal existe antes de configurar eventos
if (!modalproductos) {
    console.error('No se encontró el modal con ID: modal-agregar-producto');
}
if (!btnAgregarProducto) {
    console.error('No se encontró el botón con ID: agregar-producto');
}

// Función para cargar marcas y categorías en los selects
function cargarMarcasYCategorias() {
    // Cargar marcas
    fetch('/api/marcas')
        .then(res => res.json())
        .then(marcas => {
            const selectMarca = document.getElementById('marca-product');
            if (selectMarca) {
                selectMarca.innerHTML = '<option value="">Seleccionar Marca</option>';
                marcas.forEach(marca => {
                    selectMarca.innerHTML += `<option value="${marca.id_marca}">${marca.nombre}</option>`;
                });
            }
        })
        .catch(err => console.log('Error cargando marcas:', err));
    
    // Cargar categorías
    fetch('/api/categorias')
        .then(res => res.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria-product');
            if (selectCategoria) {
                selectCategoria.innerHTML = '<option value="">Seleccionar Categoría</option>';
                categorias.forEach(cat => {
                    selectCategoria.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
                });
            }
        })
        .catch(err => console.log('Error cargando categorías:', err));
}

//=========================================
// Funciones para gestión del modal
//=========================================

// Función para limpiar los campos del formulario de producto
function limpiarCamposProducto() {
    console.log('Limpiando campos del formulario...');
    
    // Limpiar campos de texto
    const codProduct = document.getElementById('cod-product');
    const nombreProduct = document.getElementById('nombre-product');
    const descripcionProduct = document.getElementById('descripcion-product');
    const precioProduct = document.getElementById('precio-product');
    const costoProduct = document.getElementById('costo-product');
    const stockProduct = document.getElementById('stock-product');
    
    if (codProduct) codProduct.value = '';
    if (nombreProduct) nombreProduct.value = '';
    if (descripcionProduct) descripcionProduct.value = '';
    if (precioProduct) precioProduct.value = '';
    if (costoProduct) costoProduct.value = '';
    if (stockProduct) stockProduct.value = '';
    
    // Limpiar campos de número específicos
    const impuestoField = document.getElementById('impuesto-product');
    const dimensionesField = document.getElementById('dimenciones-product');
    const pesoField = document.getElementById('peso-product');
    
    if (impuestoField) impuestoField.value = '';
    if (dimensionesField) dimensionesField.value = '';
    if (pesoField) pesoField.value = '';
    
    // Resetear selects
    const marcaProduct = document.getElementById('marca-product');
    const categoriaProduct = document.getElementById('categoria-product');
    const estadoProduct = document.getElementById('estado-product');
    const unidadMedidaField = document.getElementById('unidad-medida');
    
    if (marcaProduct) marcaProduct.selectedIndex = 0;
    if (categoriaProduct) categoriaProduct.selectedIndex = 0;
    if (estadoProduct) estadoProduct.selectedIndex = 0;
    if (unidadMedidaField) unidadMedidaField.selectedIndex = 0;
    
    // Limpiar input de imagen
    const mainImage = document.getElementById('mainImage');
    if (mainImage) mainImage.value = '';
    
    // Limpiar preview de imagen si existe
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
        const existingImg = uploadBox.querySelector('img');
        const removeBtn = uploadBox.querySelector('.remove-image');
        
        if (existingImg) existingImg.remove();
        if (removeBtn) removeBtn.remove();
        
        // Restaurar elementos originales
        const icon = uploadBox.querySelector('i');
        const textImg = uploadBox.querySelector('.text-img');
        
        if (icon) icon.style.display = '';
        if (textImg) textImg.style.display = '';
        uploadBox.classList.remove('has-image');
    }
}

// Función para cerrar modal y limpiar
function cerrarModalYLimpiar() {
    console.log('Cerrando modal y limpiando formulario...');
    
    if (modalproductos) {
        modalproductos.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    limpiarCamposProducto();
}

// Configurar eventos del modal
document.addEventListener('DOMContentLoaded', function() {
    // Abrir modal cuando se hace clic en "Agregar Producto"
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener('click', function() {
            console.log('🔄 Botón Agregar Producto clickeado');
            
            // Limpiar campos antes de abrir el modal
            limpiarCamposProducto();
            
            // Cargar datos dinámicos
            cargarMarcasYCategorias();
            
            // Mostrar modal
            modalproductos.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('✅ Modal abierto y campos limpiados');
        });
    } else {
        console.error('Botón agregar producto no encontrado');
    }

    // Cerrar modal cuando se hace clic en la X
    if (spanCloseproductos) {
        spanCloseproductos.addEventListener('click', function() {
            console.log('🔄 Cerrando modal (botón X)');
            cerrarModalYLimpiar();
        });
    }

    // Cerrar modal cuando se hace clic fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target === modalproductos) {
            console.log('🔄 Cerrando modal (click fuera)');
            cerrarModalYLimpiar();
        }
    });

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalproductos && modalproductos.style.display === 'block') {
            console.log('🔄 Cerrando modal (tecla Escape)');
            cerrarModalYLimpiar();
        }
    });
});

//=========================================
// Funciones para los botones del modal
//=========================================

// Configurar botones del modal
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardarProducto = document.getElementById('guardar-producto');
    const btnCancelarAgregar = document.getElementById('cancelar-agregar');
    
    // Función para guardar producto
    function guardarProducto() {
        console.log('Guardando producto...');
        
        // Validaciones
        const codigo_sku = document.getElementById('cod-product').value.trim();
        const nombre = document.getElementById('nombre-product').value.trim();
        const descripcion = document.getElementById('descripcion-product').value.trim();
        const precioVenta = parseFloat(document.getElementById('precio-product').value);
        const costoCompra = parseFloat(document.getElementById('costo-product').value);
        const stock = parseInt(document.getElementById('stock-product').value);
        const marcaId = parseInt(document.getElementById('marca-product').value);
        const categoriaId = parseInt(document.getElementById('categoria-product').value);
        const estado = document.getElementById('estado-product').value;
        const imagenInput = document.getElementById('mainImage');
        const imagenFile = imagenInput ? imagenInput.files[0] : null;

        if (!nombre || isNaN(precioVenta) || isNaN(stock) || isNaN(marcaId) || isNaN(categoriaId) || !estado) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const producto = {
            codigo_sku,
            nombre,
            descripcion,
            precioVenta,
            costoCompra: isNaN(costoCompra) ? 0 : costoCompra,
            stock,
            stockMinimo: 0,
            imagenUrl: '',
            activo: estado !== 'descontinuado',
            marca: { id_marca: marcaId },
            categoria: { id_categoria: categoriaId }
        };

        const formData = new FormData();
        formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));
        if (imagenFile) {
            formData.append('imagen', imagenFile);
        }

        fetch('/api/productos/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text || 'Error al guardar el producto'); });
        })
        .then(data => {
            console.log('Producto guardado exitosamente:', data);
            alert('Producto guardado correctamente');
            cerrarModalYLimpiar();
            listarProductos();
        })
        .catch(err => {
            console.error('Error al guardar producto:', err);
            alert('Error: ' + err.message);
        });
    }

    // Configurar evento del botón guardar
    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener('click', function(e) {
            e.preventDefault();
            guardarProducto();
        });
    } else {
        console.warn('Botón guardar no encontrado');
    }
    
    // Configurar evento del botón cancelar
    if (btnCancelarAgregar) {
        btnCancelarAgregar.addEventListener('click', function() {
            console.log('Botón cancelar clickeado');
            cerrarModalYLimpiar();
        });
    } else {
        console.warn('Botón cancelar no encontrado');
    }
});

//=========================================
// Funciones para Acciones de la tabla
//=========================================

function verProducto(id) {
    console.log('Ver producto con ID:', id);
    // Aquí irá la lógica para ver detalles del producto
}

function editarProducto(id) {
    console.log('Editar producto con ID:', id);
    // Aquí irá la lógica para editar el producto
}

function eliminarProducto(id) {
    console.log('Eliminar producto con ID:', id);
    // Aquí irá la lógica para eliminar el producto
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        // Lógica de eliminación
    }
}

//=============================
// Listar productos en la tabla
//=============================
function listarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(productos => {
            const tabla = document.querySelector('.tabla tbody');
            if (tabla) {
                tabla.innerHTML = '';
                productos.forEach(prod => {
                    tabla.innerHTML += `
                    <tr>
                        <td>${prod.id_producto}</td>
                        <td>${prod.codigo_sku || 'N/A'}</td>
                        <td>${prod.nombre}</td>
                        <td>${prod.marca ? prod.marca.nombre : 'Sin marca'}</td>
                        <td>${prod.categoria ? prod.categoria.nombre : 'Sin categoría'}</td>
                        <td>S/ ${prod.precioVenta.toFixed(2)}</td>
                        <td>${prod.stock}</td>
                        <td><span class="${prod.activo ? 'estado-disponible' : 'estado-agotado'}">${prod.activo ? 'Disponible' : 'Agotado'}</span></td>
                        <td class="acciones">
                            <button class="btn-accion btn-ver" onclick="verProducto(${prod.id_producto})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-accion btn-editar" onclick="editarProducto(${prod.id_producto})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${prod.id_producto})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
}

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    listarProductos();
});

//========================================
// Funcionalidad de preview de imagen
//========================================

function previewImage(inputId) {
    const input = document.getElementById(inputId);
    const uploadBox = input.parentElement;
    
    // Eliminar previsualización anterior si existe
    const oldPreview = uploadBox.querySelector('.image-preview');
    if (oldPreview) oldPreview.remove();
    const oldRemoveBtn = uploadBox.querySelector('.remove-image');
    if (oldRemoveBtn) oldRemoveBtn.remove();
    uploadBox.classList.remove('has-image');
    
    // Si hay archivo seleccionado
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Ocultar icono y texto
            uploadBox.querySelector('i').style.display = 'none';
            uploadBox.querySelector('.text-img').style.display = 'none';
            
            // Crear imagen
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('image-preview');
            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
            uploadBox.appendChild(img);
            
            // Crear botón de eliminar
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-image');
            removeBtn.style.cssText = 'position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Quitar imagen';
            removeBtn.onclick = function(ev) {
                ev.stopPropagation();
                input.value = '';
                img.remove();
                removeBtn.remove();
                uploadBox.classList.remove('has-image');
                uploadBox.querySelector('i').style.display = '';
                uploadBox.querySelector('.text-img').style.display = '';
            };
            uploadBox.appendChild(removeBtn);
            uploadBox.classList.add('has-image');
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        // Si se elimina la selección, restaurar icono y texto
        uploadBox.querySelector('i').style.display = '';
        uploadBox.querySelector('.text-img').style.display = '';
        uploadBox.classList.remove('has-image');
    }
}

// Asignar eventos a los inputs de imagen
document.addEventListener('DOMContentLoaded', function() {
    const mainImageInput = document.getElementById('mainImage');
    const secondaryImageInput = document.getElementById('secondaryImage');

    if (mainImageInput) {
        mainImageInput.addEventListener('change', function() {
            previewImage('mainImage');
        });
    }
    if (secondaryImageInput) {
        secondaryImageInput.addEventListener('change', function() {
            previewImage('secondaryImage');
        });
    }
});
