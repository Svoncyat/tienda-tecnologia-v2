//=========================================
// Modal para agregar productos
//=========================================
// Obtener elementos del modal
const modalproductos = document.getElementById('modal-agregar-producto');
const btnAgregarProducto = document.querySelector('#agregar-producto');
const spanCloseproductos = document.querySelector('#modal-agregar-producto .close');

// Función para cargar marcas y categorías en los selects
function cargarMarcasYCategorias() {
    // Cargar marcas
    fetch('/api/marcas')
        .then(res => res.json())
        .then(marcas => {
            const selectMarca = document.getElementById('marca-product');
            selectMarca.innerHTML = '<option value="">Seleccionar Marca</option>';
            marcas.forEach(marca => {
                selectMarca.innerHTML += `<option value="${marca.id_marca}">${marca.nombre}</option>`;
            });
        });
    // Cargar categorías
    fetch('/api/categorias')
        .then(res => res.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria-product');
            selectCategoria.innerHTML = '<option value="">Seleccionar Categoría</option>';
            categorias.forEach(cat => {
                selectCategoria.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
            });
        });
}

// Abrir modal cuando se hace clic en "Agregar Producto"
btnAgregarProducto.addEventListener('click', function() {
    cargarMarcasYCategorias();
    modalproductos.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanCloseproductos.addEventListener('click', function() {
    modalproductos.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalproductos) {
        modalproductos.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalproductos.style.display === 'block') {
        modalproductos.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

//=========================================
// Funciones para los botones del modal
//=========================================

// Función para guardar producto
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardarProducto = document.getElementById('guardar-producto');
    const btnCancelarAgregar = document.getElementById('cancelar-agregar');
    
    // Guardar producto
    function guardarProducto() {
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
        const imagenFile = imagenInput.files[0];

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
            stockMinimo: 0, // Puedes agregar un input si lo necesitas
            imagenUrl: '', // Se asignará en el backend
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
            alert('Producto guardado correctamente');
            modalproductos.style.display = 'none';
            document.body.style.overflow = 'auto';
            limpiarCamposProducto();
            listarProductos();
        })
        .catch(err => {
            alert('Error: ' + err.message);
        });
    }

    // Función para limpiar los campos del formulario de producto
    function limpiarCamposProducto() {
        document.getElementById('cod-product').value = '';
        document.getElementById('nombre-product').value = '';
        document.getElementById('descripcion-product').value = '';
        document.getElementById('precio-product').value = '';
        document.getElementById('costo-product').value = '';
        document.getElementById('stock-product').value = '';
        document.getElementById('marca-product').selectedIndex = 0;
        document.getElementById('categoria-product').selectedIndex = 0;
        document.getElementById('estado-product').selectedIndex = 0;
        document.getElementById('mainImage').value = '';
        // Si tienes un preview de imagen, también límpialo aquí
    }

    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener('click', function(e) {
            e.preventDefault();
            guardarProducto();
        });
    }
    
    if (btnCancelarAgregar) {
        btnCancelarAgregar.addEventListener('click', function() {
            modalproductos.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// ========================================
//    Funciones para Acciones de la tabla
// ========================================

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

// =============================
// Listar productos en la tabla
// =============================
function listarProductos() {
    fetch('/api/productos')
        .then(res => res.json())
        .then(productos => {
            const tbody = document.getElementById('product-list');
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
        });
}

document.addEventListener('DOMContentLoaded', function() {
    listarProductos();
});

// ========================================
//    Modal agregar imagen
// ========================================

// Función para previsualizar imagen en un upload-box
function previewImage(inputId) {
    const input = document.getElementById(inputId);
    const uploadBox = input.parentElement;
    // Eliminar previsualización anterior si existe
    const oldPreview = uploadBox.querySelector('.image-preview');
    if (oldPreview) oldPreview.remove();
    const oldRemoveBtn = uploadBox.querySelector('.remove-image');
    if (oldRemoveBtn) oldRemoveBtn.remove();
    uploadBox.classList.remove('has-image'); // Siempre quitar antes
    // Si hay archivo seleccionado
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Ocultar icono y texto
            uploadBox.querySelector('i').style.display = 'none';
            uploadBox.querySelector('.text-img').style.display = 'none';
            // Crear imagen de previsualización
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image-preview';
            uploadBox.appendChild(img);
            // Crear botón para quitar imagen
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.type = 'button';
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
