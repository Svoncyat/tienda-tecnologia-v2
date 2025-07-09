// Global variables
let currentUser = null;
let stores = [
    {
        id: 1,
        name: 'UwuTech',
        address: 'Jr Ubuntu, Morales, Tarapoto',
        phone: '+51 987 654 321',
        email: 'adminuwutech@gmail.com',
        status: 'active'
    },
    {
        id: 2,
        name: 'AyachisTech',
        address: 'Jr Ubuntuq, Juan Guerra, Tarapoto',
        phone: '+51 783 654 321',
        email: 'adminayachistech@gmail.com',
        status: 'active'
    },
    {
        id: 3,
        name: 'UbuntuTech',
        address: 'Jr Pollito, los olivos, Moyobamba',
        phone: '+51 987 654 321',
        email: 'adminubuntu@gmail.com',
        status: 'inactive'
    }
];

// Usuarios del sistema
let users = [
    {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@tiendacentro.com',
        phone: '+1 555-111-2222',
        role: 'Admin',
        store: 'Tienda Centro',
        status: 'active',
        lastAccess: '2024-01-15 10:30'
    },
    {
        id: 2,
        name: 'María García',
        email: 'maria@sucursalnorte.com',
        phone: '+1 555-333-4444',
        role: 'Gerente',
        store: 'Sucursal Norte',
        status: 'active',
        lastAccess: '2024-01-14 15:45'
    },
    {
        id: 3,
        name: 'Carlos López',
        email: 'carlos@ubicacionoeste.com',
        phone: '+1 555-555-6666',
        role: 'Empleado',
        store: 'Ubicación Oeste',
        status: 'inactive',
        lastAccess: '2024-01-10 09:20'
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initLogin();
            break;
        case 'dashboard':
            checkAuth();
            initDashboard();
            break;
        case 'Gestion':
            checkAuth();
            initStoreManagement();
            break;
        case 'mensajes':
            checkAuth();
            initUserManagement();
            break;
        default:
            checkAuth();
            initCommonFeatures();
    }
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Authentication functions
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const forgotPassword = document.getElementById('forgot-password');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (forgotPassword) {
        forgotPassword.addEventListener('click', handleForgotPassword);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageElement = document.getElementById('login-message');
    
    // Clear previous messages
    hideMessage(messageElement);
    
    // Validation
    if (!username || !password) {
        showMessage(messageElement, 'Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simulate login
    simulateLogin(username, password)
        .then(response => {
            if (response.success) {
                localStorage.setItem('superadmin_token', 'simulated_token');
                localStorage.setItem('superadmin_user', JSON.stringify(response.user));
                
                showMessage(messageElement, 'Inicio de sesión exitoso', 'success');
                
                setTimeout(() => {
                    window.location.href = './super-admin/dashboard.html';
                }, 1000);
            } else {
                showMessage(messageElement, response.message, 'error');
            }
        })
        .catch(error => {
            showMessage(messageElement, 'Error en el servidor. Intente nuevamente.', 'error');
            console.error('Login error:', error);
        });
}

function simulateLogin(username, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'Admin123!') {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        username: 'admin',
                        name: 'Administrador Principal',
                        role: 'superadmin',
                        lastLogin: new Date().toISOString()
                    }
                });
            } else {
                resolve({
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }
        }, 800);
    });
}

function handleForgotPassword(e) {
    e.preventDefault();
    alert('Por favor contacte al equipo de soporte técnico para restablecer su contraseña.');
}

function checkAuth() {
    const token = localStorage.getItem('superadmin_token');
    const userData = localStorage.getItem('superadmin_user');
    
    if (!token || !userData) {
        window.location.href = '../index.html';
        return false;
    }
    
    try {
        currentUser = JSON.parse(userData);
        return true;
    } catch (error) {
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');
        window.location.href = '../index.html';
        return false;
    }
}

function logout() {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    window.location.href = '../index.html';
}

// Common features
function initCommonFeatures() {
    initSidebar();
    initUserInfo();
    setActiveNavItem();
}

