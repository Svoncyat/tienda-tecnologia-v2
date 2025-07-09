//=========================================
// INVENTARIO - Gestión de productos
//=========================================

// Variables globales
let modalproductos, btnAgregarProducto, spanCloseproductos;
let btnGuardarProducto, btnCancelarAgregar;

//=========================================
// Inicialización cuando el DOM esté listo
//=========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando módulo de inventario...');
    
    // Obtener elementos del DOM
    inicializarElementos();
    
    // Configurar eventos
    configurarEventos();
    
    // Cargar listado inicial
    listarProductos();
    
    console.log('✅ Módulo de inventario inicializado correctamente');
});

//=========================================
// Funciones de inicialización
//=========================================
function inicializarElementos() {
    // Elementos del modal
    modalproductos = document.getElementById('modal-agregar-producto');
    btnAgregarProducto = document.querySelector('#agregar-producto');
    spanCloseproductos = document.querySelector('#modal-agregar-producto .close');
    btnGuardarProducto = document.getElementById('btn-guardar-producto');
    btnCancelarAgregar = document.getElementById('btn-cancelar-agregar');
    
    // Debug: Verificar que los elementos existen
    console.log('Modal producto:', modalproductos);
    console.log('Botón agregar producto:', btnAgregarProducto);
    console.log('Botón cerrar modal:', spanCloseproductos);
    console.log('Botón guardar:', btnGuardarProducto);
    console.log('Botón cancelar:', btnCancelarAgregar);
    
    // Verificar elementos críticos
    if (!modalproductos) {
        console.error('❌ No se encontró el modal con ID: modal-agregar-producto');
        return false;
    }
    if (!btnAgregarProducto) {
        console.error('❌ No se encontró el botón con ID: agregar-producto');
        return false;
    }
    
    return true;
}

function configurarEventos() {
    if (!inicializarElementos()) return;
    
    // Eventos del modal
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener('click', abrirModal);
    }
    
    if (spanCloseproductos) {
        spanCloseproductos.addEventListener('click', cerrarModalYLimpiar);
    }
    
    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener('click', function(e) {
            e.preventDefault();
            guardarProducto();
        });
    }
    
    if (btnCancelarAgregar) {
        btnCancelarAgregar.addEventListener('click', cerrarModalYLimpiar);
    }
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target === modalproductos) {
            cerrarModalYLimpiar();
        }
    });
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalproductos && modalproductos.style.display === 'block') {
            cerrarModalYLimpiar();
        }
    });
    
    // Configurar eventos de imagen
    configurarEventosImagen();
}

//=========================================
// Gestión del modal
//=========================================
function abrirModal() {
    console.log('🔄 Abriendo modal de agregar producto...');
    
    // Limpiar campos antes de abrir
    limpiarCamposProducto();
    
    // Cargar datos dinámicos
    cargarMarcasYCategorias();
    
    // Mostrar modal
    if (modalproductos) {
        modalproductos.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal abierto correctamente');
    }
}

function cerrarModalYLimpiar() {
    console.log('🔄 Cerrando modal y limpiando formulario...');
    
    if (modalproductos) {
        modalproductos.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    limpiarCamposProducto();
    console.log('✅ Modal cerrado y campos limpiados');
}

//=========================================
// Gestión de formulario
//=========================================
function limpiarCamposProducto() {
    console.log('🧹 Limpiando campos del formulario...');
    
    // Campos de texto
    const campos = [
        'cod-product', 'nombre-product', 'descripcion-product',
        'precio-product', 'costo-product', 'stock-product',
        'impuesto-product', 'dimenciones-product', 'peso-product'
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
    });
    
    // Selects
    const selects = [
        'marca-product', 'categoria-product', 
        'estado-product', 'unidad-medida'
    ];
    
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) select.selectedIndex = 0;
    });
    
    // Limpiar imagen
    limpiarImagenPreview();
}

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
// Guardar producto
//=========================================
function guardarProducto() {
    console.log('💾 Guardando producto...');
    
    // Obtener valores del formulario
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

    // Validaciones
    if (!nombre || isNaN(precioVenta) || isNaN(stock) || isNaN(marcaId) || isNaN(categoriaId) || !estado) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Crear objeto producto
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

    // Crear FormData para enviar con imagen
    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));
    if (imagenFile) {
        formData.append('imagen', imagenFile);
    }

    // Enviar petición
    fetch('/api/productos/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (res.ok) return res.json();
        return res.text().then(text => { throw new Error(text || 'Error al guardar el producto'); });
    })
    .then(data => {
        console.log('✅ Producto guardado exitosamente:', data);
        alert('Producto guardado correctamente');
        cerrarModalYLimpiar();
        // RECARGAR LA LISTA DE PRODUCTOS
        listarProductos();
    })
    .catch(err => {
        console.error('❌ Error al guardar producto:', err);
        alert('Error: ' + err.message);
    });
}

