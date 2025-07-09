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
            console.log('=== Enviando datos a API ===');
            console.log('URL:', API_BASE_URL);
            console.log('Datos:', JSON.stringify(clienteData, null, 2));
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                Utils.mostrarNotificacion('Cliente creado exitosamente');
                return data.data;
            } else {
                throw new Error(data.message || 'Error al crear cliente');
            }
        } catch (error) {
            console.error('Error en ClienteAPI.crear:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                Utils.mostrarError('Error de conexión con el servidor');
            } else {
                Utils.mostrarError(error.message || 'Error desconocido al crear cliente');
            }
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
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },
    
    cerrar: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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
        console.log('=== Inicio agregarCliente ===');
        
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
        
        console.log('Datos del formulario:', {
            tipoCliente, tipoDocumento, numeroDocumento, nombres, apellidos, 
            razonSocial, email, telefono, fechaNacimiento
        });
        
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
            numero_documento: numeroDocumento.trim(),
            nombres: nombres.trim() || null,
            apellidos: apellidos.trim() || null,
            razon_social: razonSocial.trim() || null,
            correo: email.trim() || null,
            telefono: telefono.trim() || null,
            fecha_nacimiento: fechaNacimiento || null
        };
        
        console.log('Datos a enviar:', clienteData);
        
        // Enviar a la API
        const result = await ClienteAPI.crear(clienteData);
        console.log('Resultado de la API:', result);
        
        // Cerrar modal y recargar datos
        Modal.cerrar('modalAgregarUsuario');
        Modal.limpiarFormulario('modalAgregarUsuario');
        await cargarClientes();
        
        console.log('=== Cliente agregado exitosamente ===');
        
    } catch (error) {
        console.error('Error completo al agregar cliente:', error);
        // El error ya se mostró en ClienteAPI.crear, pero podemos agregar más información
        if (error.message) {
            Utils.mostrarError(`Error: ${error.message}`);
        } else {
            Utils.mostrarError('Error desconocido al agregar cliente');
        }
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
        
        // Llenar el formulario de edición
        // Por ahora, mostraremos la información en el modal de agregar
        document.getElementById('tipoCliente').value = cliente.tipo_cliente;
        document.getElementById('tipoDocumento').value = cliente.tipo_documento;
        document.getElementById('numeroDocumento').value = cliente.numero_documento;
        document.getElementById('nombres').value = cliente.nombres || '';
        document.getElementById('apellidos').value = cliente.apellidos || '';
        document.getElementById('razonSocial').value = cliente.razon_social || '';
        document.getElementById('email').value = cliente.correo || '';
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('fechaNacimiento').value = cliente.fecha_nacimiento || '';
        
        // Cambiar el comportamiento del botón
        const btnAgregar = document.getElementById('btnAgregarUsuario');
        btnAgregar.textContent = 'Actualizar';
        btnAgregar.onclick = () => actualizarCliente(id);
        
        Modal.abrir('modalAgregarUsuario');
        
    } catch (error) {
        console.error('Error al editar cliente:', error);
        Utils.mostrarError('Error al cargar datos del cliente');
    }
}

async function actualizarCliente(id) {
    try {
        // Obtener datos del formulario (mismo código que agregarCliente)
        const tipoCliente = document.getElementById('tipoCliente').value;
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const numeroDocumento = document.getElementById('numeroDocumento').value;
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const razonSocial = document.getElementById('razonSocial').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        
        // Mismas validaciones que agregarCliente
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
        
        // Restablecer botón y cerrar modal
        const btnAgregar = document.getElementById('btnAgregarUsuario');
        btnAgregar.textContent = 'Agregar';
        btnAgregar.onclick = agregarCliente;
        
        Modal.cerrar('modalAgregarUsuario');
        Modal.limpiarFormulario('modalAgregarUsuario');
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
    
    // Modal agregar cliente
    const btnAgregarUsuario = document.querySelector('.btn-agregar-usuario');
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener('click', () => {
            Modal.limpiarFormulario('modalAgregarUsuario');
            Modal.abrir('modalAgregarUsuario');
            
            // Asegurar que el botón esté configurado para agregar
            const btnSubmit = document.getElementById('btnAgregarUsuario');
            if (btnSubmit) {
                btnSubmit.textContent = 'Agregar';
                btnSubmit.onclick = agregarCliente;
            }
        });
    }
    
    // Botones de cerrar modal
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
});

// Hacer funciones globales para uso en HTML
window.verCliente = verCliente;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
