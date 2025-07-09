//=========================================
// Modal para agregar categorias
//=========================================
// Obtener elementos del modal
const modalCategoria = document.getElementById('modal-agregar-categoria');
const btnAgregarCategoria = document.querySelector('#agregar-categoria');
const spanCloseCategoria = document.querySelector('#modal-agregar-categoria .close');

// Abrir modal cuando se hace clic en "Agregar Oferta"
btnAgregarCategoria.addEventListener('click', function() {
    modalCategoria.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanCloseCategoria.addEventListener('click', function() {
    modalCategoria.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalCategoria) {
        modalCategoria.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalCategoria.style.display === 'block') {
        modalCategoria.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});


//=========================================
// Modal para agregar marca
//=========================================
// Obtener elementos del modal
const modalMarca = document.getElementById('modal-agregar-marca');
const btnAgregarMarca = document.querySelector('#agregar-marca');
const spanCloseMarca = document.querySelector('#modal-agregar-marca .close');

// Abrir modal cuando se hace clic en "Agregar Marca"
btnAgregarMarca.addEventListener('click', function() {
    modalMarca.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
});

// Cerrar modal cuando se hace clic en la X
spanCloseMarca.addEventListener('click', function() {
    modalMarca.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
});

// Cerrar modal cuando se hace clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === modalMarca) {
        modalMarca.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalMarca.style.display === 'block') {
        modalMarca.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Fichero: modules/inventario/categorias.js

// =============================
// Listar categorías en la tabla
// =============================
function listarCategorias() {
    fetch('/api/categorias')
        .then(res => res.json())
        .then(categorias => {
            const tbody = document.getElementById('categoria-list');
            tbody.innerHTML = '';
            if (categorias.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">No hay categorías registradas.</td></tr>';
                return;
            }
            categorias.forEach(cat => {
                tbody.innerHTML += `
                    <tr>
                        <td>${cat.id_categoria || ''}</td>
                        <td>${cat.nombre}</td>
                        <td>${cat.descripcion || ''}</td>
                        <td>${cat.cantidadProductos || 0}</td>
                        <td>${cat.fechaCreacion ? cat.fechaCreacion.split('T')[0] : ''}</td>
                        <td class="acciones">
                            <button class="btn-accion btn-editar" onclick="editarCategoria(${cat.id_categoria})"><i class="fas fa-edit"></i></button>
                            <button class="btn-accion btn-eliminar" onclick="eliminarCategoria(${cat.id_categoria})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        });
}
// =============================
// Listar marcas en la tabla
// =============================
function listarMarcas() {
    fetch('/api/marcas')
        .then(res => res.json())
        .then(marcas => {
            const tbody = document.getElementById('marca-list');
            tbody.innerHTML = '';
            if (marcas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No hay marcas registradas.</td></tr>';
                return;
            }
            marcas.forEach(marca => {
                tbody.innerHTML += `
                    <tr>
                        <td>${marca.id_marca || ''}</td>
                        <td>${marca.nombre}</td>
                        <td>${marca.cantidadProductos || 0}</td>
                        <td>${marca.fechaCreacion ? marca.fechaCreacion.split('T')[0] : ''}</td>
                        <td class="acciones">
                            <button class="btn-accion btn-editar" onclick="editarMarca(${marca.id_marca})"><i class="fas fa-edit"></i></button>
                            <button class="btn-accion btn-eliminar" onclick="eliminarMarca(${marca.id_marca})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Guardar Categoría
const btnGuardarCategoria = document.getElementById('guardar-categoria');
if (btnGuardarCategoria) {
    btnGuardarCategoria.addEventListener('click', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre-categoria').value;
        const descripcion = document.getElementById('descripcion-categoria').value;
        fetch('/api/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Error al guardar la categoría');
        })
        .then(data => {
            alert('Categoría guardada correctamente');
            document.getElementById('modal-agregar-categoria').style.display = 'none';
            document.body.style.overflow = 'auto';
            listarCategorias();
        })
        .catch(err => {
            alert(err.message);
        });
    });
}

// Guardar Marca
const btnGuardarMarca = document.getElementById('guardar-marca');
if (btnGuardarMarca) {
    btnGuardarMarca.addEventListener('click', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombrr-marca').value;
        const descripcion = document.getElementById('descripcion-marca').value;
        fetch('/api/marcas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Error al guardar la marca');
        })
        .then(data => {
            alert('Marca guardada correctamente');
            document.getElementById('modal-agregar-marca').style.display = 'none';
            document.body.style.overflow = 'auto';
            listarMarcas();
        })
        .catch(err => {
            alert(err.message);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    listarCategorias();
    listarMarcas();
});