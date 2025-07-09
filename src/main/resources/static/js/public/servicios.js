/**
 * Services Page JavaScript
 * Handles service-specific functionality, modals, form submissions
 */

$(document).ready(function() {
    initializeServicesPage();
});

function initializeServicesPage() {
    initializeServiceModal();
    initializeServiceButtons();
    initializeFormHandling();
    initializeScrollAnimations();
    initializeAnalytics();
}

/**
 * Service Modal Functionality
 */
function initializeServiceModal() {
    const modal = $('#service-modal');
    const closeBtn = $('#modal-close');
    const cancelBtn = $('#form-cancel');

    // Open modal
    function openModal(serviceType = '') {
        modal.fadeIn(300);
        $('body').addClass('modal-open');
        
        // Pre-select service type if provided
        if (serviceType) {
            $('#service-type').val(serviceType);
        }
        
        // Focus on first input
        setTimeout(() => {
            $('#customer-name').focus();
        }, 300);
    }

    // Close modal
    function closeModal() {
        modal.fadeOut(300);
        $('body').removeClass('modal-open');
        
        // Reset form
        $('#service-form')[0].reset();
        clearFormMessages();
    }

    // Event listeners
    closeBtn.on('click', closeModal);
    cancelBtn.on('click', closeModal);
    
    // Close on outside click
    modal.on('click', function(e) {
        if (e.target === modal[0]) {
            closeModal();
        }
    });

    // Close on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && modal.is(':visible')) {
            closeModal();
        }
    });

    // Expose openModal function
    window.openServiceModal = openModal;
}

/**
 * Service Button Handlers
 */
function initializeServiceButtons() {
    // Service card buttons
    $('.service-btn').on('click', function() {
        const serviceCard = $(this).closest('.service-card');
        const serviceType = serviceCard.data('service');
        window.openServiceModal(serviceType);
        
        // Analytics
        trackEvent('service_button_click', {
            service_type: serviceType,
            location: 'service_card'
        });
    });

    // Hero CTA buttons
    $('#contact-btn, #cta-contact').on('click', function() {
        window.openServiceModal();
        
        trackEvent('service_button_click', {
            location: 'hero_cta'
        });
    });

    $('#quote-btn').on('click', function() {
        window.openServiceModal();
        
        trackEvent('service_button_click', {
            location: 'quote_button'
        });
    });
}

/**
 * Form Handling
 */
function initializeFormHandling() {
    const form = $('#service-form');

    form.on('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitServiceRequest();
        }
    });

    // Real-time validation
    form.find('input, select, textarea').on('blur', function() {
        validateField($(this));
    });
}

function validateForm() {
    let isValid = true;
    const form = $('#service-form');
    
    clearFormMessages();

    // Validate required fields
    form.find('[required]').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });

    // Validate email format
    const email = $('#customer-email');
    if (email.val() && !isValidEmail(email.val())) {
        showFieldError(email, 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    }

    // Validate phone format
    const phone = $('#customer-phone');
    if (phone.val() && !isValidPhone(phone.val())) {
        showFieldError(phone, 'Por favor ingresa un número de teléfono válido');
        isValid = false;
    }

    return isValid;
}

function validateField($field) {
    const value = $field.val().trim();
    const fieldName = $field.attr('name');
    
    clearFieldError($field);

    if ($field.prop('required') && !value) {
        showFieldError($field, 'Este campo es requerido');
        return false;
    }

    if (fieldName === 'customerEmail' && value && !isValidEmail(value)) {
        showFieldError($field, 'Formato de correo inválido');
        return false;
    }

    if (fieldName === 'customerPhone' && value && !isValidPhone(value)) {
        showFieldError($field, 'Formato de teléfono inválido');
        return false;
    }

    return true;
}

function showFieldError($field, message) {
    $field.addClass('error');
    
    // Remove existing error message
    $field.siblings('.field-error').remove();
    
    // Add error message
    $field.after(`<div class="field-error">${message}</div>`);
}

function clearFieldError($field) {
    $field.removeClass('error');
    $field.siblings('.field-error').remove();
}

function clearFormMessages() {
    $('.field-error, .form-success, .form-error').remove();
    $('.error').removeClass('error');
}

