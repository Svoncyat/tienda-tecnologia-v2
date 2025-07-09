// ====== DATOS Y VARIABLES GLOBALES ======
const clientesData = [
    {
        id: 1,
        nombre: "Heizen Guevara Perez",
        usuario: "HeizenPro",
        email: "heizen.gp27@gmail.com",
        estado: "activo",
        ultimoAcceso: "2025-06-11 17:20",
        tipoCliente: "persona-natural",
        tipoDocumento: "dni",
        numeroDocumento: "76153128",
        telefono: "+51 987 654 321",
        fechaNacimiento: "2004-10-27",
        genero: "masculino",
        estadoCivil: "soltero",
        fechaRegistro: "2025-01-15 10:30"
    },
    {
        id: 2,
        nombre: "Joy Steven",
        usuario: "joytivi",
        email: "tivi@gmail.com",
        estado: "inactivo",
        ultimoAcceso: "2025-06-11 13:20",
        tipoCliente: "persona-natural",
        tipoDocumento: "dni",
        numeroDocumento: "87654321"
    },
    {
        id: 3,
        nombre: "Tecnología Innovadora S.A.C.",
        usuario: "tecno_innovadora",
        email: "contacto@tecnoinnovadora.com",
        estado: "activo",
        ultimoAcceso: "2025-06-11 11:20",
        tipoCliente: "empresa",
        tipoDocumento: "ruc",
        numeroDocumento: "20123456789",
        telefono: "+51 1 234 5678",
        fechaRegistro: "2025-02-20 14:15"
    },
    {
        id: 4,
        nombre: "Belther Rodas",
        usuario: "barc",
        email: "barc@gmail.com",
        estado: "activo",
        ultimoAcceso: "2025-06-10 13:20",
        tipoCliente: "persona-natural",
        tipoDocumento: "dni",
        numeroDocumento: "55667788"
    }
];

let clientesFiltrados = [...clientesData];
let clienteEditandoId = null;

// ====== UTILIDADES ======
const Utils = {
    formatearFecha: (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit' 
        });
    },

    validarEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

    validarDocumento: (tipo, numero) => {
        const reglas = {
            'dni': /^\d{8}$/,
            'ruc': /^\d{11}$/,
            'ce': /^\d{9}$/,
            'pasaporte': numero => numero.length >= 6 && numero.length <= 12
        };
        const regla = reglas[tipo];
        return regla ? (typeof regla === 'function' ? regla(numero) : regla.test(numero)) : false;
    },

    generarUsuario: (tipoCliente, nombres, apellidos, razonSocial) => {
        let usuario = tipoCliente === 'persona-natural' 
            ? `${nombres.split(' ')[0]}.${apellidos.split(' ')[0]}`.toLowerCase()
            : razonSocial.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '').substring(0, 20);
        
        let contador = 1;
        const usuarioBase = usuario;
        while (clientesData.some(c => c.usuario === usuario)) {
            usuario = `${usuarioBase}${contador++}`;
        }
        return usuario;
    },

    limpiarClasesValidacion: (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.remove('error', 'success');
        });
    },

    mostrarError: (elementId, mensaje) => {
        document.getElementById(elementId).classList.add('error');
        if (mensaje) alert(mensaje);
    }
};

