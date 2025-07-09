/**
 * Profile Page Management
 * Handles user profile functionality including personal info, addresses, security, and preferences
 */

// Profile Manager
const ProfileManager = {
    currentSection: 'personal-info',
    currentUser: null,
    addresses: [],
    editingAddressId: null,
    originalFormData: {},

    // Peru location data (simplified version)
    locationData: {
        lima: {
            name: 'Lima',
            provinces: {
                'lima': {
                    name: 'Lima',
                    districts: [
                        'Barranco', 'Breña', 'Cercado de Lima', 'Chorrillos', 'Jesús María',
                        'La Molina', 'La Victoria', 'Lince', 'Magdalena del Mar', 'Miraflores',
                        'Pueblo Libre', 'Rímac', 'San Borja', 'San Isidro', 'San Luis',
                        'San Miguel', 'Santiago de Surco', 'Surquillo'
                    ]
                },
                'callao': {
                    name: 'Callao',
                    districts: ['Bellavista', 'Callao', 'Carmen de la Legua Reynoso', 'La Perla', 'La Punta', 'Ventanilla']
                }
            }
        },
        'arequipa': {
            name: 'Arequipa',
            provinces: {
                'arequipa': {
                    name: 'Arequipa',
                    districts: ['Alto Selva Alegre', 'Arequipa', 'Cayma', 'Cerro Colorado', 'Characato', 'Chiguata', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya', 'Quequeña', 'Sabandia', 'Sachaca', 'San Juan de Siguas', 'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Vitor', 'Yanahuara', 'Yarabamba', 'Yura']
                }
            }
        },
        'san-martin': {
            name: 'San Martín',
            provinces: {
                'moyobamba': {
                    name: 'Moyobamba',
                    districts: ['Calzada', 'Habana', 'Jepelacio', 'Moyobamba', 'Soritor', 'Yantalo']
                },
                'rioja': {
                    name: 'Rioja',
                    districts: ['Awajun', 'Elías Soplin Vargas', 'Nueva Cajamarca', 'Pardo Miguel', 'Posic', 'Rioja', 'San Fernando', 'Yorongos', 'Yuracyacu']
                }
            }
        }
    },

    /**
     * Initialize profile page
     */
    init() {
        console.log('Initializing Profile Manager...');
        
        // Check authentication
        if (!this.checkAuthentication()) {
            return;
        }

        this.loadUserData();
        this.bindEvents();
        this.loadAddresses();
        this.loadPreferences();
        this.initializeLocationDropdowns();
        
        console.log('Profile Manager initialized successfully');
    },

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        this.currentUser = AuthManager.getCurrentUser();
        
        if (!this.currentUser) {
            // Redirect to home page and show login modal
            window.location.href = '../index.html';
            return false;
        }
        
        return true;
    },

    /**
     * Load user data into forms
     */
    loadUserData() {
        const user = this.currentUser;
        
        // Update sidebar info
        $('#sidebar-user-name').text(`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario');
        $('#sidebar-user-email').text(user.email || 'usuario@email.com');
        
        // Update avatar initials
        const initials = this.generateInitials(user.firstName, user.lastName);
        $('#avatar-initials').text(initials);
        
        // Load personal info form
        $('#firstName').val(user.firstName || '');
        $('#lastName').val(user.lastName || '');
        $('#email').val(user.email || '');
        $('#phone').val(user.phone || '');
        $('#birthDate').val(user.birthDate || '');
        $('#gender').val(user.gender || '');
        
        // Store original form data
        this.storeOriginalFormData();
    },

    /**
     * Generate user initials
     */
    generateInitials(firstName, lastName) {
        let initials = '';
        if (firstName) initials += firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase();
        return initials || 'U';
    },

    /**
     * Store original form data for change detection
     */
    storeOriginalFormData() {
        this.originalFormData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            phone: $('#phone').val(),
            birthDate: $('#birthDate').val(),
            gender: $('#gender').val()
        };
    },

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Navigation
        $('.profile-nav-item').on('click', this.handleNavigation.bind(this));
        
        // Personal info form
        $('#personal-info-form').on('submit', this.handlePersonalInfoSubmit.bind(this));
        $('#cancel-personal-info').on('click', this.cancelPersonalInfoChanges.bind(this));
        
        // Address management
        $('#add-address-btn').on('click', this.showAddAddressModal.bind(this));
        $('#address-form').on('submit', this.handleAddressSubmit.bind(this));
        $('#address-department').on('change', this.handleDepartmentChange.bind(this));
        $('#address-province').on('change', this.handleProvinceChange.bind(this));
        
        // Security
        $('#password-form').on('submit', this.handlePasswordChange.bind(this));
        $('#logout-all-sessions').on('click', this.handleLogoutAllSessions.bind(this));
        
        // Preferences
        $('#save-preferences').on('click', this.savePreferences.bind(this));
        
        // Modal handlers
        $('.modal-close').on('click', this.handleModalClose.bind(this));
        $(document).on('click', '.modal', this.handleModalBackdropClick.bind(this));
        
        // Address actions (delegated events)
        $(document).on('click', '.edit-address', this.editAddress.bind(this));
        $(document).on('click', '.delete-address', this.deleteAddress.bind(this));
        $(document).on('click', '.set-default-address', this.setDefaultAddress.bind(this));
    },

    /**
     * Handle navigation between sections
     */
    handleNavigation(e) {
        e.preventDefault();
        
        const $item = $(e.currentTarget);
        const section = $item.data('section');
        
        if (!section) return; // Skip external links
        
        // Update active navigation
        $('.profile-nav-item').removeClass('active');
        $item.addClass('active');
        
        // Update content
        $('.profile-section-content').removeClass('active');
        $(`#${section}`).addClass('active');
        
        this.currentSection = section;
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'profile_section_view', {
                section: section
            });
        }
    },

    /**
     * Handle personal info form submission
     */
    async handlePersonalInfoSubmit(e) {
        e.preventDefault();
        
        const formData = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            phone: $('#phone').val().trim(),
            birthDate: $('#birthDate').val(),
            gender: $('#gender').val()
        };
        
        // Validate form
        if (!this.validatePersonalInfo(formData)) {
            return;
        }
        
        try {
            // Show loading state
            const $submitBtn = $('#personal-info-form button[type="submit"]');
            const originalText = $submitBtn.text();
            $submitBtn.prop('disabled', true).text('Guardando...');
            
            // Update user data
            const updatedUser = { ...this.currentUser, ...formData };
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update stored user data
            AuthManager.updateUserData(updatedUser);
            this.currentUser = updatedUser;
            
            // Update sidebar
            this.loadUserData();
            
            // Store new original data
            this.storeOriginalFormData();
            
            // Show success notification
            NotificationManager.show('Información personal actualizada correctamente', 'success');
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'profile_update', {
                    section: 'personal_info'
                });
            }
            
        } catch (error) {
            console.error('Error updating personal info:', error);
            NotificationManager.show('Error al actualizar la información', 'error');
        } finally {
            // Reset button
            const $submitBtn = $('#personal-info-form button[type="submit"]');
            $submitBtn.prop('disabled', false).text('Guardar Cambios');
        }
    },

    /**
     * Validate personal info form
     */
    validatePersonalInfo(data) {
        let isValid = true;
        
        // Clear previous errors
        $('.error-message').text('');
        
        // Validate first name
        if (!data.firstName) {
            $('#firstName-error').text('El nombre es requerido');
            isValid = false;
        }
        
        // Validate last name
        if (!data.lastName) {
            $('#lastName-error').text('El apellido es requerido');
            isValid = false;
        }
        
        // Validate phone (optional but if provided should be valid)
        if (data.phone && !/^\+?[\d\s\-\(\)]{9,}$/.test(data.phone)) {
            $('#phone-error').text('Formato de teléfono inválido');
            isValid = false;
        }
        
        return isValid;
    },

    /**
     * Cancel personal info changes
     */
    cancelPersonalInfoChanges() {
        // Restore original values
        $('#firstName').val(this.originalFormData.firstName);
        $('#lastName').val(this.originalFormData.lastName);
        $('#phone').val(this.originalFormData.phone);
        $('#birthDate').val(this.originalFormData.birthDate);
        $('#gender').val(this.originalFormData.gender);
        
        // Clear errors
        $('.error-message').text('');
        
        NotificationManager.show('Cambios cancelados', 'info');
    },

    /**
     * Initialize location dropdowns
     */
    initializeLocationDropdowns() {
        const $department = $('#address-department');
        
        // Populate departments
        $department.empty().append('<option value="">Seleccionar</option>');
        
        Object.keys(this.locationData).forEach(key => {
            const department = this.locationData[key];
            $department.append(`<option value="${key}">${department.name}</option>`);
        });
    },

    /**
     * Handle department change
     */
    handleDepartmentChange(e) {
        const departmentKey = $(e.target).val();
        const $province = $('#address-province');
        const $district = $('#address-district');
        
        // Clear dependent dropdowns
        $province.empty().append('<option value="">Seleccionar</option>');
        $district.empty().append('<option value="">Seleccionar</option>');
        
        if (departmentKey && this.locationData[departmentKey]) {
            const provinces = this.locationData[departmentKey].provinces;
            
            Object.keys(provinces).forEach(key => {
                const province = provinces[key];
                $province.append(`<option value="${key}">${province.name}</option>`);
            });
        }
    },

    /**
     * Handle province change
     */
    handleProvinceChange(e) {
        const departmentKey = $('#address-department').val();
        const provinceKey = $(e.target).val();
        const $district = $('#address-district');
        
        // Clear districts
        $district.empty().append('<option value="">Seleccionar</option>');
        
        if (departmentKey && provinceKey && this.locationData[departmentKey] && this.locationData[departmentKey].provinces[provinceKey]) {
            const districts = this.locationData[departmentKey].provinces[provinceKey].districts;
            
            districts.forEach(district => {
                $district.append(`<option value="${district.toLowerCase().replace(/\s+/g, '-')}">${district}</option>`);
            });
        }
    },

    /**
     * Load user addresses
     */
    loadAddresses() {
        // Get addresses from localStorage (in real app, this would be from API)
        const storedAddresses = localStorage.getItem(`addresses_${this.currentUser.email}`);
        this.addresses = storedAddresses ? JSON.parse(storedAddresses) : [];
        
        this.renderAddresses();
    },

    /**
     * Render addresses list
     */
    renderAddresses() {
        const $list = $('#addresses-list');
        
        if (this.addresses.length === 0) {
            $list.html(`
                <div class="empty-state">
                    <div class="empty-icon">📍</div>
                    <h3>No tienes direcciones guardadas</h3>
                    <p>Añade una dirección para facilitar tus compras</p>
                    <button class="btn btn-primary" id="add-first-address">Añadir Mi Primera Dirección</button>
                </div>
            `);
            
            $('#add-first-address').on('click', this.showAddAddressModal.bind(this));
            return;
        }
        
        const addressesHtml = this.addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}" data-id="${address.id}">
                <div class="address-header">
                    <h4>${address.name}</h4>
                    ${address.isDefault ? '<span class="default-badge">Principal</span>' : ''}
                </div>
                <div class="address-info">
                    <p><strong>${address.firstName} ${address.lastName}</strong></p>
                    <p>DNI: ${address.dni}</p>
                    <p>${address.street}</p>
                    ${address.reference ? `<p>Ref: ${address.reference}</p>` : ''}
                    <p>${address.district}, ${address.province}, ${address.department}</p>
                    <p>Tel: ${address.phone}</p>
                </div>
                <div class="address-actions">
                    <button class="btn-action edit-address" data-id="${address.id}" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${!address.isDefault ? `
                        <button class="btn-action set-default-address" data-id="${address.id}" title="Establecer como principal">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                        </button>
                        <button class="btn-action delete-address" data-id="${address.id}" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        $list.html(addressesHtml);
    },

    /**
     * Show add address modal
     */
    showAddAddressModal() {
        this.editingAddressId = null;
        $('#address-modal-title').text('Añadir Dirección');
        $('#address-form')[0].reset();
        $('#address-id').val('');
        
        // Pre-fill with user data
        $('#address-firstName').val(this.currentUser.firstName || '');
        $('#address-lastName').val(this.currentUser.lastName || '');
        
        this.showModal('address-modal');
    },

    /**
     * Edit address
     */
    editAddress(e) {
        const addressId = $(e.currentTarget).data('id');
        const address = this.addresses.find(addr => addr.id === addressId);
        
        if (!address) return;
        
        this.editingAddressId = addressId;
        $('#address-modal-title').text('Editar Dirección');
        
        // Fill form with address data
        $('#address-id').val(address.id);
        $('#address-name').val(address.name);
        $('#address-firstName').val(address.firstName);
        $('#address-lastName').val(address.lastName);
        $('#address-dni').val(address.dni);
        $('#address-street').val(address.street);
        $('#address-reference').val(address.reference);
        $('#address-phone').val(address.phone);
        $('#address-default').prop('checked', address.isDefault);
        
        // Set location dropdowns
        $('#address-department').val(address.departmentKey);
        this.handleDepartmentChange({ target: $('#address-department')[0] });
        
        setTimeout(() => {
            $('#address-province').val(address.provinceKey);
            this.handleProvinceChange({ target: $('#address-province')[0] });
            
            setTimeout(() => {
                $('#address-district').val(address.districtKey);
            }, 100);
        }, 100);
        
        this.showModal('address-modal');
    },

    /**
     * Handle address form submission
     */
    async handleAddressSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const addressData = {
            id: formData.get('id') || Date.now().toString(),
            name: formData.get('name'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            dni: formData.get('dni'),
            street: formData.get('street'),
            reference: formData.get('reference') || '',
            departmentKey: formData.get('department'),
            provinceKey: formData.get('province'),
            districtKey: formData.get('district'),
            phone: formData.get('phone'),
            isDefault: formData.get('isDefault') === 'on'
        };
        
        // Get readable names for location
        const department = this.locationData[addressData.departmentKey];
        const province = department?.provinces[addressData.provinceKey];
        const district = province?.districts.find(d => d.toLowerCase().replace(/\s+/g, '-') === addressData.districtKey);
        
        addressData.department = department?.name || '';
        addressData.province = province?.name || '';
        addressData.district = district || '';
        
        // Validate
        if (!this.validateAddress(addressData)) {
            return;
        }
        
        try {
            // Show loading
            const $submitBtn = $('#address-form button[type="submit"]');
            const originalText = $submitBtn.text();
            $submitBtn.prop('disabled', true).text('Guardando...');
            
            // If setting as default, unset others
            if (addressData.isDefault) {
                this.addresses.forEach(addr => addr.isDefault = false);
            }
            
            // If first address, set as default
            if (this.addresses.length === 0) {
                addressData.isDefault = true;
            }
            
            // Update or add address
            if (this.editingAddressId) {
                const index = this.addresses.findIndex(addr => addr.id === this.editingAddressId);
                if (index !== -1) {
                    this.addresses[index] = addressData;
                }
            } else {
                this.addresses.push(addressData);
            }
            
            // Save to localStorage
            localStorage.setItem(`addresses_${this.currentUser.email}`, JSON.stringify(this.addresses));
            
            // Update UI
            this.renderAddresses();
            this.hideModal('address-modal');
            
            // Show success message
            const action = this.editingAddressId ? 'actualizada' : 'agregada';
            NotificationManager.show(`Dirección ${action} correctamente`, 'success');
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'address_save', {
                    action: this.editingAddressId ? 'edit' : 'add'
                });
            }
            
        } catch (error) {
            console.error('Error saving address:', error);
            NotificationManager.show('Error al guardar la dirección', 'error');
        } finally {
            const $submitBtn = $('#address-form button[type="submit"]');
            $submitBtn.prop('disabled', false).text('Guardar Dirección');
        }
    },

    /**
     * Validate address data
     */
    validateAddress(data) {
        let isValid = true;
        
        // Basic validation
        const requiredFields = ['name', 'firstName', 'lastName', 'dni', 'street', 'departmentKey', 'provinceKey', 'districtKey', 'phone'];
        
        requiredFields.forEach(field => {
            if (!data[field]) {
                isValid = false;
            }
        });
        
        // DNI validation
        if (data.dni && (!/^\d{8}$/.test(data.dni))) {
            isValid = false;
        }
        
        if (!isValid) {
            NotificationManager.show('Por favor completa todos los campos requeridos', 'error');
        }
        
        return isValid;
    },

    /**
     * Delete address
     */
    async deleteAddress(e) {
        const addressId = $(e.currentTarget).data('id');
        const address = this.addresses.find(addr => addr.id === addressId);
        
        if (!address) return;
        
        if (address.isDefault && this.addresses.length > 1) {
            NotificationManager.show('No puedes eliminar la dirección principal. Establece otra como principal primero.', 'error');
            return;
        }
        
        if (confirm(`¿Estás seguro de que quieres eliminar la dirección "${address.name}"?`)) {
            try {
                // Remove address
                this.addresses = this.addresses.filter(addr => addr.id !== addressId);
                
                // If no addresses left, create empty array
                if (this.addresses.length === 0) {
                    this.addresses = [];
                } else if (address.isDefault && this.addresses.length > 0) {
                    // Set first address as default if we deleted the default one
                    this.addresses[0].isDefault = true;
                }
                
                // Save to localStorage
                localStorage.setItem(`addresses_${this.currentUser.email}`, JSON.stringify(this.addresses));
                
                // Update UI
                this.renderAddresses();
                
                NotificationManager.show('Dirección eliminada correctamente', 'success');
                
                // Track analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'address_delete');
                }
                
            } catch (error) {
                console.error('Error deleting address:', error);
                NotificationManager.show('Error al eliminar la dirección', 'error');
            }
        }
    },

    /**
     * Set address as default
     */
    async setDefaultAddress(e) {
        const addressId = $(e.currentTarget).data('id');
        
        try {
            // Unset all defaults
            this.addresses.forEach(addr => addr.isDefault = false);
            
            // Set new default
            const address = this.addresses.find(addr => addr.id === addressId);
            if (address) {
                address.isDefault = true;
            }
            
            // Save to localStorage
            localStorage.setItem(`addresses_${this.currentUser.email}`, JSON.stringify(this.addresses));
            
            // Update UI
            this.renderAddresses();
            
            NotificationManager.show('Dirección principal actualizada', 'success');
            
        } catch (error) {
            console.error('Error setting default address:', error);
            NotificationManager.show('Error al actualizar la dirección principal', 'error');
        }
    },

    /**
     * Handle password change
     */
    async handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = $('#current-password').val();
        const newPassword = $('#new-password').val();
        const confirmPassword = $('#confirm-password').val();
        
        // Clear previous errors
        $('.error-message').text('');
        
        // Validate passwords
        if (!this.validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
            return;
        }
        
        try {
            // Show loading
            const $submitBtn = $('#password-form button[type="submit"]');
            const originalText = $submitBtn.text();
            $submitBtn.prop('disabled', true).text('Cambiando...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In real app, verify current password and update
            // For demo, we'll just simulate success
            
            // Clear form
            $('#password-form')[0].reset();
            
            NotificationManager.show('Contraseña actualizada correctamente', 'success');
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'password_change');
            }
            
        } catch (error) {
            console.error('Error changing password:', error);
            NotificationManager.show('Error al cambiar la contraseña', 'error');
        } finally {
            const $submitBtn = $('#password-form button[type="submit"]');
            $submitBtn.prop('disabled', false).text('Cambiar Contraseña');
        }
    },

    /**
     * Validate password change
     */
    validatePasswordChange(current, newPass, confirm) {
        let isValid = true;
        
        if (!current) {
            $('#current-password-error').text('La contraseña actual es requerida');
            isValid = false;
        }
        
        if (!newPass) {
            $('#new-password-error').text('La nueva contraseña es requerida');
            isValid = false;
        } else if (newPass.length < 8) {
            $('#new-password-error').text('La contraseña debe tener al menos 8 caracteres');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPass)) {
            $('#new-password-error').text('La contraseña debe incluir mayúsculas, minúsculas y números');
            isValid = false;
        }
        
        if (newPass !== confirm) {
            $('#confirm-password-error').text('Las contraseñas no coinciden');
            isValid = false;
        }
        
        return isValid;
    },

    /**
     * Handle logout all sessions
     */
    async handleLogoutAllSessions() {
        if (confirm('¿Estás seguro de que quieres cerrar todas las sesiones activas?')) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                NotificationManager.show('Todas las sesiones han sido cerradas', 'success');
                
                // Track analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'logout_all_sessions');
                }
                
            } catch (error) {
                console.error('Error logging out sessions:', error);
                NotificationManager.show('Error al cerrar las sesiones', 'error');
            }
        }
    },

    /**
     * Load user preferences
     */
    loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem(`preferences_${this.currentUser.email}`)) || {
            notifications: {
                offers: true,
                orders: true,
                products: false
            },
            privacy: {
                analytics: true,
                publicProfile: false
            }
        };
        
        // Set preference toggles
        $('#notifications-offers').prop('checked', preferences.notifications.offers);
        $('#notifications-orders').prop('checked', preferences.notifications.orders);
        $('#notifications-products').prop('checked', preferences.notifications.products);
        $('#privacy-analytics').prop('checked', preferences.privacy.analytics);
        $('#privacy-public-profile').prop('checked', preferences.privacy.publicProfile);
    },

    /**
     * Save preferences
     */
    async savePreferences() {
        const preferences = {
            notifications: {
                offers: $('#notifications-offers').is(':checked'),
                orders: $('#notifications-orders').is(':checked'),
                products: $('#notifications-products').is(':checked')
            },
            privacy: {
                analytics: $('#privacy-analytics').is(':checked'),
                publicProfile: $('#privacy-public-profile').is(':checked')
            }
        };
        
        try {
            // Show loading
            const $saveBtn = $('#save-preferences');
            const originalText = $saveBtn.text();
            $saveBtn.prop('disabled', true).text('Guardando...');
            
            // Save to localStorage
            localStorage.setItem(`preferences_${this.currentUser.email}`, JSON.stringify(preferences));
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            NotificationManager.show('Preferencias guardadas correctamente', 'success');
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'preferences_save', {
                    notifications_enabled: Object.values(preferences.notifications).some(val => val),
                    analytics_enabled: preferences.privacy.analytics
                });
            }
            
        } catch (error) {
            console.error('Error saving preferences:', error);
            NotificationManager.show('Error al guardar las preferencias', 'error');
        } finally {
            const $saveBtn = $('#save-preferences');
            $saveBtn.prop('disabled', false).text('Guardar Preferencias');
        }
    },

    /**
     * Show modal
     */
    showModal(modalId) {
        $(`#${modalId}`).addClass('active');
        $('body').addClass('modal-open');
    },

    /**
     * Hide modal
     */
    hideModal(modalId) {
        $(`#${modalId}`).removeClass('active');
        $('body').removeClass('modal-open');
    },

    /**
     * Handle modal close
     */
    handleModalClose(e) {
        const modalId = $(e.currentTarget).data('modal');
        if (modalId) {
            this.hideModal(modalId);
        }
    },

    /**
     * Handle modal backdrop click
     */
    handleModalBackdropClick(e) {
        if (e.target === e.currentTarget) {
            const modalId = $(e.currentTarget).attr('id');
            if (modalId) {
                this.hideModal(modalId);
            }
        }
    }
};

// Initialize when document is ready
$(document).ready(() => {
    ProfileManager.init();
});

// Export for use by other modules
window.ProfileManager = ProfileManager;
