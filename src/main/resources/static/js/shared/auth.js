// uwuTech Authentication System
// Sistema de autenticación compartido

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Cargar usuario desde localStorage si existe
        const savedUser = localStorage.getItem('uwutech_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIState();
        }
    }

    // Registro de usuario
    async register(userData) {
        try {
            // Validar datos
            this.validateRegistrationData(userData);

            // Simular API call (en producción sería una llamada real al backend)
            const response = await this.simulateAPICall('/api/public/customers/register', {
                method: 'POST',
                body: userData
            });

            if (response.success) {
                // Simular envío de email de verificación
                this.showNotification('¡Registro exitoso! Te hemos enviado un email de verificación.', 'success');
                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Error en el registro');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Inicio de sesión
    async login(email, password) {
        try {
            // Validar credenciales
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }

            // Simular API call
            const response = await this.simulateAPICall('/api/public/auth/login', {
                method: 'POST',
                body: { email, password }
            });

            if (response.success) {
                this.currentUser = response.user;
                localStorage.setItem('uwutech_user', JSON.stringify(this.currentUser));
                localStorage.setItem('uwutech_token', response.token);
                
                this.updateUIState();
                this.showNotification(`¡Bienvenido ${this.currentUser.name}!`, 'success');
                
                // Redirigir a la página anterior o al inicio
                const returnUrl = sessionStorage.getItem('returnUrl') || './index.html';
                sessionStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
                
                return { success: true, user: this.currentUser };
            } else {
                throw new Error(response.message || 'Credenciales inválidas');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Inicio de sesión con Google
    async loginWithGoogle() {
        try {
            // Simular autenticación con Google
            this.showNotification('Redirigiendo a Google...', 'info');
            
            // En producción, aquí se abriría la ventana de Google OAuth
            // Por ahora simulamos una respuesta exitosa
            setTimeout(async () => {
                const mockGoogleUser = {
                    id: 'google_' + Date.now(),
                    name: 'Usuario Google',
                    email: 'usuario@gmail.com',
                    avatar: 'https://via.placeholder.com/40',
                    provider: 'google',
                    verified: true
                };

                this.currentUser = mockGoogleUser;
                localStorage.setItem('uwutech_user', JSON.stringify(this.currentUser));
                localStorage.setItem('uwutech_token', 'mock_google_token');
                
                this.updateUIState();
                this.showNotification(`¡Bienvenido ${this.currentUser.name}!`, 'success');
                
                // Cerrar modal de login si está abierto
                if ($('#auth-modal').length) {
                    $('#auth-modal').hide();
                }
            }, 1500);

            return { success: true };
        } catch (error) {
            this.showNotification('Error al conectar con Google', 'error');
            return { success: false, error: error.message };
        }
    }

    // Recuperación de contraseña
    async forgotPassword(email) {
        try {
            if (!email) {
                throw new Error('Email es requerido');
            }

            // Simular API call
            const response = await this.simulateAPICall('/api/public/auth/forgot-password', {
                method: 'POST',
                body: { email }
            });

            if (response.success) {
                this.showNotification('Te hemos enviado las instrucciones de recuperación por email.', 'success');
                return { success: true };
            } else {
                throw new Error(response.message || 'Error al enviar email de recuperación');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('uwutech_user');
        localStorage.removeItem('uwutech_token');
        localStorage.removeItem('uwutech_cart');
        localStorage.removeItem('uwutech_favorites');
        
        this.updateUIState();
        this.showNotification('Sesión cerrada exitosamente', 'success');
        
        // Redirigir al inicio
        window.location.href = './index.html';
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Actualizar estado de la UI
    updateUIState() {
        const isAuth = this.isAuthenticated();
        
        // Actualizar botones del header
        if (isAuth) {
            $('.nav-actions').html(`
                <button class="search-btn" aria-label="Buscar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <div class="user-menu">
                    <button class="user-btn">
                        <img src="${this.currentUser.avatar || 'https://via.placeholder.com/32'}" alt="Avatar" class="user-avatar">
                        <span class="user-name">${this.currentUser.name}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </button>
                    <div class="user-dropdown">
                        <a href="./pages/perfil.html" class="dropdown-item">Mi Perfil</a>
                        <a href="./pages/pedidos.html" class="dropdown-item">Mis Pedidos</a>
                        <a href="./pages/favoritos.html" class="dropdown-item">Favoritos</a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout-btn">Cerrar Sesión</button>
                    </div>
                </div>
            `);

            // Actualizar versión móvil
            $('.mobile-actions').html(`
                <a href="./pages/perfil.html" class="btn btn-secondary mobile-btn">Mi Perfil</a>
                <button class="btn btn-primary mobile-btn logout-btn">Cerrar Sesión</button>
            `);
        } else {
            $('.nav-actions').html(`
                <button class="search-btn" aria-label="Buscar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <button class="btn btn-secondary btn-sm login-btn">Iniciar Sesión</button>
                <button class="btn btn-primary btn-sm register-btn">Registrarse</button>
            `);

            $('.mobile-actions').html(`
                <button class="btn btn-secondary mobile-btn login-btn">Iniciar Sesión</button>
                <button class="btn btn-primary mobile-btn register-btn">Registrarse</button>
            `);
        }

        // Agregar estilos para el menú de usuario
        this.addUserMenuStyles();
    }

    // Validar datos de registro
    validateRegistrationData(data) {
        if (!data.name || data.name.length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        if (!data.email || !this.isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }
        if (!data.password || data.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        if (data.password !== data.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }
    }

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simular llamadas a API
    async simulateAPICall(endpoint, options) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simular diferentes respuestas según el endpoint
        if (endpoint.includes('/register')) {
            const existingUsers = JSON.parse(localStorage.getItem('uwutech_users') || '[]');
            const emailExists = existingUsers.some(user => user.email === options.body.email);
            
            if (emailExists) {
                return { success: false, message: 'El email ya está registrado' };
            }

            const newUser = {
                id: Date.now(),
                name: options.body.name,
                email: options.body.email,
                avatar: 'https://via.placeholder.com/40',
                verified: false,
                createdAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            localStorage.setItem('uwutech_users', JSON.stringify(existingUsers));

            return { success: true, user: newUser };
        }

        if (endpoint.includes('/login')) {
            const users = JSON.parse(localStorage.getItem('uwutech_users') || '[]');
            const user = users.find(u => u.email === options.body.email);
            
            if (!user) {
                return { success: false, message: 'Usuario no encontrado' };
            }

            // En producción se verificaría la contraseña hasheada
            return { 
                success: true, 
                user: user,
                token: 'mock_jwt_token_' + Date.now()
            };
        }

        if (endpoint.includes('/forgot-password')) {
            return { success: true, message: 'Email enviado' };
        }

        return { success: false, message: 'Endpoint no implementado' };
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Agregar estilos para el menú de usuario
    addUserMenuStyles() {
        if (!$('#user-menu-styles').length) {
            $('head').append(`
                <style id="user-menu-styles">
                    .user-menu {
                        position: relative;
                    }
                    
                    .user-btn {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 8px 12px;
                        border-radius: var(--radius-md);
                        transition: var(--transition-normal);
                    }
                    
                    .user-btn:hover {
                        background: var(--background-light);
                    }
                    
                    .user-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                    
                    .user-name {
                        font-weight: 500;
                        color: var(--text-color-primary);
                    }
                    
                    .user-dropdown {
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background: white;
                        border-radius: var(--radius-lg);
                        box-shadow: var(--shadow-lg);
                        border: 1px solid var(--border-color);
                        min-width: 200px;
                        z-index: 1000;
                        display: none;
                        overflow: hidden;
                    }
                    
                    .user-dropdown.show {
                        display: block;
                    }
                    
                    .dropdown-item {
                        display: block;
                        padding: 12px 16px;
                        color: var(--text-color-primary);
                        text-decoration: none;
                        transition: var(--transition-normal);
                        border: none;
                        background: none;
                        width: 100%;
                        text-align: left;
                        cursor: pointer;
                    }
                    
                    .dropdown-item:hover {
                        background: var(--background-light);
                    }
                    
                    .dropdown-divider {
                        height: 1px;
                        background: var(--border-color);
                        margin: 8px 0;
                    }
                    
                    @media (max-width: 768px) {
                        .user-menu {
                            display: none;
                        }
                    }
                </style>
            `);
        }
    }
}

// Instancia global del gestor de autenticación
window.authManager = new AuthManager();

// Eventos globales de autenticación
$(document).ready(function() {
    // Toggle menú de usuario
    $(document).on('click', '.user-btn', function(e) {
        e.stopPropagation();
        $('.user-dropdown').toggleClass('show');
    });

    // Cerrar menú al hacer click fuera
    $(document).on('click', function() {
        $('.user-dropdown').removeClass('show');
    });

    // Botón de logout
    $(document).on('click', '.logout-btn', function(e) {
        e.preventDefault();
        window.authManager.logout();
    });
});
