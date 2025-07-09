// =============================================== 
// GESTIÓN DE USUARIOS CON INTEGRACIÓN BACKEND
// =============================================== 

// Variables globales
let usuarios = [];
let usuariosFiltrados = [];
let roles = [];
let editandoUsuarioId = null;

// =============================================== 
// UTILIDADES Y VALIDACIONES
// =============================================== 

function mostrarMensaje(mensaje, tipo = 'info') {
    // Crear elemento de mensaje
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
    
    // Estilos según el tipo
    if (tipo === 'success') {
        messageDiv.style.backgroundColor = '#28a745';
    } else if (tipo === 'error') {
        messageDiv.style.backgroundColor = '#dc3545';
    } else {
        messageDiv.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
}

function limpiarFormulario() {
    const formularios = ['modalAgregarUsuario', 'modalEditarUsuario'];
    
    formularios.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const inputs = modal.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="date"]');
            const selects = modal.querySelectorAll('select');
            
            inputs.forEach(input => input.value = '');
            selects.forEach(select => select.selectedIndex = 0);
            
            // Resetear upload boxes
            const uploadBoxes = modal.querySelectorAll('.upload-box');
            uploadBoxes.forEach(box => {
                if (box.id.includes('perfil') || box.id.includes('Perfil')) {
                    box.innerHTML = '<i class="fas fa-user-circle"></i><span>Perfil</span>';
                } else {
                    box.innerHTML = '<i class="fas fa-upload"></i><span>Subir Imagen</span>';
                }
            });
        }
    });
    
    editandoUsuarioId = null;
}

// =============================================== 
// FUNCIONES PARA INTERACTUAR CON EL BACKEND
// =============================================== 

async function cargarUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        usuarios = await response.json();
        filtrarUsuarios();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarMensaje('Error al cargar la lista de usuarios', 'error');
    }
}

async function cargarRoles() {
    try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        roles = await response.json();
        actualizarSelectoresRol();
    } catch (error) {
        console.error('Error al cargar roles:', error);
        roles = []; // Fallback a array vacío
    }
}

function actualizarSelectoresRol() {
    const selectores = ['id-roles', 'rol', 'editRol'];
    
    selectores.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        if (select) {
            // Mantener la primera opción si existe
            const primeraOpcion = select.children[0];
            select.innerHTML = '';
            
            if (primeraOpcion) {
                select.appendChild(primeraOpcion);
            }
            
            // Agregar roles desde el backend
            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id_rol;
                option.textContent = rol.nombre;
                select.appendChild(option);
            });
        }
    });
}

async function crearUsuario(datosUsuario) {
    try {
        // Mapear campos del frontend al backend
        const usuarioBackend = {
            nombres: datosUsuario.nombres,
            apellidos: datosUsuario.apellidos,
            dni: datosUsuario.dni,
            fechaNacimiento: datosUsuario.fechaNacimiento,
            genero: datosUsuario.genero ? datosUsuario.genero.charAt(0).toUpperCase() + datosUsuario.genero.slice(1) : null,
            estadoCivil: datosUsuario.estadoCivil,
            telefono: datosUsuario.telefono,
            email: datosUsuario.email,
            username: datosUsuario.usuario,
            passwordHash: datosUsuario.contrasena,
            fechaIngreso: datosUsuario.fechaIngreso,
            rol: datosUsuario.rol ? { id_rol: parseInt(datosUsuario.rol) } : null,
            activo: true
        };

        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioBackend)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        const nuevoUsuario = await response.json();
        mostrarMensaje('Usuario creado exitosamente', 'success');
        await cargarUsuarios(); // Recargar la lista
        return nuevoUsuario;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        mostrarMensaje(error.message || 'Error al crear el usuario', 'error');
        throw error;
    }
}