function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('backdrop');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            if (backdrop) {
                backdrop.classList.toggle('show');
            }
        });
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('show');
            backdrop.classList.remove('show');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function initUserInfo() {
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');
    
    if (currentUser) {
        if (userNameElement) {
            userNameElement.textContent = currentUser.name;
        }
        if (userRoleElement) {
            userRoleElement.textContent = currentUser.role === 'superadmin' ? 'Super Administrador' : currentUser.role;
        }
    }
}

function setActiveNavItem() {
    const currentPage = getCurrentPage();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}

// Dashboard functions
function initDashboard() {
    initCommonFeatures();
    updateDashboardStats();
    updateUserStats();
}

function updateDashboardStats() {
    const activeCount = stores.filter(store => store.status === 'active').length;
    const inactiveCount = stores.filter(store => store.status === 'inactive').length;
    const totalCount = stores.length;
    
    updateStatCard('active-stores-count', activeCount);
    updateStatCard('inactive-stores-count', inactiveCount);
    updateStatCard('total-stores-count', totalCount);
}

function updateUserStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    
    // Actualizar contador en la página de usuarios
    updateStatCard('total-users-count', totalUsers);
    updateStatCard('active-users-count', activeUsers);
    
    // Actualizar contador en el dashboard
    updateStatCard('dashboard-total-users-count', totalUsers);
}

function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Store Management functions
function initStoreManagement() {
    initCommonFeatures();
    initStoreActions();
    initStoreFilters();
    renderStores();
    updateStoreStats();
}

function initStoreActions() {
    const addBtn = document.getElementById('add-company-btn');
    const deleteBtn = document.getElementById('delete-company-btn');
    
    if (addBtn) {
        addBtn.addEventListener('click', showAddStoreModal);
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', showDeleteStoreModal);
    }
    
    // Modal close buttons
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Form submissions
    const addForm = document.getElementById('add-company-form');
    const deleteForm = document.getElementById('delete-company-form');
    
    if (addForm) {
        addForm.addEventListener('submit', handleAddStore);
    }
    
    if (deleteForm) {
        deleteForm.addEventListener('submit', handleDeleteStore);
    }
    
    // Status confirmation
    const confirmBtn = document.getElementById('status-confirm-btn');
    const cancelBtn = document.getElementById('status-cancel-btn');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmStatusChange);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelStatusChange);
    }
    
    // Backdrop click
    const backdrop = document.getElementById('backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeModals);
    }
}

function initStoreFilters() {
    const filterBtn = document.getElementById('filter-btn');
    const sortBtn = document.getElementById('sort-btn');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('filter-dropdown');
            closeDropdown('sort-dropdown');
        });
    }
    
    if (sortBtn) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('sort-dropdown');
            closeDropdown('filter-dropdown');
        });
    }
    
    // Filter items
    const filterItems = document.querySelectorAll('[data-filter]');
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            applyFilter(item.dataset.filter);
            updateFilterButton(item.textContent);
            closeDropdown('filter-dropdown');
        });
    });
    
    // Sort items
    const sortItems = document.querySelectorAll('[data-sort]');
    sortItems.forEach(item => {
        item.addEventListener('click', () => {
            applySort(item.dataset.sort);
            updateSortButton(item.textContent);
            closeDropdown('sort-dropdown');
        });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        closeDropdown('filter-dropdown');
        closeDropdown('sort-dropdown');
    });
}

function renderStores() {
    const storeGrid = document.getElementById('store-grid');
    if (!storeGrid) return;
    
    storeGrid.innerHTML = '';
    
    stores.forEach(store => {
        const storeCard = createStoreCard(store);
        storeGrid.appendChild(storeCard);
    });
}

