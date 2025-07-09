/**
 * Sistema de Notificaciones uwuTech
 * Manejo de notificaciones toast y alertas para el usuario
 */

class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        
        this.init();
    }
    
    init() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }
    }
    
    /**
     * Mostrar notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: success, error, warning, info
     * @param {number} duration - Duración en ms (0 = permanente)
     * @param {Object} options - Opciones adicionales
     */
    show(message, type = 'info', duration = null, options = {}) {
        const notification = this.createNotification(message, type, duration, options);
        this.addNotification(notification);
        return notification.id;
    }
    
    /**
     * Mostrar notificación de éxito
     */
    success(message, duration = null) {
        return this.show(message, 'success', duration);
    }
    
    /**
     * Mostrar notificación de error
     */
    error(message, duration = 8000) {
        return this.show(message, 'error', duration);
    }
    
    /**
     * Mostrar notificación de advertencia
     */
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }
    
    /**
     * Mostrar notificación informativa
     */
    info(message, duration = null) {
        return this.show(message, 'info', duration);
    }
    
    /**
     * Crear elemento de notificación
     */
    createNotification(message, type, duration, options) {
        const id = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        
        if (options.persistent) {
            notification.classList.add('notification-persistent');
        }
        
        // Icono según el tipo
        const icon = this.getIcon(type);
        
        // Crear contenido
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" data-notification-id="${id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Configurar auto-cierre
        if (duration === null) {
            duration = this.defaultDuration;
        }
        
        const notificationObj = {
            id,
            element: notification,
            type,
            message,
            duration,
            timer: null,
            persistent: options.persistent || false
        };
        
        // Auto-cierre si no es persistente
        if (duration > 0 && !options.persistent) {
            notificationObj.timer = setTimeout(() => {
                this.remove(id);
            }, duration);
        }
        
        return notificationObj;
    }
    
    /**
     * Obtener icono según el tipo
     */
    getIcon(type) {
        const icons = {
            success: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="16,8 12,12 8,8"></polyline>
                </svg>
            `,
            error: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            `,
            warning: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            `,
            info: `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            `
        };
        
        return icons[type] || icons.info;
    }
    
    /**
     * Añadir notificación al contenedor
     */
    addNotification(notification) {
        // Limitar número de notificaciones
        if (this.notifications.length >= this.maxNotifications) {
            this.remove(this.notifications[0].id);
        }
        
        this.notifications.push(notification);
        this.container.appendChild(notification.element);
        
        // Animar entrada
        setTimeout(() => {
            notification.element.classList.add('notification-show');
        }, 10);
        
        // Event listener para cerrar
        const closeBtn = notification.element.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification.id);
        });
        
        // Pausar timer en hover
        if (notification.timer) {
            notification.element.addEventListener('mouseenter', () => {
                if (notification.timer) {
                    clearTimeout(notification.timer);
                    notification.timer = null;
                }
            });
            
            notification.element.addEventListener('mouseleave', () => {
                if (!notification.persistent && notification.duration > 0) {
                    notification.timer = setTimeout(() => {
                        this.remove(notification.id);
                    }, 2000); // Tiempo reducido después del hover
                }
            });
        }
    }
    
    /**
     * Remover notificación
     */
    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) return;
        
        const notification = this.notifications[index];
        
        // Limpiar timer
        if (notification.timer) {
            clearTimeout(notification.timer);
        }
        
        // Animar salida
        notification.element.classList.add('notification-hide');
        
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications.splice(index, 1);
        }, 300);
    }
    
    /**
     * Limpiar todas las notificaciones
     */
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification.id);
        });
    }
    
    /**
     * Mostrar notificación de carrito
     */
    cartAdded(productName) {
        return this.success(`"${productName}" añadido al carrito`, 3000);
    }
    
    /**
     * Mostrar notificación de favoritos
     */
    favoriteAdded(productName) {
        return this.success(`"${productName}" añadido a favoritos`, 3000);
    }
    
    favoriteRemoved(productName) {
        return this.info(`"${productName}" eliminado de favoritos`, 3000);
    }
    
    /**
     * Mostrar notificación de autenticación
     */
    loginSuccess(userName) {
        return this.success(`¡Bienvenido, ${userName}!`, 4000);
    }
    
    logoutSuccess() {
        return this.info('Sesión cerrada correctamente', 3000);
    }
    
    /**
     * Mostrar notificación de registro
     */
    registerSuccess() {
        return this.success('Cuenta creada exitosamente. ¡Bienvenido a uwuTech!', 5000);
    }
    
    /**
     * Mostrar notificación de recuperación de contraseña
     */
    passwordRecoverySuccess(email) {
        return this.info(`Se ha enviado un enlace de recuperación a ${email}`, 6000);
    }
}

// Crear instancia global
window.notificationManager = new NotificationManager();

// jQuery plugin para facilitar el uso
if (typeof $ !== 'undefined') {
    $.notify = function(message, type, duration, options) {
        return window.notificationManager.show(message, type, duration, options);
    };
    
    $.notify.success = function(message, duration) {
        return window.notificationManager.success(message, duration);
    };
    
    $.notify.error = function(message, duration) {
        return window.notificationManager.error(message, duration);
    };
    
    $.notify.warning = function(message, duration) {
        return window.notificationManager.warning(message, duration);
    };
    
    $.notify.info = function(message, duration) {
        return window.notificationManager.info(message, duration);
    };
}
