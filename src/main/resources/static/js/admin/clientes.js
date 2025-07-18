// ====== API Y DATOS ======
const API_BASE_URL = '/api/clientes';

let clientesData = [];
let clientesFiltrados = [];

// ====== UTILIDADES ======
const Utils = {
    formatearFecha: (fecha) => {
        if (!fecha) return 'N/A';
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    mostrarNotificacion: (mensaje, tipo = 'success') => {
        // Crear notificación temporal
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background-color: ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#ffc107'};
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    },
    
    mostrarError: (mensaje) => {
        Utils.mostrarNotificacion(mensaje, 'error');
    }
};

// ====== API CALLS ======
const ClienteAPI = {
    async obtenerTodos() {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Error al obtener clientes');
            }
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            Utils.mostrarError('Error al cargar los clientes');
            return [];
        }
    },
    
    async crear(clienteData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                Utils.mostrarNotificacion('Cliente creado exitosamente');
                return data.data;
            } else {
                throw new Error(data.message || 'Error al crear cliente');
            }
        } catch (error) {
            console.error('Error al crear cliente:', error);
            Utils.mostrarError(error.message);
            throw error;
        }
    },
    
    async actualizar(id, clienteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                Utils.mostrarNotificacion('Cliente actualizado exitosamente');
                return data.data;
            } else {
                throw new Error(data.message || 'Error al actualizar cliente');
            }
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            Utils.mostrarError(error.message);
            throw error;
        }
    },
    
    async eliminar(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                Utils.mostrarNotificacion('Cliente eliminado exitosamente');
                return true;
            } else {
                throw new Error(data.message || 'Error al eliminar cliente');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            Utils.mostrarError(error.message);
            throw error;
        }
    }
};

// ====== RENDERIZADO Y BÚSQUEDA ======
function crearAcciones(cliente) {
    return `
        <div class="acciones">
            <button class="btn-accion btn-ver" onclick="verCliente(${cliente.id_cliente})" title="Ver detalles">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-accion btn-editar" onclick="editarCliente(${cliente.id_cliente})" title="Editar">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${cliente.id_cliente})" title="Eliminar">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `;
}

function getNombreCompleto(cliente) {
    if (cliente.nombres && cliente.apellidos) {
        return `${cliente.nombres} ${cliente.apellidos}`;
    } else if (cliente.razon_social) {
        return cliente.razon_social;
    }
    return 'Sin nombre';
}

function getUsuario(cliente) {
    if (cliente.correo) {
        return cliente.correo.split('@')[0];
    }
    return 'sin_usuario';
}

function renderizarTabla(datos = clientesFiltrados) {
    const tbody = document.getElementById('clientesTableBody');
    if (!tbody) return;
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No se encontraron clientes</td></tr>';
        return;
    }

    tbody.innerHTML = datos.map((cliente, index) => `
        <tr class="cliente-row-nueva">
            <td>${index + 1}</td>
            <td>${getNombreCompleto(cliente)}</td>
            <td>${getUsuario(cliente)}</td>
            <td>${cliente.correo || 'N/A'}</td>
            <td><span class="estado-badge estado-${cliente.activo ? 'activo' : 'inactivo'}">${cliente.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>${Utils.formatearFecha(cliente.ultimo_acceso || cliente.fecha_registro)}</td>
            <td>${crearAcciones(cliente)}</td>
        </tr>
    `).join('');
}

function buscarClientes() {
    const termino = document.getElementById('search-input').value.toLowerCase().trim();
    clientesFiltrados = termino === '' ? [...clientesData] : 
        clientesData.filter(cliente => {
            const nombreCompleto = getNombreCompleto(cliente).toLowerCase();
            const usuario = getUsuario(cliente).toLowerCase();
            const email = (cliente.correo || '').toLowerCase();
            const documento = (cliente.numero_documento || '').toLowerCase();
            
            return nombreCompleto.includes(termino) ||
                   usuario.includes(termino) ||
                   email.includes(termino) ||
                   documento.includes(termino);
        });
    renderizarTabla();
}