// ====== RENDERIZADO Y BÚSQUEDA ======
function crearAcciones(cliente) {
    return `
        <div class="acciones">
            <button class="btn-accion btn-ver" onclick="verCliente(${cliente.id})" title="Ver detalles">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-accion btn-editar" onclick="editarCliente(${cliente.id})" title="Editar">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${cliente.id})" title="Eliminar">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `;
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
            <td>${cliente.nombre}</td>
            <td>${cliente.usuario}</td>
            <td>${cliente.email}</td>
            <td><span class="estado-badge estado-${cliente.estado}">${cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>${Utils.formatearFecha(cliente.ultimoAcceso)}</td>
            <td>${crearAcciones(cliente)}</td>
        </tr>
    `).join('');
}

function buscarClientes() {
    const termino = document.getElementById('search-input').value.toLowerCase().trim();
    clientesFiltrados = termino === '' ? [...clientesData] : 
        clientesData.filter(cliente => 
            ['nombre', 'usuario', 'email', 'numeroDocumento']
                .some(campo => cliente[campo]?.toLowerCase().includes(termino))
        );
    renderizarTabla();
}

// ====== ACCIONES CRUD ======
function verCliente(id) {
    const cliente = clientesData.find(c => c.id === id);
    if (cliente) mostrarModalVisualizar(cliente);
}

function editarCliente(id) {
    const cliente = clientesData.find(c => c.id === id);
    if (cliente) mostrarModalEditar(cliente);
}

function eliminarCliente(id) {
    const cliente = clientesData.find(c => c.id === id);
    if (cliente && confirm(`¿Eliminar a ${cliente.nombre}?`)) {
        const index = clientesData.findIndex(c => c.id === id);
        clientesData.splice(index, 1);
        clientesFiltrados = clientesFiltrados.filter(c => c.id !== id);
        renderizarTabla();
        alert('Cliente eliminado correctamente');
    }
}

// ====== GESTIÓN DE MODALES ======
const ModalManager = {
    mostrar: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    },

    cerrar: (modalId, limpiarCallback) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            if (limpiarCallback) limpiarCallback();
        }
    },

    limpiarFormulario: (selector) => {
        document.querySelectorAll(selector).forEach(input => {
            input.value = '';
            input.classList.remove('error', 'success');
        });
    }
};

// ====== VALIDACIÓN DE FORMULARIOS ======
function validarFormulario(campos, esEdicion = false) {
    const prefijo = esEdicion ? 'edit' : '';
    Utils.limpiarClasesValidacion(`#modal${esEdicion ? 'Editar' : 'Agregar'}Usuario .form-group-nuevo input, .form-group-nuevo select`);
    
    let hasErrors = false;
    
    // Validaciones básicas
    if (!campos.tipoCliente) {
        Utils.mostrarError(`${prefijo}tipoCliente`);
        hasErrors = true;
    }
    
    if (!campos.tipoDocumento) {
        Utils.mostrarError(`${prefijo}tipoDocumento`);
        hasErrors = true;
    }
    
    if (!campos.numeroDocumento) {
        Utils.mostrarError(`${prefijo}numeroDocumento`);
        hasErrors = true;
    } else if (!Utils.validarDocumento(campos.tipoDocumento, campos.numeroDocumento)) {
        Utils.mostrarError(`${prefijo}numeroDocumento`, `Documento inválido para ${campos.tipoDocumento.toUpperCase()}`);
        hasErrors = true;
    }
    
    if (!campos.email) {
        Utils.mostrarError(`${prefijo}email`);
        hasErrors = true;
    } else if (!Utils.validarEmail(campos.email)) {
        Utils.mostrarError(`${prefijo}email`, 'Email inválido');
        hasErrors = true;
    }
    
    // Validar nombres según tipo
    if (campos.tipoCliente === 'persona-natural') {
        if (!campos.nombres) {
            Utils.mostrarError(`${prefijo}nombres`);
            hasErrors = true;
        }
        if (!campos.apellidos) {
            Utils.mostrarError(`${prefijo}apellidos`);
            hasErrors = true;
        }
    } else if (!campos.razonSocial) {
        Utils.mostrarError(`${prefijo}razonSocial`);
        hasErrors = true;
    }
    
    return !hasErrors;
}

// ====== FUNCIONES DE AGREGAR ======
function mostrarModalAgregar() {
    ModalManager.mostrar('modalAgregarUsuario');
    ModalManager.limpiarFormulario('#modalAgregarUsuario input, #modalAgregarUsuario select');
}

function cerrarModal() {
    ModalManager.cerrar('modalAgregarUsuario', () => {
        ModalManager.limpiarFormulario('#modalAgregarUsuario input, #modalAgregarUsuario select');
    });
}

function agregarCliente() {
    const campos = {
        tipoCliente: document.getElementById('tipoCliente').value.trim(),
        tipoDocumento: document.getElementById('tipoDocumento').value.trim(),
        numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        razonSocial: document.getElementById('razonSocial').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim()
    };
    
    if (!validarFormulario(campos)) {
        alert('Corrija los campos marcados en rojo');
        return;
    }
    
    // Verificar duplicados
    if (clientesData.some(c => c.numeroDocumento === campos.numeroDocumento)) {
        Utils.mostrarError('numeroDocumento', 'El documento ya existe');
        return;
    }
    
    if (clientesData.some(c => c.email === campos.email)) {
        Utils.mostrarError('email', 'El email ya está registrado');
        return;
    }
    
    // Crear cliente
    const nombreCompleto = campos.tipoCliente === 'persona-natural' 
        ? `${campos.nombres} ${campos.apellidos}` 
        : campos.razonSocial;
    
    const nuevoCliente = {
        id: Math.max(...clientesData.map(c => c.id)) + 1,
        nombre: nombreCompleto,
        usuario: Utils.generarUsuario(campos.tipoCliente, campos.nombres, campos.apellidos, campos.razonSocial),
        email: campos.email,
        estado: 'activo',
        ultimoAcceso: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ...campos,
        telefono: campos.telefono || 'No especificado'
    };
    
    clientesData.push(nuevoCliente);
    clientesFiltrados.push(nuevoCliente);
    renderizarTabla();
    alert('Cliente agregado correctamente');
    cerrarModal();
}

// ====== FUNCIONES DE EDITAR ======
function mostrarModalEditar(cliente) {
    clienteEditandoId = cliente.id;
    cargarDatosEnModalEditar(cliente);
    ModalManager.mostrar('modalEditarUsuario');
}

function cargarDatosEnModalEditar(cliente) {
    document.getElementById('editTipoCliente').value = cliente.tipoCliente || '';
    document.getElementById('editTipoDocumento').value = cliente.tipoDocumento || '';
    document.getElementById('editNumeroDocumento').value = cliente.numeroDocumento || '';
    document.getElementById('editEmail').value = cliente.email || '';
    document.getElementById('editTelefono').value = cliente.telefono || '';
    
    if (cliente.tipoCliente === 'persona-natural') {
        const partesNombre = cliente.nombre.split(' ');
        document.getElementById('editNombres').value = partesNombre[0] || '';
        document.getElementById('editApellidos').value = partesNombre.slice(1).join(' ') || '';
        document.getElementById('editRazonSocial').value = '';
    } else {
        document.getElementById('editNombres').value = '';
        document.getElementById('editApellidos').value = '';
        document.getElementById('editRazonSocial').value = cliente.nombre || '';
    }
    
    document.getElementById('editGenero').value = cliente.genero || '';
    document.getElementById('editEstadoCivil').value = cliente.estadoCivil || '';
    document.getElementById('editFechaNacimiento').value = cliente.fechaNacimiento || '';
    
    manejarTipoClienteEditar();
}

function cerrarModalEditar() {
    ModalManager.cerrar('modalEditarUsuario', () => {
        ModalManager.limpiarFormulario('#modalEditarUsuario input, #modalEditarUsuario select');
        clienteEditandoId = null;
    });
}

function guardarCambiosCliente() {
    if (!clienteEditandoId) return alert('Error: Cliente no identificado');
    
    const campos = {
        tipoCliente: document.getElementById('editTipoCliente').value.trim(),
        tipoDocumento: document.getElementById('editTipoDocumento').value.trim(),
        numeroDocumento: document.getElementById('editNumeroDocumento').value.trim(),
        nombres: document.getElementById('editNombres').value.trim(),
        apellidos: document.getElementById('editApellidos').value.trim(),
        razonSocial: document.getElementById('editRazonSocial').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        telefono: document.getElementById('editTelefono').value.trim(),
        genero: document.getElementById('editGenero').value.trim(),
        estadoCivil: document.getElementById('editEstadoCivil').value.trim(),
        fechaNacimiento: document.getElementById('editFechaNacimiento').value.trim()
    };
    
    if (!validarFormulario(campos, true)) {
        alert('Corrija los campos marcados en rojo');
        return;
    }
    
    const clienteIndex = clientesData.findIndex(c => c.id === clienteEditandoId);
    if (clienteIndex === -1) return alert('Cliente no encontrado');
    
    // Verificar duplicados (excluyendo el cliente actual)
    if (clientesData.some(c => c.id !== clienteEditandoId && c.numeroDocumento === campos.numeroDocumento)) {
        Utils.mostrarError('editNumeroDocumento', 'El documento ya existe');
        return;
    }
    
    if (clientesData.some(c => c.id !== clienteEditandoId && c.email === campos.email)) {
        Utils.mostrarError('editEmail', 'El email ya está registrado');
        return;
    }
    
    // Actualizar cliente
    const nombreCompleto = campos.tipoCliente === 'persona-natural' 
        ? `${campos.nombres} ${campos.apellidos}` 
        : campos.razonSocial;
    
    Object.assign(clientesData[clienteIndex], {
        ...campos,
        nombre: nombreCompleto,
        telefono: campos.telefono || 'No especificado'
    });
    
    // Actualizar filtrados
    const filtradoIndex = clientesFiltrados.findIndex(c => c.id === clienteEditandoId);
    if (filtradoIndex !== -1) {
        clientesFiltrados[filtradoIndex] = clientesData[clienteIndex];
    }
    
    renderizarTabla();
    alert('Cliente actualizado correctamente');
    cerrarModalEditar();
}

// ====== FUNCIONES DE VISUALIZACIÓN ======
function mostrarModalVisualizar(cliente) {
    const campos = {
        'viewTipoCliente': cliente.tipoCliente || '-',
        'viewTipoDocumento': cliente.tipoDocumento || '-',
        'viewNumeroDocumento': cliente.numeroDocumento || '-',
        'viewEmail': cliente.email || '-',
        'viewTelefono': cliente.telefono || '-',
        'viewGenero': cliente.genero || '-',
        'viewEstadoCivil': cliente.estadoCivil || '-',
        'viewFechaNacimiento': cliente.fechaNacimiento || '-',
        'viewEstado': cliente.estado || '-',
        'viewUltimoAcceso': Utils.formatearFecha(cliente.ultimoAcceso) || '-',
        'viewFechaRegistro': cliente.fechaRegistro ? Utils.formatearFecha(cliente.fechaRegistro) : '-'
    };
    
    if (cliente.tipoCliente === 'persona-natural') {
        const partesNombre = cliente.nombre.split(' ');
        campos['viewNombres'] = partesNombre[0] || '-';
        campos['viewApellidos'] = partesNombre.slice(1).join(' ') || '-';
        campos['viewRazonSocial'] = '-';
    } else {
        campos['viewNombres'] = '-';
        campos['viewApellidos'] = '-';
        campos['viewRazonSocial'] = cliente.nombre || '-';
    }
    
    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
    
    ModalManager.mostrar('modalVisualizarUsuario');
}

function cerrarModalVisualizar() {
    ModalManager.cerrar('modalVisualizarUsuario');
}

function editarDesdeVisualizar() {
    const cliente = clientesData.find(c => c.id === clienteEditandoId);
    if (cliente) {
        cerrarModalVisualizar();
        mostrarModalEditar(cliente);
    }
}

// ====== MANEJADORES DE TIPO DE CLIENTE ======
function manejarTipoCliente() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const grupos = {
        nombres: document.getElementById('nombres').closest('.form-group-nuevo'),
        apellidos: document.getElementById('apellidos').closest('.form-group-nuevo'),
        razonSocial: document.getElementById('razonSocial').closest('.form-group-nuevo')
    };
    
    if (tipoCliente === 'persona-natural') {
        grupos.nombres.style.display = 'flex';
        grupos.apellidos.style.display = 'flex';
        grupos.razonSocial.style.display = 'none';
        document.getElementById('razonSocial').value = '';
    } else if (['persona-juridica', 'empresa'].includes(tipoCliente)) {
        grupos.nombres.style.display = 'none';
        grupos.apellidos.style.display = 'none';
        grupos.razonSocial.style.display = 'flex';
        document.getElementById('nombres').value = '';
        document.getElementById('apellidos').value = '';
    } else {
        Object.values(grupos).forEach(grupo => grupo.style.display = 'flex');
    }
}

