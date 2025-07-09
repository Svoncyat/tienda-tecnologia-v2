//=========================================
// MÓDULO DE GESTIÓN DE USUARIOS - PERFILES
//=========================================

// Variables globales
let usuarios = [];
let roles = [];
let editandoUsuarioId = null;

//=========================================
// Inicialización cuando el DOM esté listo
//=========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando módulo de perfiles...');
    
    // Obtener elementos del DOM
    inicializarElementos();
    
    // Configurar eventos
    configurarEventos();
    
    // Cargar datos iniciales
    cargarUsuarios();
    cargarRoles();
    
    console.log('✅ Módulo de perfiles inicializado correctamente');
});

//=========================================
// Inicialización de elementos
//=========================================
function inicializarElementos() {
    // Elementos del modal agregar
    window.modalAgregarUsuario = document.getElementById('modalAgregarUsuario');
    window.closeModalUsuario = document.getElementById('closeModalUsuario');
    window.btnCancelarUsuario = document.getElementById('btnCancelarUsuario');
    window.btnAgregarUsuarioConfirm = document.getElementById('btnAgregarUsuario');
    window.btnAgregarUsuario = document.querySelector('.btn-agregar-usuario');
    
    // Elementos del modal editar
    window.modalEditarUsuario = document.getElementById('modalEditarUsuario');
    window.closeModalEditarUsuario = document.getElementById('closeModalEditarUsuario');
    window.btnCancelarEditar = document.getElementById('btnCancelarEditar');
    window.btnActualizarUsuario = document.getElementById('btnActualizarUsuario');
    
    // Elementos de búsqueda y filtros
    window.searchInput = document.getElementById('search-input');
    window.rolesSelect = document.getElementById('id-roles');
    window.estadoSelect = document.getElementById('id-estado');
    window.btnBuscar = document.querySelector('.btn-buscar');
    
    console.log('📋 Elementos del DOM inicializados');
}

//=========================================
// Configuración de eventos
//=========================================
function configurarEventos() {
    // Eventos del modal agregar
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener('click', abrirModalAgregar);
    }
    
    if (closeModalUsuario) {
        closeModalUsuario.addEventListener('click', cerrarModalAgregar);
    }
    
    if (btnCancelarUsuario) {
        btnCancelarUsuario.addEventListener('click', cerrarModalAgregar);
    }
    
    if (btnAgregarUsuarioConfirm) {
        btnAgregarUsuarioConfirm.addEventListener('click', guardarUsuario);
    }
    
    // Eventos del modal editar
    if (closeModalEditarUsuario) {
        closeModalEditarUsuario.addEventListener('click', cerrarModalEditar);
    }
    
    if (btnCancelarEditar) {
        btnCancelarEditar.addEventListener('click', cerrarModalEditar);
    }
    
    if (btnActualizarUsuario) {
        btnActualizarUsuario.addEventListener('click', actualizarUsuario);
    }
    
    // Eventos de búsqueda y filtros
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarUsuarios);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarUsuarios();
            }
        });
    }
    
    if (rolesSelect) {
        rolesSelect.addEventListener('change', filtrarUsuarios);
    }
    
    if (estadoSelect) {
        estadoSelect.addEventListener('change', filtrarUsuarios);
    }
    
    // Cerrar modales al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target === modalAgregarUsuario) {
            cerrarModalAgregar();
        }
        if (event.target === modalEditarUsuario) {
            cerrarModalEditar();
        }
    });
    
    console.log('⚡ Eventos configurados');
}