// ====== MODALES ======
const Modal = {
    abrir: (modalId) => {
        console.log('Intentando abrir modal:', modalId); // Debug
        const modal = document.getElementById(modalId);
        if (modal) {
            console.log('Modal encontrado, abriendo...'); // Debug
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Asegurar que el modal esté visible
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        } else {
            console.error('Modal no encontrado:', modalId);
        }
    },
    
    cerrar: (modalId) => {
        console.log('Cerrando modal:', modalId); // Debug
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.opacity = '0';
            document.body.style.overflow = 'auto';
            
            // Ocultar después de la transición
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    },
    
    limpiarFormulario: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const form = modal.querySelector('form') || modal;
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    }
};

// ====== GESTIÓN DE CLIENTES ======
async function cargarClientes() {
    try {
        const tbody = document.getElementById('clientesTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Cargando clientes...</td></tr>';
        }
        
        clientesData = await ClienteAPI.obtenerTodos();
        clientesFiltrados = [...clientesData];
        renderizarTabla();
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        const tbody = document.getElementById('clientesTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Error al cargar clientes</td></tr>';
        }
    }
}

async function agregarCliente() {
    try {
        // Obtener datos del formulario
        const tipoCliente = document.getElementById('tipoCliente').value;
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const numeroDocumento = document.getElementById('numeroDocumento').value;
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const razonSocial = document.getElementById('razonSocial').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        
        // Validaciones básicas
        if (!tipoCliente || !tipoDocumento || !numeroDocumento) {
            Utils.mostrarError('Los campos Tipo de Cliente, Tipo de Documento y Número de Documento son obligatorios');
            return;
        }
        
        if (tipoCliente === 'PERSONA_NATURAL' && (!nombres || !apellidos)) {
            Utils.mostrarError('Para Persona Natural, los campos Nombres y Apellidos son obligatorios');
            return;
        }
        
        if (tipoCliente === 'EMPRESA' && !razonSocial) {
            Utils.mostrarError('Para Empresa, el campo Razón Social es obligatorio');
            return;
        }
        
        // Preparar datos para enviar
        const clienteData = {
            tipo_cliente: tipoCliente,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            nombres: nombres || null,
            apellidos: apellidos || null,
            razon_social: razonSocial || null,
            correo: email || null,
            telefono: telefono || null,
            fecha_nacimiento: fechaNacimiento || null
        };
        
        // Enviar a la API
        await ClienteAPI.crear(clienteData);
        
        // Cerrar modal y recargar datos
        Modal.cerrar('modalAgregarUsuario');
        Modal.limpiarFormulario('modalAgregarUsuario');
        await cargarClientes();
        
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        // El error ya se mostró en ClienteAPI.crear
    }
}

async function editarCliente(id) {
    try {
        // Encontrar el cliente en los datos locales
        const cliente = clientesData.find(c => c.id_cliente === id);
        if (!cliente) {
            Utils.mostrarError('Cliente no encontrado');
            return;
        }
        
        // Llenar el formulario de edición con los IDs correctos del modal editar
        document.getElementById('editTipoCliente').value = cliente.tipo_cliente;
        document.getElementById('editTipoDocumento').value = cliente.tipo_documento;
        document.getElementById('editNumeroDocumento').value = cliente.numero_documento;
        document.getElementById('editNombres').value = cliente.nombres || '';
        document.getElementById('editApellidos').value = cliente.apellidos || '';
        document.getElementById('editRazonSocial').value = cliente.razon_social || '';
        document.getElementById('editEmail').value = cliente.correo || '';
        document.getElementById('editTelefono').value = cliente.telefono || '';
        document.getElementById('editFechaNacimiento').value = cliente.fecha_nacimiento || '';
        
        // Cambiar el comportamiento del botón del modal editar
        const btnGuardar = document.getElementById('btnGuardarEditarUsuario');
        btnGuardar.onclick = () => actualizarCliente(id);
        
        // Abrir el modal de edición
        Modal.abrir('modalEditarUsuario');
        
    } catch (error) {
        console.error('Error al editar cliente:', error);
        Utils.mostrarError('Error al cargar datos del cliente');
    }
}