function manejarTipoClienteEditar() {
    const tipoCliente = document.getElementById('editTipoCliente').value;
    const grupos = {
        nombres: document.getElementById('editNombres').closest('.form-group-nuevo'),
        apellidos: document.getElementById('editApellidos').closest('.form-group-nuevo'),
        razonSocial: document.getElementById('editRazonSocial').closest('.form-group-nuevo')
    };
    
    if (tipoCliente === 'persona-natural') {
        grupos.nombres.style.display = 'flex';
        grupos.apellidos.style.display = 'flex';
        grupos.razonSocial.style.display = 'none';
        document.getElementById('editRazonSocial').value = '';
    } else if (['persona-juridica', 'empresa'].includes(tipoCliente)) {
        grupos.nombres.style.display = 'none';
        grupos.apellidos.style.display = 'none';
        grupos.razonSocial.style.display = 'flex';
        document.getElementById('editNombres').value = '';
        document.getElementById('editApellidos').value = '';
    } else {
        Object.values(grupos).forEach(grupo => grupo.style.display = 'flex');
    }
}

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar tabla inicial
    renderizarTabla();
    
    // Event listeners
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', buscarClientes);
    }
    
    const btnBuscar = document.querySelector('.btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarClientes);
    }
    
    const btnAgregarCliente = document.querySelector('.btn-agregar-usuario');
    if (btnAgregarCliente) {
        btnAgregarCliente.addEventListener('click', mostrarModalAgregar);
    }
    
    // Modales - Agregar
    const closeModalUsuario = document.getElementById('closeModalUsuario');
    if (closeModalUsuario) {
        closeModalUsuario.addEventListener('click', cerrarModal);
    }
    
    const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');
    if (btnCancelarUsuario) {
        btnCancelarUsuario.addEventListener('click', cerrarModal);
    }
    
    const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener('click', agregarCliente);
    }
    
    // Modales - Editar
    const closeModalEditarUsuario = document.getElementById('closeModalEditarUsuario');
    if (closeModalEditarUsuario) {
        closeModalEditarUsuario.addEventListener('click', cerrarModalEditar);
    }
    
    const btnCancelarEditarUsuario = document.getElementById('btnCancelarEditarUsuario');
    if (btnCancelarEditarUsuario) {
        btnCancelarEditarUsuario.addEventListener('click', cerrarModalEditar);
    }
    
    const btnGuardarEditarUsuario = document.getElementById('btnGuardarEditarUsuario');
    if (btnGuardarEditarUsuario) {
        btnGuardarEditarUsuario.addEventListener('click', guardarCambiosCliente);
    }
    
    // Modales - Visualizar
    const closeModalVisualizarUsuario = document.getElementById('closeModalVisualizarUsuario');
    if (closeModalVisualizarUsuario) {
        closeModalVisualizarUsuario.addEventListener('click', cerrarModalVisualizar);
    }
    
    const btnCerrarVisualizarUsuario = document.getElementById('btnCerrarVisualizarUsuario');
    if (btnCerrarVisualizarUsuario) {
        btnCerrarVisualizarUsuario.addEventListener('click', cerrarModalVisualizar);
    }
    
    const btnEditarDesdeVisualizar = document.getElementById('btnEditarDesdeVisualizar');
    if (btnEditarDesdeVisualizar) {
        btnEditarDesdeVisualizar.addEventListener('click', editarDesdeVisualizar);
    }
    
    // Cambios en tipo de cliente
    const tipoCliente = document.getElementById('tipoCliente');
    if (tipoCliente) {
        tipoCliente.addEventListener('change', manejarTipoCliente);
    }
    
    const editTipoCliente = document.getElementById('editTipoCliente');
    if (editTipoCliente) {
        editTipoCliente.addEventListener('change', manejarTipoClienteEditar);
    }
    
    // Prevenir cierre de modales al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            // Evitar que se cierre el modal al hacer clic fuera
            e.preventDefault();
            e.stopPropagation();
        }
    });
});