async function submitServiceRequest() {
    const form = $('#service-form');
    const formData = {
        serviceType: $('#service-type').val(),
        customerName: $('#customer-name').val(),
        customerEmail: $('#customer-email').val(),
        customerPhone: $('#customer-phone').val(),
        serviceDescription: $('#service-description').val(),
        serviceUrgency: $('#service-urgency').val(),
        timestamp: new Date().toISOString(),
        source: 'public_website'
    };

    // Show loading state
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.prop('disabled', true).text('Enviando...');

    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormSuccess('¡Solicitud enviada correctamente! Te contactaremos pronto.');
        
        // Analytics
        trackEvent('service_request_submitted', {
            service_type: formData.serviceType,
            urgency: formData.serviceUrgency
        });

        // Close modal after delay
        setTimeout(() => {
            $('#modal-close').click();
        }, 3000);

    } catch (error) {
        console.error('Error submitting service request:', error);
        showFormError('Error al enviar la solicitud. Por favor intenta nuevamente.');
        
        trackEvent('service_request_error', {
            error_message: error.message
        });
    } finally {
        // Reset button
        submitBtn.prop('disabled', false).text(originalText);
    }
}

function showFormSuccess(message) {
    const form = $('#service-form');
    form.prepend(`<div class="form-success">${message}</div>`);
}

function showFormError(message) {
    const form = $('#service-form');
    form.prepend(`<div class="form-error">${message}</div>`);
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

/**
 * Scroll Animations
 */
function initializeScrollAnimations() {
    // Animate elements on scroll
    const animateOnScroll = () => {
        $('.service-card, .step-item, .testimonial-card, .area-card').each(function() {
            const $element = $(this);
            const elementTop = $element.offset().top;
            const elementBottom = elementTop + $element.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $element.addClass('animate-in');
            }
        });
    };

    // Initial check
    animateOnScroll();

    // On scroll
    $(window).on('scroll', debounce(animateOnScroll, 100));

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 500);
        }
    });
}

/**
 * Analytics
 */
function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'servicios',
        timestamp: new Date().toISOString()
    });

    // Track service card views
    $('.service-card').each(function() {
        const $card = $(this);
        const serviceType = $card.data('service');
        
        // Track when service comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('service_card_view', {
                        service_type: serviceType
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe($card[0]);
    });

    // Track CTA section view
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('cta_section_view', {
                    section: 'services_cta'
                });
                ctaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const ctaSection = $('.services-cta')[0];
    if (ctaSection) {
        ctaObserver.observe(ctaSection);
    }
}

function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }

    // Custom analytics (if needed)
    if (window.customAnalytics) {
        window.customAnalytics.track(eventName, properties);
    }

    console.log('Event tracked:', eventName, properties);
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Service Information Data
 */
const serviceInfo = {
    reparacion: {
        title: 'Reparación de Equipos',
        description: 'Diagnóstico y reparación especializada de todos tus dispositivos',
        features: [
            'Diagnóstico gratuito',
            'Reparación en el día',
            'Garantía de 6 meses',
            'Repuestos originales'
        ],
        basePrice: 299
    },
    soporte: {
        title: 'Soporte Técnico',
        description: 'Soporte técnico profesional 24/7 para resolver tus problemas',
        features: [
            'Soporte 24/7',
            'Remoto y presencial',
            'Técnicos certificados',
            'Respuesta inmediata'
        ],
        basePrice: 199
    },
    mantenimiento: {
        title: 'Mantenimiento Preventivo',
        description: 'Mantén tus equipos funcionando de manera óptima',
        features: [
            'Limpieza profunda',
            'Actualización de software',
            'Optimización de rendimiento',
            'Respaldo de datos'
        ],
        basePrice: 149
    },
    instalacion: {
        title: 'Instalación y Configuración',
        description: 'Instalación profesional y configuración completa',
        features: [
            'Configuración completa',
            'Migración de datos',
            'Capacitación incluida',
            'Documentación técnica'
        ],
        basePrice: 249
    },
    recuperacion: {
        title: 'Recuperación de Datos',
        description: 'Recuperación profesional de datos perdidos',
        features: [
            'Evaluación sin costo',
            'Alta tasa de éxito',
            'Confidencialidad garantizada',
            'Entrega en 24-48hrs'
        ],
        basePrice: 399
    },
    consultoria: {
        title: 'Consultoría IT',
        description: 'Consultoría especializada para optimizar tu infraestructura',
        features: [
            'Análisis de infraestructura',
            'Plan de modernización',
            'Optimización de costos',
            'Seguimiento continuo'
        ],
        basePrice: null // Cotización personalizada
    }
};

// Export service info for use in other modules
window.serviceInfo = serviceInfo;

/**
 * Handle dynamic content updates
 */
function updateServiceModalContent(serviceType) {
    if (serviceInfo[serviceType]) {
        const service = serviceInfo[serviceType];
        $('.modal-title').text(`Solicitar - ${service.title}`);
        $('#service-type').val(serviceType);
    }
}

// Make function available globally
window.updateServiceModalContent = updateServiceModalContent;