async function actualizarCliente(id) {
    try {
        // Obtener datos del formulario del modal de edición
        const tipoCliente = document.getElementById('editTipoCliente').value;
        const tipoDocumento = document.getElementById('editTipoDocumento').value;
        const numeroDocumento = document.getElementById('editNumeroDocumento').value;
        const nombres = document.getElementById('editNombres').value;
        const apellidos = document.getElementById('editApellidos').value;
        const razonSocial = document.getElementById('editRazonSocial').value;
        const email = document.getElementById('editEmail').value;
        const telefono = document.getElementById('editTelefono').value;
        const fechaNacimiento = document.getElementById('editFechaNacimiento').value;
        
        // Validaciones
        if (!tipoCliente || !tipoDocumento || !numeroDocumento) {
            Utils.mostrarError('Los campos Tipo de Cliente, Tipo de Documento y Número de Documento son obligatorios');
            return;
        }
        
        if (tipoCliente === 'PERSONA_NATURAL' && (!nombres || !apellidos)) {
            Utils.mostrarError('Para Persona Natural, los campos Nombres y Apellidos son obligatorios');
            return;
        }
        
        if (tipoCliente === 'EMPRESA' && !razonSocial) {
            Utils.mostrarError('Para Empresa, el campo Razón Social es obligatorio');
            return;
        }
        
        // Preparar datos
        const clienteData = {
            tipo_cliente: tipoCliente,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            nombres: nombres || null,
            apellidos: apellidos || null,
            razon_social: razonSocial || null,
            correo: email || null,
            telefono: telefono || null,
            fecha_nacimiento: fechaNacimiento || null
        };
        
        // Actualizar via API
        await ClienteAPI.actualizar(id, clienteData);
        
        // Cerrar modal de edición y recargar datos
        Modal.cerrar('modalEditarUsuario');
        Modal.limpiarFormulario('modalEditarUsuario');
        await cargarClientes();
        
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
    }
}

async function eliminarCliente(id) {
    try {
        if (!confirm('¿Está seguro de que desea eliminar este cliente?')) {
            return;
        }
        
        await ClienteAPI.eliminar(id);
        await cargarClientes();
        
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
    }
}

function verCliente(id) {
    const cliente = clientesData.find(c => c.id_cliente === id);
    if (!cliente) {
        Utils.mostrarError('Cliente no encontrado');
        return;
    }
    
    // Por ahora, mostrar en un alert simple
    const info = `
        ID: ${cliente.id_cliente}
        Tipo: ${cliente.tipo_cliente}
        Documento: ${cliente.tipo_documento} - ${cliente.numero_documento}
        Nombre: ${getNombreCompleto(cliente)}
        Email: ${cliente.correo || 'N/A'}
        Teléfono: ${cliente.telefono || 'N/A'}
        Estado: ${cliente.activo ? 'Activo' : 'Inactivo'}
    `;
    
    alert(info);
}