//=========================================
// Gestión de modales
//=========================================
function abrirModalAgregar() {
    console.log('📝 Abriendo modal agregar usuario...');
    limpiarFormularioAgregar();
    if (modalAgregarUsuario) {
        modalAgregarUsuario.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalAgregar() {
    console.log('❌ Cerrando modal agregar usuario...');
    if (modalAgregarUsuario) {
        modalAgregarUsuario.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    limpiarFormularioAgregar();
}

function abrirModalEditar(usuarioId) {
    console.log('✏️ Abriendo modal editar usuario:', usuarioId);
    const usuario = usuarios.find(u => u.id_usuario === usuarioId);
    if (usuario) {
        editandoUsuarioId = usuarioId;
        cargarDatosUsuarioEnModal(usuario);
        if (modalEditarUsuario) {
            modalEditarUsuario.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
}

function cerrarModalEditar() {
    console.log('❌ Cerrando modal editar usuario...');
    if (modalEditarUsuario) {
        modalEditarUsuario.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    editandoUsuarioId = null;
    limpiarFormularioEditar();
}

//=========================================
// Carga de datos desde el backend
//=========================================
function cargarUsuarios() {
    console.log('📊 Cargando usuarios desde el backend...');
    
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                usuarios = data.data;
                console.log(`✅ ${usuarios.length} usuarios cargados exitosamente`);
                mostrarUsuariosEnTabla(usuarios);
            } else {
                console.error('❌ Error al cargar usuarios:', data.message);
                mostrarMensaje('Error al cargar usuarios: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('❌ Error en la petición:', error);
            mostrarMensaje('Error de conexión al cargar usuarios', 'error');
        });
}

function cargarRoles() {
    console.log('👥 Cargando roles desde el backend...');
    
    fetch('/api/roles')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                roles = data.data;
                console.log(`✅ ${roles.length} roles cargados exitosamente`);
                cargarRolesEnSelects();
            } else {
                console.error('❌ Error al cargar roles:', data.message);
            }
        })
        .catch(error => {
            console.error('❌ Error al cargar roles:', error);
        });
}

//=========================================
// Mostrar usuarios en la tabla
//=========================================
function mostrarUsuariosEnTabla(usuariosAMostrar) {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) {
        console.error('❌ No se encontró la tabla de usuarios');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (usuariosAMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No hay usuarios registrados.</td></tr>';
        return;
    }
    
    usuariosAMostrar.forEach((usuario, index) => {
        const fila = document.createElement('tr');
        
        // Formatear fecha de último acceso
        const ultimoAcceso = usuario.ultimoAcceso ? 
            new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES') : 
            'Nunca';
        
        // Determinar el estado visual
        const estadoClass = usuario.activo ? 'estado-activo' : 'estado-inactivo';
        const estadoTexto = usuario.activo ? 'Activo' : 'Inactivo';
        
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${usuario.nombres} ${usuario.apellidos}</td>
            <td>${usuario.username}</td>
            <td>${usuario.email || 'N/A'}</td>
            <td>${usuario.rol ? usuario.rol.nombre : 'Sin rol'}</td>
            <td><span class="${estadoClass}">${estadoTexto}</span></td>
            <td>${ultimoAcceso}</td>
            <td class="acciones">
                <button class="btn-accion btn-editar" onclick="editarUsuario(${usuario.id_usuario})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-accion btn-estado" onclick="cambiarEstadoUsuario(${usuario.id_usuario})" title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                    <i class="fas fa-${usuario.activo ? 'ban' : 'check'}"></i>
                </button>
                <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${usuario.id_usuario})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(fila);
    });
    
    console.log(`📋 ${usuariosAMostrar.length} usuarios mostrados en la tabla`);
}

//=========================================
// Guardar nuevo usuario
//=========================================
function guardarUsuario() {
    console.log('💾 Guardando nuevo usuario...');
    
    // Obtener datos del formulario
    const datosUsuario = obtenerDatosFormularioAgregar();
    
    // Validar datos
    if (!validarDatosUsuario(datosUsuario)) {
        return;
    }
    
    // Enviar al backend
    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Usuario guardado exitosamente');
            mostrarMensaje('Usuario creado exitosamente', 'success');
            cerrarModalAgregar();
            cargarUsuarios(); // Recargar la lista
        } else {
            console.error('❌ Error al guardar usuario:', data.message);
            mostrarMensaje('Error al crear usuario: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en la petición:', error);
        mostrarMensaje('Error de conexión al crear usuario', 'error');
    });
}