async function actualizarUsuario(id, datosUsuario) {
    try {
        // Mapear campos del frontend al backend
        const usuarioBackend = {
            nombres: datosUsuario.nombres,
            apellidos: datosUsuario.apellidos,
            dni: datosUsuario.dni,
            fechaNacimiento: datosUsuario.fechaNacimiento,
            genero: datosUsuario.genero ? datosUsuario.genero.charAt(0).toUpperCase() + datosUsuario.genero.slice(1) : null,
            estadoCivil: datosUsuario.estadoCivil,
            telefono: datosUsuario.telefono,
            email: datosUsuario.email,
            username: datosUsuario.usuario,
            fechaIngreso: datosUsuario.fechaIngreso,
            rol: datosUsuario.rol ? { id_rol: parseInt(datosUsuario.rol) } : null,
            activo: datosUsuario.estado === 'Activo'
        };

        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioBackend)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        const usuarioActualizado = await response.json();
        mostrarMensaje('Usuario actualizado exitosamente', 'success');
        await cargarUsuarios(); // Recargar la lista
        return usuarioActualizado;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        mostrarMensaje(error.message || 'Error al actualizar el usuario', 'error');
        throw error;
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        mostrarMensaje('Usuario eliminado exitosamente', 'success');
        await cargarUsuarios(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        mostrarMensaje(error.message || 'Error al eliminar el usuario', 'error');
    }
}

async function cambiarEstadoUsuario(id) {
    try {
        const response = await fetch(`/api/usuarios/${id}/estado`, {
            method: 'PATCH'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        mostrarMensaje('Estado del usuario actualizado', 'success');
        await cargarUsuarios(); // Recargar la lista
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        mostrarMensaje(error.message || 'Error al cambiar el estado del usuario', 'error');
    }
}

// =============================================== 
// FUNCIONES DE FILTRADO Y VISUALIZACIÓN
// =============================================== 

function filtrarUsuarios() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const rolFilter = document.getElementById('id-roles').value;
    const estadoFilter = document.getElementById('id-estado').value;
    
    usuariosFiltrados = usuarios.filter(usuario => {
        // Filtro de búsqueda (nombre, apellido, usuario, email o DNI)
        const matchesSearch = searchTerm === '' || 
            (usuario.nombres && usuario.nombres.toLowerCase().includes(searchTerm)) ||
            (usuario.apellidos && usuario.apellidos.toLowerCase().includes(searchTerm)) ||
            (usuario.username && usuario.username.toLowerCase().includes(searchTerm)) ||
            (usuario.email && usuario.email.toLowerCase().includes(searchTerm)) ||
            (usuario.dni && usuario.dni.includes(searchTerm));
        
        // Filtro de rol
        const usuarioRolId = usuario.rol ? usuario.rol.id_rol.toString() : '';
        const matchesRol = rolFilter === '' || usuarioRolId === rolFilter;
        
        // Filtro de estado
        const usuarioEstado = usuario.activo ? 'activo' : 'inactivo';
        const matchesEstado = estadoFilter === '' || usuarioEstado === estadoFilter.toLowerCase();
        
        return matchesSearch && matchesRol && matchesEstado;
    });
    
    mostrarUsuarios();
}

function mostrarUsuarios() {
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    if (!tablaUsuarios) return;
    
    tablaUsuarios.innerHTML = '';
    
    if (usuariosFiltrados.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td colspan="8" style="text-align: center; color: var(--neutral-600); padding: 40px;">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                No se encontraron usuarios que coincidan con los criterios de búsqueda.
            </td>
        `;
        tablaUsuarios.appendChild(fila);
        return;
    }
    
    usuariosFiltrados.forEach((usuario, index) => {
        const fila = document.createElement('tr');
        
        // Determinar el nombre del rol para mostrar
        const rolMostrar = usuario.rol ? usuario.rol.nombre : 'Sin rol';
        const estadoMostrar = usuario.activo ? 'Activo' : 'Inactivo';
        
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${(usuario.nombres || '') + ' ' + (usuario.apellidos || '')}</td>
            <td>${usuario.username || ''}</td>
            <td>${usuario.email || ''}</td>
            <td><span class="badge badge-${rolMostrar.toLowerCase()}">${rolMostrar}</span></td>
            <td><span class="status status-${estadoMostrar.toLowerCase()}">${estadoMostrar}</span></td>
            <td>Nunca</td>
            <td class="acciones">
                <button class="btn-toggle-estado" onclick="cambiarEstadoUsuario(${usuario.id_usuario})" title="Cambiar Estado">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-editar" onclick="editarUsuario(${usuario.id_usuario})" title="Editar">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id_usuario})" title="Eliminar">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </td>
        `;
        
        tablaUsuarios.appendChild(fila);
    });
}