function createStoreCard(store) {
    const card = document.createElement('div');
    card.className = `store-card ${store.status === 'inactive' ? 'hidden-store' : ''}`;
    card.setAttribute('data-store-name', store.name);
    card.setAttribute('data-store-status', store.status);
    
    card.innerHTML = `
        <div class="store-card-content">
            <div class="store-header">
                <h3 class="store-title">${store.name}</h3>
                <div class="store-actions">
                    <button class="edit-btn" onclick="editStore(${store.id})">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <span class="status-badge ${store.status}">${store.status === 'active' ? 'Activa' : 'Inactiva'}</span>
                </div>
            </div>
            <div class="store-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${store.address}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span>${store.phone}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>${store.email}</span>
                </div>
            </div>
            <div class="store-footer">
                <span class="footer-label">Estado</span>
                <label class="toggle-switch">
                    <input type="checkbox" class="store-toggle" data-store-id="${store.id}" ${store.status === 'active' ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;
    
    // Add toggle event listener
    const toggle = card.querySelector('.store-toggle');
    toggle.addEventListener('change', (e) => {
        e.preventDefault();
        handleStatusToggle(store.id, toggle);
    });
    
    return card;
}

let currentToggle = null;
let originalState = false;

function handleStatusToggle(storeId, toggleElement) {
    currentToggle = toggleElement;
    originalState = !toggleElement.checked;
    toggleElement.checked = originalState;
    
    const store = stores.find(s => s.id === storeId);
    if (!store) return;
    
    const newStatus = originalState ? 'inactiva' : 'activa';
    
    document.getElementById('status-modal-title').textContent = `Cambiar Estado: ${store.name}`;
    document.getElementById('status-modal-message').textContent = 
        `¿Está seguro de que desea marcar esta tienda como ${newStatus}?`;
    
    showModal('status-confirmation-modal');
}

function confirmStatusChange() {
    if (!currentToggle) return;
    
    const newState = !originalState;
    currentToggle.checked = newState;
    
    const storeId = parseInt(currentToggle.dataset.storeId);
    const store = stores.find(s => s.id === storeId);
    
    if (store) {
        store.status = newState ? 'active' : 'inactive';
        
        // Update the card
        const card = currentToggle.closest('.store-card');
        const statusBadge = card.querySelector('.status-badge');
        
        statusBadge.className = `status-badge ${store.status}`;
        statusBadge.textContent = store.status === 'active' ? 'Activa' : 'Inactiva';
        card.setAttribute('data-store-status', store.status);
        
        updateStoreStats();
    }
    
    closeModals();
    currentToggle = null;
}

function cancelStatusChange() {
    closeModals();
    currentToggle = null;
}

function showAddStoreModal() {
    showModal('add-company-modal');
    showBackdrop();
}

function showDeleteStoreModal() {
    updateDeleteStoreOptions();
    showModal('delete-company-modal');
    showBackdrop();
}

function updateDeleteStoreOptions() {
    const select = document.querySelector('#delete-company-form select');
    if (!select) return;
    
    // Clear existing options except the first one
    const firstOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    // Add store options
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.id;
        option.textContent = store.name;
        select.appendChild(option);
    });
}

function handleAddStore(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const inputs = e.target.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    const name = inputs[0].value.trim();
    const address = inputs[1].value.trim();
    const phone = inputs[2].value.trim();
    const adminName = inputs[3].value.trim();
    const adminEmail = inputs[4].value.trim();
    const adminPassword = inputs[5].value.trim();
    
    if (!name || !address || !phone || !adminName || !adminEmail || !adminPassword) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const newStore = {
        id: Date.now(),
        name: name,
        address: address,
        phone: phone,
        email: `admin@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        status: 'active'
    };
    
    stores.push(newStore);
    renderStores();
    updateStoreStats();
    
    e.target.reset();
    closeModals();
}

function handleDeleteStore(e) {
    e.preventDefault();
    
    const select = e.target.querySelector('select');
    const storeId = parseInt(select.value);
    
    if (!storeId) {
        alert('Por favor seleccione una tienda');
        return;
    }
    
    stores = stores.filter(store => store.id !== storeId);
    renderStores();
    updateStoreStats();
    
    e.target.reset();
    closeModals();
}

function updateStoreStats() {
    const activeCount = stores.filter(store => store.status === 'active').length;
    const inactiveCount = stores.filter(store => store.status === 'inactive').length;
    const totalCount = stores.length;
    
    updateStatCard('active-stores-count', activeCount);
    updateStatCard('inactive-stores-count', inactiveCount);
    updateStatCard('total-stores-count', totalCount);
}

