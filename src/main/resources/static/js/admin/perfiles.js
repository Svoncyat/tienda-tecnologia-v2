// =============================================== 
// FUNCIONALIDAD MODAL AGREGAR USUARIO
// =============================================== 

// Array para almacenar usuarios
let usuarios = [
    {
        id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'Pérez González',
        dni: '12345678',
        usuario: 'jperez',
        email: 'juan.perez@uwutech.com',
        rol: 'administrador',
        estado: 'Activo',
        fechaIngreso: '2023-01-15',
        ultimoAcceso: '2025-06-27 08:30'
    },
    {
        id: 2,
        nombres: 'María Elena',
        apellidos: 'García Ruiz',
        dni: '87654321',
        usuario: 'mgarcia',
        email: 'maria.garcia@uwutech.com',
        rol: 'vendedor',
        estado: 'Activo',
        fechaIngreso: '2023-03-20',
        ultimoAcceso: '2025-06-26 15:45'
    },
    {
        id: 3,
        nombres: 'Luis Alberto',
        apellidos: 'Rodríguez Silva',
        dni: '11223344',
        usuario: 'lrodriguez',
        email: 'luis.rodriguez@uwutech.com',
        rol: 'almacenero',
        estado: 'Inactivo',
        fechaIngreso: '2022-11-10',
        ultimoAcceso: '2025-06-20 10:15'
    }
];

// Variable para usuarios filtrados
let usuariosFiltrados = [...usuarios];

// Función para filtrar usuarios
function filtrarUsuarios() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const rolFilter = document.getElementById('id-roles').value;
    const estadoFilter = document.getElementById('id-estado').value;
    
    usuariosFiltrados = usuarios.filter(usuario => {
        // Filtro de búsqueda (nombre, apellido, usuario, email o DNI)
        const matchesSearch = searchTerm === '' || 
            usuario.nombres.toLowerCase().includes(searchTerm) ||
            usuario.apellidos.toLowerCase().includes(searchTerm) ||
            usuario.usuario.toLowerCase().includes(searchTerm) ||
            usuario.email.toLowerCase().includes(searchTerm) ||
            usuario.dni.includes(searchTerm);
        
        // Filtro de rol
        const matchesRol = rolFilter === '' || usuario.rol === rolFilter;
        
        // Filtro de estado
        const matchesEstado = estadoFilter === '' || usuario.estado.toLowerCase() === estadoFilter.toLowerCase();
        
        return matchesSearch && matchesRol && matchesEstado;
    });
    
    mostrarUsuarios();
}

// Función para mostrar usuarios en la tabla
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
        
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${usuario.nombres} ${usuario.apellidos}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.rol}">${usuario.rol}</span></td>
            <td><span class="status status-${usuario.estado.toLowerCase()}">${usuario.estado}</span></td>
            <td>${usuario.ultimoAcceso}</td>
            <td class="acciones">
                <button class="btn-toggle-estado" onclick="toggleEstadoUsuario(${usuario.id})" title="Cambiar Estado">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-editar" onclick="editarUsuario(${usuario.id})" title="Editar">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id})" title="Eliminar">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                
            </td>
        `;
        
        tablaUsuarios.appendChild(fila);
    });
}

// Función para agregar nuevo usuario
function agregarUsuario(datosUsuario) {
    const nuevoId = Math.max(...usuarios.map(u => u.id), 0) + 1;
    const fechaActual = new Date().toISOString().slice(0, 16).replace('T', ' ');
    
    const nuevoUsuario = {
        id: nuevoId,
        ...datosUsuario,
        estado: 'Activo',
        ultimoAcceso: 'Nunca'
    };
    
    usuarios.push(nuevoUsuario);
    filtrarUsuarios(); // Actualizar con filtros aplicados
}

// Función para eliminar usuario
function eliminarUsuario(id) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        usuarios = usuarios.filter(usuario => usuario.id !== id);
        filtrarUsuarios(); // Actualizar con filtros aplicados
    }
}

// Función para cambiar estado del usuario
function toggleEstadoUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
        filtrarUsuarios(); // Actualizar con filtros aplicados
    }
}

// Función para editar usuario
function editarUsuario(id) {
    console.log('Editando usuario con ID:', id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        alert('Usuario no encontrado');
        return;
    }
    
    // Cargar datos del usuario en el modal de edición
    cargarDatosUsuarioEnModal(usuario);
    
    // Mostrar modal de edición
    const modalEditarUsuario = document.getElementById('modalEditarUsuario');
    modalEditarUsuario.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Guardar el ID del usuario que se está editando
    window.usuarioEditandoId = id;
    console.log('ID guardado en window.usuarioEditandoId:', window.usuarioEditandoId);
}

// Función para cargar datos del usuario en el modal de edición
function cargarDatosUsuarioEnModal(usuario) {
    document.getElementById('editNombres').value = usuario.nombres || '';
    document.getElementById('editApellidos').value = usuario.apellidos || '';
    document.getElementById('editDni').value = usuario.dni || '';
    document.getElementById('editFechaNacimiento').value = usuario.fechaNacimiento || '';
    document.getElementById('editGenero').value = usuario.genero || '';
    document.getElementById('editEstadoCivil').value = usuario.estadoCivil || '';
    document.getElementById('editTelefono').value = usuario.telefono || '';
    document.getElementById('editEmail').value = usuario.email || '';
    document.getElementById('editUsuario').value = usuario.usuario || '';
    document.getElementById('editFechaIngreso').value = usuario.fechaIngreso || '';
    document.getElementById('editRol').value = usuario.rol || '';
    document.getElementById('editEstado').value = usuario.estado || '';
}

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

        editUserImage.addEventListener('change', function(e) {
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