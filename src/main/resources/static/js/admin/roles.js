// roles.js - Gestión funcional de roles y permisos con integración backend

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnAgregarRol = document.querySelector('.btn-agregar-rol');
    const modal = document.getElementById('modalAgregarRol');
    const closeModal = document.getElementById('closeModal');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnAgregar = document.getElementById('btnAgregar');
    const form = {
        codigoRol: document.getElementById('codigoRol'),
        nombreRol: document.getElementById('nombreRol'),
        descripcionRol: document.getElementById('descripcionRol'),
        permisos: document.querySelectorAll('input[name="permisos"]')
    };
    const contenedorRoles = document.querySelector('.contenido-1');

    let permisosDisponibles = [];
    let roles = [];
    let editandoRolId = null;

    // --- Utilidades ---
    function limpiarFormulario() {
        form.codigoRol.value = '';
        form.nombreRol.value = '';
        form.descripcionRol.value = '';
        form.permisos.forEach(checkbox => { checkbox.checked = false; });
        editandoRolId = null;
        btnAgregar.innerHTML = '<i class="fas fa-plus"></i> Agregar';
    }

    function cerrarModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        limpiarFormulario();
    }

    function validarFormulario() {
        if (!form.codigoRol.value.trim()) { alert('Por favor, ingrese el código del rol'); form.codigoRol.focus(); return false; }
        if (!form.nombreRol.value.trim()) { alert('Por favor, ingrese el nombre del rol'); form.nombreRol.focus(); return false; }
        if (!form.descripcionRol.value.trim()) { alert('Por favor, ingrese una descripción del rol'); form.descripcionRol.focus(); return false; }
        return true;
    }

    function obtenerPermisosSeleccionados() {
        return Array.from(form.permisos).filter(cb => cb.checked).map(cb => cb.value);
    }

    // --- Mapeo de labels bonitos para los permisos ---
    const labelPermisos = {
      perfiles: "Módulo Perfiles",
      documentos: "Módulo Documentos",
      clientes: "Módulo Clientes",
      compras: "Módulo Compras",
      inventario: "Módulo Inventario",
      reportes: "Módulo Reportes",
      ventas: "Módulo Ventas",
      configuracion: "Módulo Configuración"
    };

    // --- Renderizado de roles ---
    function renderizarRoles() {
        contenedorRoles.innerHTML = '';
        roles.forEach(rol => {
            const card = document.createElement('div');
            card.className = 'role-card';
            card.innerHTML = `
                <div class="role-header">
                    <h3>${rol.nombre}</h3>
                    <span>${rol.activo === false ? 'Inactivo' : 'Activo'}</span>
                </div>
                <div class="role-description">
                    <p>${rol.descripcion || ''}</p>
                </div>
                <div class="role-users">
                    <i class="fa-solid fa-user-group"></i>
                    <span>${rol.usuarios || 0} Usuarios</span>
                    <div class="last-modified">
                        <i class="fas fa-clock"></i>
                        <span>Última modificación: ${rol.fechaModificacion ? new Date(rol.fechaModificacion).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
                <div class="permissions-list">
                    ${permisosDisponibles.map(permiso => {
                        const tienePermiso = rol.permisos && Array.isArray(rol.permisos) && rol.permisos.some(p => p.nombre === permiso.nombre);
                        return `<div class="permission-item ${tienePermiso ? 'allowed' : 'denied'}">
                            <i class="fas fa-${tienePermiso ? 'check' : 'times'}"></i>
                            <span>${labelPermisos[permiso.nombre] || permiso.nombre}</span>
                        </div>`;
                    }).join('')}
                </div>
                <div class="role-actions">
                    <button class="btn-edit" data-id="${rol.id_rol}"><i class="fas fa-edit"></i><span>Editar</span></button>
                    <button class="btn-delete" data-id="${rol.id_rol}"><i class="fa-solid fa-xmark"></i><span>Eliminar</span></button>
                </div>
            `;
            contenedorRoles.appendChild(card);
        });
    }

    // --- Cargar datos desde backend ---
    async function cargarPermisos() {
        const res = await fetch('/api/permisos');
        permisosDisponibles = await res.json();
    }
    async function cargarRoles() {
        const res = await fetch('/api/roles');
        roles = await res.json();
    }
    async function refrescarVista() {
        await cargarPermisos();
        await cargarRoles();
        renderizarRoles();
    }

    // --- Crear o editar rol ---
    btnAgregar.addEventListener('click', async function() {
        if (!validarFormulario()) return;
        // Enviar solo los IDs de permisos
        const permisosSeleccionados = permisosDisponibles.filter(p => obtenerPermisosSeleccionados().includes(p.nombre)).map(p => p.id_permiso);
        const rolPayload = {
            codigo: form.codigoRol.value.trim(),
            nombre: form.nombreRol.value.trim(),
            descripcion: form.descripcionRol.value.trim(),
            estado: 'Activo',
            permisos: permisosSeleccionados
        };
        if (editandoRolId) {
            // Editar
            await fetch(`/api/roles/${editandoRolId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rolPayload)
            });
            alert('Rol actualizado exitosamente');
        } else {
            // Crear
            await fetch('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rolPayload)
            });
            alert('Rol creado exitosamente');
        }
        cerrarModal();
        await refrescarVista();
    });

    // --- Abrir modal para agregar rol ---
    btnAgregarRol.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        limpiarFormulario();
    });

    // --- Cerrar modal ---
    closeModal.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);
    window.addEventListener('click', function(event) { if (event.target === modal) cerrarModal(); });
    document.addEventListener('keydown', function(event) { if (event.key === 'Escape' && modal.style.display === 'block') cerrarModal(); });

    // --- Editar rol ---
    contenedorRoles.addEventListener('click', async function(event) {
        if (event.target.closest('.btn-edit')) {
            const id = event.target.closest('.btn-edit').dataset.id;
            const rol = roles.find(r => r.id_rol == id);
            if (!rol) return;
            editandoRolId = id;
            form.codigoRol.value = rol.codigo || '';
            form.nombreRol.value = rol.nombre || '';
            form.descripcionRol.value = rol.descripcion || '';
            form.permisos.forEach(cb => {
                cb.checked = rol.permisos && Array.isArray(rol.permisos) && rol.permisos.some(p => p.nombre === cb.value);
            });
            btnAgregar.innerHTML = '<i class="fas fa-save"></i> Guardar';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        // --- Eliminar rol ---
        if (event.target.closest('.btn-delete')) {
            const id = event.target.closest('.btn-delete').dataset.id;
            if (confirm('¿Está seguro de que desea eliminar este rol?')) {
                await fetch(`/api/roles/${id}`, { method: 'DELETE' });
                await refrescarVista();
            }
        }
    });

    // --- Filtros y búsqueda (igual que antes) ---
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    searchInput.addEventListener('input', filtrarRoles);
    searchButton.addEventListener('click', filtrarRoles);
    searchInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') filtrarRoles(); });
    const estadoSelect = document.getElementById('id-estado');
    estadoSelect.addEventListener('change', filtrarRoles);

    function filtrarRoles() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const estadoSeleccionado = estadoSelect.value;
        document.querySelectorAll('.role-card').forEach(card => {
            const roleName = card.querySelector('h3').textContent.toLowerCase();
            const roleDescription = card.querySelector('.role-description p').textContent.toLowerCase();
            const estadoRol = card.querySelector('.role-header span').textContent.toLowerCase();
            const matchesSearch = roleName.includes(searchTerm) || roleDescription.includes(searchTerm);
            const matchesEstado = estadoSeleccionado === '' || estadoRol === estadoSeleccionado;
            card.style.display = (matchesSearch && matchesEstado) ? 'block' : 'none';
        });
    }

    // --- Inicializar vista ---
    refrescarVista();
});