function applyFilter(filter) {
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        card.classList.remove('hidden-store');
        
        if (filter === 'active') {
            if (card.getAttribute('data-store-status') !== 'active') {
                card.classList.add('hidden-store');
            }
        } else if (filter === 'inactive') {
            if (card.getAttribute('data-store-status') !== 'inactive') {
                card.classList.add('hidden-store');
            }
        }
    });
}

function applySort(sort) {
    const storeGrid = document.getElementById('store-grid');
    const storeCards = Array.from(storeGrid.querySelectorAll('.store-card'));
    
    storeCards.sort((a, b) => {
        const nameA = a.getAttribute('data-store-name').toLowerCase();
        const nameB = b.getAttribute('data-store-name').toLowerCase();
        const statusA = a.getAttribute('data-store-status');
        const statusB = b.getAttribute('data-store-status');
        
        switch (sort) {
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            case 'status-active':
                if (statusA === 'active' && statusB === 'inactive') return -1;
                if (statusA === 'inactive' && statusB === 'active') return 1;
                return nameA.localeCompare(nameB);
            case 'status-inactive':
                if (statusA === 'inactive' && statusB === 'active') return -1;
                if (statusA === 'active' && statusB === 'inactive') return 1;
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    storeGrid.innerHTML = '';
    storeCards.forEach(card => storeGrid.appendChild(card));
}

function updateFilterButton(text) {
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.innerHTML = `<i class="fas fa-filter"></i> ${text}`;
    }
}

function updateSortButton(text) {
    const sortBtn = document.getElementById('sort-btn');
    if (sortBtn) {
        sortBtn.innerHTML = `<i class="fas fa-sort"></i> ${text}`;
    }
}

function editStore(storeId) {
    alert(`Editar tienda con ID: ${storeId} (funcionalidad pendiente)`);
}

// Utility functions
function showMessage(element, message, type = 'info') {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type} show`;
    
    setTimeout(() => {
        hideMessage(element);
    }, 5000);
}

function hideMessage(element) {
    if (!element) return;
    element.classList.remove('show');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    hideBackdrop();
}

function showBackdrop() {
    const backdrop = document.getElementById('backdrop');
    if (backdrop) {
        backdrop.classList.remove('hidden');
        backdrop.classList.add('show');
    }
}

function hideBackdrop() {
    const backdrop = document.getElementById('backdrop');
    if (backdrop) {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('show');
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// User Management Functions
function initUserManagement() {
    initCommonFeatures();
    updateUserStats();
    renderUsers();
    initUserActions();
}

function renderUsers() {
    const usersGrid = document.querySelector('.content-area .stats-grid + .action-bar + div');
    if (!usersGrid) return;
    
    usersGrid.innerHTML = '';
    users.forEach(user => {
        const userCard = createUserCard(user);
        usersGrid.appendChild(userCard);
    });
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.setAttribute('data-user-id', user.id);
    card.setAttribute('data-user-status', user.status);
    
    const roleClass = user.role === 'Admin' ? 'admin' : user.role === 'Gerente' ? 'manager' : 'employee';
    const statusClass = user.status === 'active' ? 'active' : 'inactive';
    const statusText = user.status === 'active' ? 'Activo' : 'Inactivo';
    const actionText = user.status === 'active' ? 'Desactivar' : 'Activar';
    const actionClass = user.status === 'active' ? 'btn-danger' : 'btn-primary';
    
    card.innerHTML = `
        <div style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${user.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">${user.store}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <span style="background: ${getRoleBackground(user.role)}; color: ${getRoleColor(user.role)}; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">${user.role}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div style="margin-bottom: 1rem;">
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span>${user.phone}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Último acceso: ${user.lastAccess}</span>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button class="btn ${actionClass} toggle-user-status" style="padding: 0.5rem 0.75rem; font-size: 0.8125rem;" data-user-id="${user.id}">${actionText}</button>
                <button class="btn btn-edit-user" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.25rem;" data-user-id="${user.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function getRoleBackground(role) {
    switch(role) {
        case 'Administrador': return '#e0e7ff';
        case 'Editor': return '#dbeafe';
        case 'Admin': return '#e0e7ff';
        case 'Gerente': return '#dbeafe';
        case 'Empleado': return '#f3f4f6';
        default: return '#f3f4f6';
    }
}

function getRoleColor(role) {
    switch(role) {
        case 'Administrador': return '#3730a3';
        case 'Editor': return '#1e40af';
        case 'Admin': return '#3730a3';
        case 'Gerente': return '#1e40af';
        case 'Empleado': return '#374151';
        default: return '#374151';
    }
}

function initUserActions() {
    // Event delegation for user actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-user-status') || e.target.closest('.toggle-user-status')) {
            const button = e.target.classList.contains('toggle-user-status') ? e.target : e.target.closest('.toggle-user-status');
            const userId = parseInt(button.getAttribute('data-user-id'));
            toggleUserStatus(userId);
        }
        
        if (e.target.classList.contains('btn-edit-user') || e.target.closest('.btn-edit-user')) {
            const button = e.target.classList.contains('btn-edit-user') ? e.target : e.target.closest('.btn-edit-user');
            const userId = parseInt(button.getAttribute('data-user-id'));
            editUser(userId);
        }
        
        // Modal close buttons
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            closeModals();
            hideBackdrop();
        }
    });
    
    // Add user button
    const addUserBtn = document.querySelector('.action-buttons .btn-primary');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
    
    // Delete user button
    const deleteUserBtn = document.querySelector('.action-buttons .btn-danger');
    if (deleteUserBtn) {
        deleteUserBtn.addEventListener('click', showDeleteUserModal);
    }
    
    // Backdrop click to close modals
    const backdrop = document.getElementById('backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            closeModals();
            hideBackdrop();
        });
    }
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    user.status = user.status === 'active' ? 'inactive' : 'active';
    renderUsers();
    updateUserStats();
}