// =============================================== 
// FUNCIONES DE GESTIÓN DE USUARIOS
// =============================================== 

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id_usuario == id);
    if (!usuario) {
        mostrarMensaje('Usuario no encontrado', 'error');
        return;
    }
    
    // Cargar datos del usuario en el modal de edición
    cargarDatosUsuarioEnModal(usuario);
    
    // Mostrar modal de edición
    const modalEditarUsuario = document.getElementById('modalEditarUsuario');
    modalEditarUsuario.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Guardar el ID del usuario que se está editando
    editandoUsuarioId = id;
}

function cargarDatosUsuarioEnModal(usuario) {
    const campos = {
        'editNombres': usuario.nombres,
        'editApellidos': usuario.apellidos,
        'editDni': usuario.dni,
        'editFechaNacimiento': usuario.fechaNacimiento,
        'editGenero': usuario.genero ? usuario.genero.toLowerCase() : '',
        'editEstadoCivil': usuario.estadoCivil,
        'editTelefono': usuario.telefono,
        'editEmail': usuario.email,
        'editUsuario': usuario.username,
        'editFechaIngreso': usuario.fechaIngreso,
        'editRol': usuario.rol ? usuario.rol.id_rol : '',
        'editEstado': usuario.activo ? 'Activo' : 'Inactivo'
    };
    
    Object.entries(campos).forEach(([campoId, valor]) => {
        const elemento = document.getElementById(campoId);
        if (elemento) {
            elemento.value = valor || '';
        }
    });
}

// =============================================== 
// FUNCIONES GLOBALES PARA USO EN EL HTML
// =============================================== 