// ====== EVENTOS ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando eventos...'); // Debug
    
    // Verificar elementos críticos
    const verificarElementos = () => {
        const btnAgregar = document.querySelector('.btn-agregar-usuario');
        const modal = document.getElementById('modalAgregarUsuario');
        const btnCerrar = document.getElementById('closeModalUsuario');
        const modalEditar = document.getElementById('modalEditarUsuario');
        const btnCerrarEditar = document.getElementById('closeModalEditarUsuario');
        
        console.log('Verificación de elementos:');
        console.log('- Botón agregar:', btnAgregar ? '✓' : '✗');
        console.log('- Modal agregar:', modal ? '✓' : '✗');
        console.log('- Botón cerrar agregar:', btnCerrar ? '✓' : '✗');
        console.log('- Modal editar:', modalEditar ? '✓' : '✗');
        console.log('- Botón cerrar editar:', btnCerrarEditar ? '✓' : '✗');
        
        return btnAgregar && modal && btnCerrar && modalEditar && btnCerrarEditar;
    };
    
    if (!verificarElementos()) {
        console.warn('Algunos elementos críticos no fueron encontrados');
    }
    
    // Cargar clientes al inicio
    cargarClientes();
    
    // Configurar eventos de búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', buscarClientes);
    }
    
    const btnBuscar = document.querySelector('.btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarClientes);
    }
    
    // Modal agregar cliente - Con manejo robusto
    const configurarModalAgregar = () => {
        const btnAgregarUsuario = document.querySelector('.btn-agregar-usuario');
        if (btnAgregarUsuario) {
            // Remover listeners previos si existen
            btnAgregarUsuario.removeEventListener('click', abrirModalAgregar);
            
            // Agregar nuevo listener
            btnAgregarUsuario.addEventListener('click', abrirModalAgregar);
            console.log('Event listener del modal configurado correctamente');
        } else {
            console.error('No se encontró el botón .btn-agregar-usuario');
            // Intentar de nuevo después de un breve delay
            setTimeout(configurarModalAgregar, 1000);
        }
    };
    
    // Función para abrir el modal
    const abrirModalAgregar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Botón Agregar Cliente clickeado'); // Debug
        
        try {
            Modal.limpiarFormulario('modalAgregarUsuario');
            Modal.abrir('modalAgregarUsuario');
            
            // Asegurar que el botón esté configurado para agregar
            const btnSubmit = document.getElementById('btnAgregarUsuario');
            if (btnSubmit) {
                btnSubmit.textContent = 'Agregar';
                btnSubmit.onclick = agregarCliente;
            }
        } catch (error) {
            console.error('Error al abrir modal:', error);
        }
    };
    
    // Configurar el modal
    configurarModalAgregar();
    
    // Event listeners para modal de edición
    const btnCerrarModalEditar = document.getElementById('closeModalEditarUsuario');
    if (btnCerrarModalEditar) {
        btnCerrarModalEditar.addEventListener('click', () => {
            Modal.cerrar('modalEditarUsuario');
        });
    }
    
    const btnCancelarEditar = document.getElementById('btnCancelarEditarUsuario');
    if (btnCancelarEditar) {
        btnCancelarEditar.addEventListener('click', () => {
            Modal.cerrar('modalEditarUsuario');
        });
    }
    
    // Cerrar modal de edición al hacer clic fuera
    const modalEditarOverlay = document.getElementById('modalEditarUsuario');
    if (modalEditarOverlay) {
        modalEditarOverlay.addEventListener('click', (e) => {
            if (e.target === modalEditarOverlay) {
                Modal.cerrar('modalEditarUsuario');
            }
        });
    }
    
    // Botones de cerrar modal agregar
    const btnCerrarModal = document.getElementById('closeModalUsuario');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            Modal.cerrar('modalAgregarUsuario');
        });
    }
    
    const btnCancelar = document.getElementById('btnCancelarUsuario');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            Modal.cerrar('modalAgregarUsuario');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    const modalOverlay = document.getElementById('modalAgregarUsuario');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                Modal.cerrar('modalAgregarUsuario');
            }
        });
    }
    
    // Botón agregar en el modal
    const btnAgregarModalUsuario = document.getElementById('btnAgregarUsuario');
    if (btnAgregarModalUsuario) {
        btnAgregarModalUsuario.addEventListener('click', agregarCliente);
    }
    
    // Prueba inicial del modal después de cargar todo
    setTimeout(() => {
        console.log('Realizando prueba inicial del modal...');
        const modal = document.getElementById('modalAgregarUsuario');
        const btn = document.querySelector('.btn-agregar-usuario');
        
        if (modal && btn) {
            console.log('✓ Modal y botón están presentes y listos');
            console.log('Para probar el modal manualmente, ejecuta: probarModal()');
        } else {
            console.error('✗ Faltan elementos críticos para el modal');
        }
    }, 2000);
});

// Hacer funciones globales para uso en HTML
window.verCliente = verCliente;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;

// ====== FUNCIÓN DE PRUEBA PARA EL MODAL ======
window.probarModal = function() {
    console.log('Probando modal...');
    const modal = document.getElementById('modalAgregarUsuario');
    const btn = document.querySelector('.btn-agregar-usuario');
    
    console.log('Modal encontrado:', modal);
    console.log('Botón encontrado:', btn);
    
    if (modal && btn) {
        console.log('Simulando click en el botón...');
        btn.click();
    } else {
        console.error('No se encontraron los elementos necesarios');
    }
};