//=========================================
// Actualizar usuario existente
//=========================================
function actualizarUsuario() {
    console.log('💾 Actualizando usuario...', editandoUsuarioId);
    
    if (!editandoUsuarioId) {
        mostrarMensaje('Error: No se encontró el usuario a editar', 'error');
        return;
    }
    
    // Obtener datos del formulario
    const datosUsuario = obtenerDatosFormularioEditar();
    
    // Validar datos
    if (!validarDatosUsuarioEditar(datosUsuario)) {
        return;
    }
    
    // Enviar al backend
    fetch(`/api/usuarios/${editandoUsuarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Usuario actualizado exitosamente');
            mostrarMensaje('Usuario actualizado exitosamente', 'success');
            cerrarModalEditar();
            cargarUsuarios(); // Recargar la lista
        } else {
            console.error('❌ Error al actualizar usuario:', data.message);
            mostrarMensaje('Error al actualizar usuario: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en la petición:', error);
        mostrarMensaje('Error de conexión al actualizar usuario', 'error');
    });
}

//=========================================
// Funciones de utilidad
//=========================================
function obtenerDatosFormularioAgregar() {
    // Obtener valor del género y convertirlo al formato esperado por el enum
    const generoValue = document.getElementById('genero').value;
    const generoFormatted = generoValue.charAt(0).toUpperCase() + generoValue.slice(1).toLowerCase();
    
    // Obtener valor del estado civil y convertirlo al formato esperado por el enum
    const estadoCivilValue = document.getElementById('estadoCivil').value;
    const estadoCivilFormatted = estadoCivilValue.charAt(0).toUpperCase() + estadoCivilValue.slice(1).toLowerCase();
    
    return {
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        genero: generoFormatted, // Convertido a formato correcto
        estadoCivil: estadoCivilFormatted, // Convertido a formato correcto
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        username: document.getElementById('usuario').value.trim(),
        passwordHash: document.getElementById('contrasena').value,
        fechaIngreso: document.getElementById('fechaIngreso').value,
        rol: { id_rol: parseInt(document.getElementById('rol').value) },
        activo: true
    };
}

function obtenerDatosFormularioEditar() {
    // Obtener valor del género y convertirlo al formato esperado por el enum
    const generoValue = document.getElementById('editGenero').value;
    const generoFormatted = generoValue.charAt(0).toUpperCase() + generoValue.slice(1).toLowerCase();
    
    // Obtener valor del estado civil y convertirlo al formato esperado por el enum
    const estadoCivilValue = document.getElementById('editEstadoCivil').value;
    const estadoCivilFormatted = estadoCivilValue.charAt(0).toUpperCase() + estadoCivilValue.slice(1).toLowerCase();
    
    return {
        nombres: document.getElementById('editNombres').value.trim(),
        apellidos: document.getElementById('editApellidos').value.trim(),
        dni: document.getElementById('editDni').value.trim(),
        fechaNacimiento: document.getElementById('editFechaNacimiento').value,
        genero: generoFormatted, // Convertido a formato correcto
        estadoCivil: estadoCivilFormatted, // Convertido a formato correcto
        telefono: document.getElementById('editTelefono').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        username: document.getElementById('editUsuario').value.trim(),
        fechaIngreso: document.getElementById('editFechaIngreso').value,
        rol: { id_rol: parseInt(document.getElementById('editRol').value) },
        activo: document.getElementById('editEstado').value === 'Activo'
    };
}

function validarDatosUsuario(datos) {
    if (!datos.nombres || !datos.apellidos || !datos.dni || !datos.email || !datos.username || !datos.passwordHash) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
        return false;
    }
    
    if (datos.dni.length !== 8) {
        mostrarMensaje('El DNI debe tener 8 dígitos', 'error');
        return false;
    }
    
    const confirmPassword = document.getElementById('repetirContrasena').value;
    if (datos.passwordHash !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return false;
    }
    
    if (!datos.rol.id_rol) {
        mostrarMensaje('Por favor, selecciona un rol', 'error');
        return false;
    }
    
    return true;
}

function validarDatosUsuarioEditar(datos) {
    if (!datos.nombres || !datos.apellidos || !datos.dni || !datos.email || !datos.username) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
        return false;
    }
    
    if (datos.dni.length !== 8) {
        mostrarMensaje('El DNI debe tener 8 dígitos', 'error');
        return false;
    }
    
    if (!datos.rol.id_rol) {
        mostrarMensaje('Por favor, selecciona un rol', 'error');
        return false;
    }
    
    return true;
}

function limpiarFormularioAgregar() {
    const campos = ['nombres', 'apellidos', 'dni', 'fechaNacimiento', 'genero', 'estadoCivil', 
                   'telefono', 'email', 'usuario', 'contrasena', 'repetirContrasena', 
                   'fechaIngreso', 'rol'];
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = '';
        }
    });
}

function limpiarFormularioEditar() {
    const campos = ['editNombres', 'editApellidos', 'editDni', 'editFechaNacimiento', 
                   'editGenero', 'editEstadoCivil', 'editTelefono', 'editEmail', 
                   'editUsuario', 'editFechaIngreso', 'editRol', 'editEstado'];
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = '';
        }
    });
}

function cargarDatosUsuarioEnModal(usuario) {
    document.getElementById('editNombres').value = usuario.nombres || '';
    document.getElementById('editApellidos').value = usuario.apellidos || '';
    document.getElementById('editDni').value = usuario.dni || '';
    document.getElementById('editFechaNacimiento').value = usuario.fechaNacimiento || '';
    document.getElementById('editGenero').value = usuario.genero || '';
    document.getElementById('editEstadoCivil').value = usuario.estadoCivil || '';
    document.getElementById('editTelefono').value = usuario.telefono || '';
    document.getElementById('editEmail').value = usuario.email || '';
    document.getElementById('editUsuario').value = usuario.username || '';
    document.getElementById('editFechaIngreso').value = usuario.fechaIngreso || '';
    document.getElementById('editRol').value = usuario.rol ? usuario.rol.id_rol : '';
    document.getElementById('editEstado').value = usuario.activo ? 'Activo' : 'Inactivo';
}

function cargarRolesEnSelects() {
    const selectRol = document.getElementById('rol');
    const selectEditRol = document.getElementById('editRol');
    const selectFiltroRol = document.getElementById('id-roles');
    
    if (selectRol) {
        selectRol.innerHTML = '<option value="" disabled selected>Seleccionar</option>';
        roles.forEach(rol => {
            selectRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`;
        });
    }
    
    if (selectEditRol) {
        selectEditRol.innerHTML = '<option value="" disabled selected>Seleccionar</option>';
        roles.forEach(rol => {
            selectEditRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`;
        });
    }
    
    if (selectFiltroRol) {
        roles.forEach(rol => {
            selectFiltroRol.innerHTML += `<option value="${rol.nombre.toLowerCase()}">${rol.nombre}</option>`;
        });
    }
}

//=========================================
// Búsqueda y filtros
//=========================================
function buscarUsuarios() {
    const termino = searchInput ? searchInput.value.toLowerCase().trim() : '';
    console.log('🔍 Buscando usuarios con término:', termino);
    
    if (!termino) {
        mostrarUsuariosEnTabla(usuarios);
        return;
    }
    
    const usuariosFiltrados = usuarios.filter(usuario => {
        return usuario.nombres.toLowerCase().includes(termino) ||
               usuario.apellidos.toLowerCase().includes(termino) ||
               usuario.username.toLowerCase().includes(termino) ||
               (usuario.email && usuario.email.toLowerCase().includes(termino)) ||
               usuario.dni.includes(termino);
    });
    
    mostrarUsuariosEnTabla(usuariosFiltrados);
}

function filtrarUsuarios() {
    const rolFiltro = rolesSelect ? rolesSelect.value.toLowerCase() : '';
    const estadoFiltro = estadoSelect ? estadoSelect.value.toLowerCase() : '';
    
    console.log('🔍 Filtrando usuarios - Rol:', rolFiltro, 'Estado:', estadoFiltro);
    
    let usuariosFiltrados = [...usuarios];
    
    if (rolFiltro) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
            usuario.rol && usuario.rol.nombre.toLowerCase() === rolFiltro
        );
    }
    
    if (estadoFiltro) {
        const activo = estadoFiltro === 'activo';
        usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.activo === activo);
    }
    
    mostrarUsuariosEnTabla(usuariosFiltrados);
}

//=========================================
// Acciones de usuario
//=========================================
function editarUsuario(usuarioId) {
    console.log('✏️ Editar usuario:', usuarioId);
    abrirModalEditar(usuarioId);
}

function eliminarUsuario(usuarioId) {
    console.log('🗑️ Eliminar usuario:', usuarioId);
    
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    fetch(`/api/usuarios/${usuarioId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Usuario eliminado exitosamente');
            mostrarMensaje('Usuario eliminado exitosamente', 'success');
            cargarUsuarios(); // Recargar la lista
        } else {
            console.error('❌ Error al eliminar usuario:', data.message);
            mostrarMensaje('Error al eliminar usuario: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en la petición:', error);
        mostrarMensaje('Error de conexión al eliminar usuario', 'error');
    });
}

function cambiarEstadoUsuario(usuarioId) {
    console.log('🔄 Cambiar estado de usuario:', usuarioId);
    
    const usuario = usuarios.find(u => u.id_usuario === usuarioId);
    if (!usuario) {
        mostrarMensaje('Usuario no encontrado', 'error');
        return;
    }
    
    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Estás seguro de que deseas ${accion} este usuario?`)) {
        return;
    }
    
    fetch(`/api/usuarios/${usuarioId}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`✅ Usuario ${accion} exitosamente`);
            mostrarMensaje(`Usuario ${accion} exitosamente`, 'success');
            cargarUsuarios(); // Recargar la lista
        } else {
            console.error(`❌ Error al ${accion} usuario:`, data.message);
            mostrarMensaje(`Error al ${accion} usuario: ` + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en la petición:', error);
        mostrarMensaje(`Error de conexión al ${accion} usuario`, 'error');
    });
}

//=========================================
// Función para mostrar mensajes
//=========================================
function mostrarMensaje(mensaje, tipo = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `mensaje-${tipo}`;
    messageDiv.textContent = mensaje;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;
    
    if (tipo === 'success') {
        messageDiv.style.backgroundColor = '#28a745';
    } else if (tipo === 'error') {
        messageDiv.style.backgroundColor = '#dc3545';
    } else {
        messageDiv.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Hacer funciones globales para uso en HTML
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;