// Funciones globales que pueden ser llamadas desde onclick en el HTML
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del modal agregar
    const btnAgregarUsuario = document.querySelector('.btn-agregar-usuario');
    const modalAgregarUsuario = document.getElementById('modalAgregarUsuario');
    const closeModalUsuario = document.getElementById('closeModalUsuario');
    const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');
    const btnAgregarUsuarioConfirm = document.getElementById('btnAgregarUsuario');
    
    // Elementos del modal editar
    const modalEditarUsuario = document.getElementById('modalEditarUsuario');
    const closeModalEditarUsuario = document.getElementById('closeModalEditarUsuario');
    const btnCancelarEditar = document.getElementById('btnCancelarEditar');
    const btnActualizarUsuario = document.getElementById('btnActualizarUsuario');
    
    // Elementos de upload de imágenes (agregar)
    const perfilUpload = document.getElementById('perfilUpload');
    const imagenUpload = document.getElementById('imagenUpload');
    const perfilImage = document.getElementById('perfilImage');
    const userImage = document.getElementById('userImage');
    
    // Elementos de upload de imágenes (editar)
    const editPerfilUpload = document.getElementById('editPerfilUpload');
    const editImagenUpload = document.getElementById('editImagenUpload');
    const editPerfilImage = document.getElementById('editPerfilImage');
    const editUserImage = document.getElementById('editUserImage');

    // Abrir modal
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener('click', function() {
            modalAgregarUsuario.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        });
    }

    // Cerrar modal agregar
    function cerrarModal() {
        modalAgregarUsuario.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        limpiarFormulario();
    }
    
    // Cerrar modal editar
    function cerrarModalEditar() {
        modalEditarUsuario.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        limpiarFormularioEditar();
        window.usuarioEditandoId = null;
    }
    
    // Función para actualizar usuario
    function actualizarUsuario() {
        const id = window.usuarioEditandoId;
        if (!id) {
            alert('No se ha seleccionado ningún usuario para editar');
            return;
        }
        
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) {
            alert('Usuario no encontrado');
            return;
        }
        
        // Recolectar datos del formulario de edición
        const datosActualizados = {
            nombres: document.getElementById('editNombres').value,
            apellidos: document.getElementById('editApellidos').value,
            dni: document.getElementById('editDni').value,
            fechaNacimiento: document.getElementById('editFechaNacimiento').value,
            genero: document.getElementById('editGenero').value,
            estadoCivil: document.getElementById('editEstadoCivil').value,
            telefono: document.getElementById('editTelefono').value,
            email: document.getElementById('editEmail').value,
            usuario: document.getElementById('editUsuario').value,
            fechaIngreso: document.getElementById('editFechaIngreso').value,
            rol: document.getElementById('editRol').value,
            estado: document.getElementById('editEstado').value
        };
        
        // Validación básica
        if (!datosActualizados.nombres || !datosActualizados.apellidos || !datosActualizados.dni || !datosActualizados.usuario || !datosActualizados.email) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Validar si el usuario, DNI o email ya existen en otros usuarios
        const usuarioExistente = usuarios.find(u => u.id !== id && (u.usuario === datosActualizados.usuario || u.dni === datosActualizados.dni || u.email === datosActualizados.email));
        if (usuarioExistente) {
            alert('Ya existe otro usuario con ese nombre de usuario, DNI o email.');
            return;
        }
        
        // Actualizar los datos del usuario
        Object.assign(usuario, datosActualizados);
        
        // Cerrar modal y actualizar tabla
        cerrarModalEditar();
        filtrarUsuarios();
        alert('Usuario actualizado exitosamente');
    }

    if (closeModalUsuario) {
        closeModalUsuario.addEventListener('click', cerrarModal);
    }

    if (btnCancelarUsuario) {
        btnCancelarUsuario.addEventListener('click', cerrarModal);
    }
    
    // Cerrar modal editar
    if (closeModalEditarUsuario) {
        closeModalEditarUsuario.addEventListener('click', cerrarModalEditar);
    }

    if (btnCancelarEditar) {
        btnCancelarEditar.addEventListener('click', cerrarModalEditar);
    }

    // Cerrar modal al hacer clic fuera del contenido
    modalAgregarUsuario.addEventListener('click', function(e) {
        if (e.target === modalAgregarUsuario) {
            cerrarModal();
        }
    });
    
    // Cerrar modal editar al hacer clic fuera del contenido
    modalEditarUsuario.addEventListener('click', function(e) {
        if (e.target === modalEditarUsuario) {
            cerrarModalEditar();
        }
    });

    // Funcionalidad de upload de imágenes
    if (perfilUpload && perfilImage) {
        perfilUpload.addEventListener('click', function() {
            perfilImage.click();
        });

        perfilImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    perfilUpload.innerHTML = `
                        <img src="${e.target.result}" alt="Perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (imagenUpload && userImage) {
        imagenUpload.addEventListener('click', function() {
            userImage.click();
        });

        userImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagenUpload.innerHTML = `
                        <img src="${e.target.result}" alt="Usuario" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Funcionalidad de upload de imágenes para modal editar
    if (editPerfilUpload && editPerfilImage) {
        editPerfilUpload.addEventListener('click', function() {
            editPerfilImage.click();
        });

        editPerfilImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    editPerfilUpload.innerHTML = `
                        <img src="${e.target.result}" alt="Perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (editImagenUpload && editUserImage) {
        editImagenUpload.addEventListener('click', function() {
            editUserImage.click();
        });

        userImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    editImagenUpload.innerHTML = `
                        <img src="${e.target.result}" alt="Usuario" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Limpiar formulario de edición
    function limpiarFormularioEditar() {
        const inputs = modalEditarUsuario.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]');
        const selects = modalEditarUsuario.querySelectorAll('select');
        
        inputs.forEach(input => {
            input.value = '';
        });
        
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Resetear upload boxes de edición
        if (editPerfilUpload) {
            editPerfilUpload.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>Perfil</span>
            `;
        }
        
        if (editImagenUpload) {
            editImagenUpload.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Subir Imagen</span>
            `;
        }
    }

    // Limpiar formulario
    function limpiarFormulario() {
        const form = modalAgregarUsuario.querySelector('.modal-body');
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="date"]');
        const selects = form.querySelectorAll('select');
        
        inputs.forEach(input => {
            input.value = '';
        });
        
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Resetear upload boxes
        if (perfilUpload) {
            perfilUpload.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>Perfil</span>
            `;
        }
        
        if (imagenUpload) {
            imagenUpload.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Subir Imagen</span>
            `;
        }
    }

    // Validación del DNI (solo números, máximo 8 dígitos)
    const dniInput = document.getElementById('dni');
    if (dniInput) {
        dniInput.addEventListener('input', function(e) {
            // Remover cualquier carácter que no sea número
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limitar a 8 dígitos
            if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
            }
        });
    }

    // Validación de contraseñas coincidentes
    const contrasenaInput = document.getElementById('contrasena');
    const repetirContrasenaInput = document.getElementById('repetirContrasena');
    
    if (contrasenaInput && repetirContrasenaInput) {
        function validarContrasenas() {
            if (repetirContrasenaInput.value && contrasenaInput.value !== repetirContrasenaInput.value) {
                repetirContrasenaInput.style.borderColor = 'var(--rojo)';
                repetirContrasenaInput.setCustomValidity('Las contraseñas no coinciden');
            } else {
                repetirContrasenaInput.style.borderColor = 'var(--neutral-100)';
                repetirContrasenaInput.setCustomValidity('');
            }
        }

        contrasenaInput.addEventListener('input', validarContrasenas);
        repetirContrasenaInput.addEventListener('input', validarContrasenas);
    }

    // Envío del formulario
    if (btnAgregarUsuarioConfirm) {
        btnAgregarUsuarioConfirm.addEventListener('click', function() {
            console.log('Agregando nuevo usuario...');
            
            // Recolección de datos del formulario
            const datosUsuario = {
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                dni: document.getElementById('dni').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                genero: document.getElementById('genero').value,
                estadoCivil: document.getElementById('estadoCivil').value,
                usuario: document.getElementById('usuario').value,
                contrasena: document.getElementById('contrasena').value,
                fechaIngreso: document.getElementById('fechaIngreso').value,
                rol: document.getElementById('rol').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value
            };

            // Validación básica
            if (!datosUsuario.nombres || !datosUsuario.apellidos || !datosUsuario.dni || !datosUsuario.usuario || !datosUsuario.contrasena || !datosUsuario.email) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            // Validar si el usuario ya existe
            if (usuarios.some(u => u.usuario === datosUsuario.usuario || u.dni === datosUsuario.dni || u.email === datosUsuario.email)) {
                alert('Ya existe un usuario con ese nombre de usuario, DNI o email.');
                return;
            }

            console.log('Datos del usuario:', datosUsuario);
            
            // Agregar el usuario al array
            agregarUsuario(datosUsuario);
            
            // Cerrar modal y mostrar mensaje de éxito
            cerrarModal();
            alert('Usuario agregado exitosamente');
        });
    }

    // =============================================== 
    // FUNCIONALIDAD DE BÚSQUEDA Y FILTROS
    // =============================================== 
    
    // Event listeners para búsqueda y filtros
    const searchInput = document.getElementById('search-input');
    const btnBuscar = document.querySelector('.btn-buscar');
    const rolesSelect = document.getElementById('id-roles');
    const estadoSelect = document.getElementById('id-estado');
    
    // Búsqueda en tiempo real mientras se escribe
    if (searchInput) {
        searchInput.addEventListener('input', filtrarUsuarios);
        
        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filtrarUsuarios();
            }
        });
    }
    
    // Botón de búsqueda
    if (btnBuscar) {
        btnBuscar.addEventListener('click', filtrarUsuarios);
    }
    
    // Filtros por rol y estado
    if (rolesSelect) {
        rolesSelect.addEventListener('change', filtrarUsuarios);
    }
    
    if (estadoSelect) {
        estadoSelect.addEventListener('change', filtrarUsuarios);
    }
    
    // Cargar usuarios al iniciar la página
    filtrarUsuarios(); // Usar filtrarUsuarios en lugar de mostrarUsuarios

    // Validación del DNI para modal editar (solo números, máximo 8 dígitos)
    const editDniInput = document.getElementById('editDni');
    if (editDniInput) {
        editDniInput.addEventListener('input', function(e) {
            // Remover cualquier carácter que no sea número
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limitar a 8 dígitos
            if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
            }
        });
    }

    // Envío del formulario de actualización
    if (btnActualizarUsuario) {
        btnActualizarUsuario.addEventListener('click', function() {
            console.log('Botón actualizar clickeado');
            console.log('ID del usuario editando:', window.usuarioEditandoId);
            actualizarUsuario();
        });
    } else {
        console.error('No se encontró el botón btnActualizarUsuario');
    }
});