//=========================================
// Listado de productos
//=========================================
function listarProductos() {
    console.log('📋 Cargando lista de productos...');
    
    fetch('/api/productos')
        .then(res => res.json())
        .then(productos => {
            const tbody = document.getElementById('product-list');
            if (!tbody) {
                console.error('❌ No se encontró la tabla de productos');
                return;
            }
            
            tbody.innerHTML = '';
            
            if (productos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9">No hay productos registrados.</td></tr>';
                return;
            }
            
            productos.forEach((prod, idx) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${prod.codigo_sku || ''}</td>
                        <td>${prod.nombre}</td>
                        <td>${prod.marca ? prod.marca.nombre : ''}</td>
                        <td>${prod.categoria ? prod.categoria.nombre : ''}</td>
                        <td>$${prod.precioVenta != null ? prod.precioVenta.toFixed(2) : ''}</td>
                        <td>${prod.stock != null ? prod.stock : ''}</td>
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
            
            console.log(`✅ Lista actualizada con ${productos.length} productos`);
        })
        .catch(err => {
            console.error('❌ Error cargando productos:', err);
        });
}

//=========================================
// Gestión de imágenes
//=========================================
function configurarEventosImagen() {
    const mainImageInput = document.getElementById('mainImage');
    
    if (mainImageInput) {
        mainImageInput.addEventListener('change', function() {
            console.log('📸 Imagen seleccionada, generando preview...');
            previewImage('mainImage');
        });
    }
}

function previewImage(inputId) {
    const input = document.getElementById(inputId);
    if (!input || !input.files || !input.files[0]) {
        console.log('⚠️ No hay archivo seleccionado');
        return;
    }
    
    const uploadBox = input.parentElement;
    const file = input.files[0];
    
    console.log('📸 Procesando imagen:', file.name, 'Tamaño:', file.size, 'bytes');
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen.');
        input.value = '';
        return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede pesar más de 5MB.');
        input.value = '';
        return;
    }
    
    // Limpiar preview anterior
    limpiarImagenPreview();
    
    // Ocultar elementos originales
    const icon = uploadBox.querySelector('i');
    const textImg = uploadBox.querySelector('.text-img');
    if (icon) icon.style.display = 'none';
    if (textImg) textImg.style.display = 'none';
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('✅ Imagen cargada, creando preview');
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.classList.add('image-preview');
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.className = 'remove-image';
        removeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        removeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            removeImage(inputId);
        };
        
        uploadBox.appendChild(img);
        uploadBox.appendChild(removeBtn);
        uploadBox.classList.add('has-image');
        
        console.log('✅ Preview de imagen creado correctamente');
    };
    
    reader.readAsDataURL(file);
}

function removeImage(inputId) {
    console.log('🗑️ Removiendo imagen...');
    
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        limpiarImagenPreview();
    }
}

function limpiarImagenPreview() {
    const uploadBox = document.querySelector('.upload-box');
    if (!uploadBox) return;
    
    // Remover elementos de preview
    const img = uploadBox.querySelector('.image-preview');
    const removeBtn = uploadBox.querySelector('.remove-image');
    if (img) img.remove();
    if (removeBtn) removeBtn.remove();
    
    // Mostrar elementos originales
    const icon = uploadBox.querySelector('i');
    const textImg = uploadBox.querySelector('.text-img');
    if (icon) icon.style.display = '';
    if (textImg) textImg.style.display = '';
    
    uploadBox.classList.remove('has-image');
    
    console.log('🧹 Preview de imagen limpiado');
}

//=========================================
// Acciones de productos
//=========================================
function verProducto(id) {
    console.log('👁️ Ver producto con ID:', id);
    // Implementar vista de producto
}

function editarProducto(id) {
    console.log('✏️ Editar producto con ID:', id);
    // Implementar edición de producto
}

function eliminarProducto(id) {
    console.log('🗑️ Eliminar producto con ID:', id);
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        // Implementar eliminación
        fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                alert('Producto eliminado correctamente');
                listarProductos(); // Recargar lista
            } else {
                alert('Error al eliminar el producto');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error al eliminar el producto');
        });
    }
}