function editUser(userId) {
    alert(`Editar usuario con ID: ${userId} (funcionalidad pendiente)`);
}

function showAddUserModal() {
    // Populate store options - seleccionar específicamente el select de tiendas
    const selects = document.querySelectorAll('#add-user-modal select');
    const storeSelect = selects[1]; // El segundo select es el de tiendas
    
    if (storeSelect) {
        storeSelect.innerHTML = '<option value="">Seleccione una tienda...</option>';
        stores.forEach(store => {
            const option = document.createElement('option');
            option.value = store.name;
            option.textContent = store.name;
            storeSelect.appendChild(option);
        });
    }
    
    // Add form event listener
    const form = document.getElementById('add-user-form');
    if (form) {
        form.removeEventListener('submit', handleAddUser);
        form.addEventListener('submit', handleAddUser);
    }
    
    showModal('add-user-modal');
    showBackdrop();
}

function showDeleteUserModal() {
    // Populate user options
    const userSelect = document.querySelector('#delete-user-modal select');
    if (userSelect) {
        userSelect.innerHTML = '<option value="">Seleccione un usuario...</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} - ${user.role} (${user.store})`;
            userSelect.appendChild(option);
        });
    }
    
    // Add form event listener
    const form = document.getElementById('delete-user-form');
    if (form) {
        form.removeEventListener('submit', handleDeleteUser);
        form.addEventListener('submit', handleDeleteUser);
    }
    
    showModal('delete-user-modal');
    showBackdrop();
}

function handleAddUser(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const inputs = e.target.querySelectorAll('input, select');
    
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const phone = inputs[2].value.trim();
    const role = inputs[3].value;
    const store = inputs[4].value;
    const password = inputs[5].value.trim();
    
    if (!name || !email || !phone || !role || !store || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        role: role,
        store: store,
        status: 'active',
        lastAccess: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})
    };
    
    users.push(newUser);
    renderUsers();
    updateUserStats();
    
    e.target.reset();
    closeModals();
    hideBackdrop();
}

function handleDeleteUser(e) {
    e.preventDefault();
    
    const select = e.target.querySelector('select');
    const userId = parseInt(select.value);
    
    if (!userId) {
        alert('Por favor seleccione un usuario');
        return;
    }
    
    users = users.filter(user => user.id !== userId);
    renderUsers();
    updateUserStats();
    
    e.target.reset();
    closeModals();
    hideBackdrop();
}