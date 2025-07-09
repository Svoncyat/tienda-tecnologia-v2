/**
 * Contact Page JavaScript
 * Handles contact form, FAQ interactions, and communication methods
 */

$(document).ready(function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeMethodButtons();
    initializeFAQ();
    initializeLocationFeatures();
    initializeFormValidation();
    initializeAnalytics();
}

/**
 * Contact Form Functionality
 */
function initializeContactForm() {
    const form = $('#contact-form');

    // Form submission
    form.on('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });

    // Form reset
    form.on('reset', function() {
        clearFormMessages();
        setTimeout(() => {
            resetFormValidation();
        }, 100);
    });

    // Real-time validation
    form.find('input, select, textarea').on('blur', function() {
        validateContactField($(this));
    });

    // Character counter for message field
    const messageField = $('#contact-message');
    const maxLength = 1000;
    
    messageField.after(`<div class="char-counter">0/${maxLength} caracteres</div>`);
    
    messageField.on('input', function() {
        const length = $(this).val().length;
        $(this).siblings('.char-counter').text(`${length}/${maxLength} caracteres`);
        
        if (length > maxLength * 0.9) {
            $(this).siblings('.char-counter').addClass('warning');
        } else {
            $(this).siblings('.char-counter').removeClass('warning');
        }
    });
}

/**
 * Method Button Handlers
 */
function initializeMethodButtons() {
    // Phone button
    $('[data-method="phone"]').on('click', function() {
        window.location.href = 'tel:+5551234567';
        trackEvent('contact_method_click', {
            method: 'phone',
            location: 'method_card'
        });
    });

    // Email button
    $('[data-method="email"]').on('click', function() {
        window.location.href = 'mailto:info@uwutech.com?subject=Consulta desde sitio web';
        trackEvent('contact_method_click', {
            method: 'email',
            location: 'method_card'
        });
    });

    // WhatsApp button
    $('[data-method="whatsapp"]').on('click', function() {
        const message = encodeURIComponent('Hola, me gustaría obtener información sobre sus servicios técnicos.');
        window.open(`https://wa.me/5551234567?text=${message}`, '_blank');
        trackEvent('contact_method_click', {
            method: 'whatsapp',
            location: 'method_card'
        });
    });

    // Live chat button
    $('[data-method="livechat"]').on('click', function() {
        // Initialize live chat widget (replace with actual implementation)
        initializeLiveChat();
        trackEvent('contact_method_click', {
            method: 'livechat',
            location: 'method_card'
        });
    });

    // Directions button
    $('#directions-btn').on('click', function() {
        const address = encodeURIComponent('Av. Tecnología 123, Piso 5, Ciudad de México, CDMX');
        window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
        trackEvent('location_action', {
            action: 'get_directions'
        });
    });

    // Appointment button
    $('#appointment-btn').on('click', function() {
        // Open appointment modal or redirect to scheduling system
        openAppointmentModal();
        trackEvent('location_action', {
            action: 'schedule_appointment'
        });
    });

    // Load map button
    $('#load-map').on('click', function() {
        loadGoogleMaps();
        trackEvent('map_interaction', {
            action: 'load_map'
        });
    });
}

/**
 * FAQ Functionality
 */
function initializeFAQ() {
    $('.faq-question').on('click', function() {
        const faqItem = $(this).parent();
        const faqAnswer = faqItem.find('.faq-answer');
        const isActive = faqItem.hasClass('active');

        // Close all other FAQ items
        $('.faq-item.active').not(faqItem).removeClass('active').find('.faq-answer').slideUp(300);

        // Toggle current item
        if (isActive) {
            faqItem.removeClass('active');
            faqAnswer.slideUp(300);
        } else {
            faqItem.addClass('active');
            faqAnswer.slideDown(300);
        }

        // Analytics
        trackEvent('faq_interaction', {
            question: $(this).text().replace(/\+|\-/g, '').trim(),
            action: isActive ? 'close' : 'open'
        });
    });
}

/**
 * Location Features
 */
function initializeLocationFeatures() {
    // Animate location features on scroll
    const observeLocationFeatures = () => {
        const features = $('.feature-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        $(entry.target).addClass('animate-in');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        features.each(function() {
            observer.observe(this);
        });
    };

    observeLocationFeatures();
}

/**
 * Form Validation
 */
function validateContactForm() {
    let isValid = true;
    const form = $('#contact-form');
    
    clearFormMessages();

    // Validate required fields
    form.find('[required]').each(function() {
        if (!validateContactField($(this))) {
            isValid = false;
        }
    });

    // Validate email format
    const email = $('#contact-email');
    if (email.val() && !isValidEmail(email.val())) {
        showFieldError(email, 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    }

    // Validate phone format (if provided)
    const phone = $('#contact-phone');
    if (phone.val() && !isValidPhone(phone.val())) {
        showFieldError(phone, 'Por favor ingresa un número de teléfono válido');
        isValid = false;
    }

    // Validate message length
    const message = $('#contact-message');
    if (message.val().length > 1000) {
        showFieldError(message, 'El mensaje no puede exceder 1000 caracteres');
        isValid = false;
    }

    return isValid;
}

function validateContactField($field) {
    const value = $field.val().trim();
    const fieldName = $field.attr('name');
    
    clearFieldError($field);

    if ($field.prop('required') && !value) {
        showFieldError($field, 'Este campo es requerido');
        return false;
    }

    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError($field, 'Formato de correo inválido');
        return false;
    }

    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        showFieldError($field, 'Formato de teléfono inválido');
        return false;
    }

    if (fieldName === 'message' && value.length > 1000) {
        showFieldError($field, 'Máximo 1000 caracteres');
        return false;
    }

    return true;
}

function showFieldError($field, message) {
    $field.closest('.form-group').addClass('error');
    
    // Remove existing error message
    $field.siblings('.field-error').remove();
    
    // Add error message
    $field.after(`<div class="field-error">${message}</div>`);
}

function clearFieldError($field) {
    $field.closest('.form-group').removeClass('error');
    $field.siblings('.field-error').remove();
}

function clearFormMessages() {
    $('.field-error, .form-success, .form-error').remove();
    $('.form-group.error').removeClass('error');
}

function resetFormValidation() {
    clearFormMessages();
    $('.char-counter').text('0/1000 caracteres').removeClass('warning');
}

/**
 * Form Submission
 */
async function submitContactForm() {
    const form = $('#contact-form');
    const formData = {
        name: $('#contact-name').val(),
        email: $('#contact-email').val(),
        phone: $('#contact-phone').val(),
        subject: $('#contact-subject').val(),
        message: $('#contact-message').val(),
        urgency: $('#contact-urgency').val(),
        newsletter: $('#contact-newsletter').is(':checked'),
        privacy: $('#contact-privacy').is(':checked'),
        timestamp: new Date().toISOString(),
        source: 'contact_form',
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };

    // Show loading state
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.prop('disabled', true).text('Enviando...');
    form.addClass('loading');

    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormSuccess('¡Mensaje enviado correctamente! Te contactaremos pronto.');
        
        // Reset form
        form[0].reset();
        resetFormValidation();

        // Analytics
        trackEvent('contact_form_submitted', {
            subject: formData.subject,
            urgency: formData.urgency,
            newsletter_signup: formData.newsletter
        });

        // Show thank you message with next steps
        setTimeout(() => {
            showFormSuccess(
                '¡Gracias por contactarnos! Recibirás una confirmación por email y nuestro equipo se pondrá en contacto contigo dentro de las próximas 24 horas.'
            );
        }, 3000);

    } catch (error) {
        console.error('Error submitting contact form:', error);
        showFormError('Error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por teléfono.');
        
        trackEvent('contact_form_error', {
            error_message: error.message,
            subject: formData.subject
        });
    } finally {
        // Reset button and form state
        submitBtn.prop('disabled', false).text(originalText);
        form.removeClass('loading');
    }
}

function showFormSuccess(message) {
    const form = $('#contact-form');
    form.prepend(`<div class="form-success">${message}</div>`);
    
    // Scroll to message
    $('html, body').animate({
        scrollTop: form.offset().top - 100
    }, 500);
}

function showFormError(message) {
    const form = $('#contact-form');
    form.prepend(`<div class="form-error">${message}</div>`);
    
    // Scroll to message
    $('html, body').animate({
        scrollTop: form.offset().top - 100
    }, 500);
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
 * External Integrations
 */
function initializeLiveChat() {
    // Initialize live chat widget
    if (window.LiveChatWidget) {
        window.LiveChatWidget.call('maximize');
    } else {
        // Show modal with chat options if live chat not available
        showModal('Chat en Vivo', 
            'El chat en vivo no está disponible en este momento. Por favor contáctanos por WhatsApp o teléfono para atención inmediata.',
            [
                {
                    text: 'WhatsApp',
                    action: () => {
                        const message = encodeURIComponent('Hola, necesito soporte técnico urgente.');
                        window.open(`https://wa.me/5551234567?text=${message}`, '_blank');
                    }
                },
                {
                    text: 'Llamar',
                    action: () => {
                        window.location.href = 'tel:+5551234567';
                    }
                }
            ]
        );
    }
}

function loadGoogleMaps() {
    const mapContainer = $('.map-placeholder');
    const mapContent = `
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.669!2d-99.1332!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI1JzU3LjQiTiA5OcKwMDcnNTkuNSJX!5e0!3m2!1sen!2smx!4v1620000000000!5m2!1sen!2smx"
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;
    
    mapContainer.html(mapContent);
}

function openAppointmentModal() {
    const modalContent = `
        <div class="appointment-modal">
            <h3>Agendar Cita</h3>
            <p>Para agendar una cita presencial, por favor contáctanos:</p>
            <div class="appointment-options">
                <button class="btn btn-primary" onclick="window.location.href='tel:+5551234567'">
                    📞 Llamar (555) 123-4567
                </button>
                <button class="btn btn-outline" onclick="window.open('https://wa.me/5551234567?text=Hola, me gustaría agendar una cita', '_blank')">
                    💬 WhatsApp
                </button>
                <button class="btn btn-outline" onclick="window.location.href='mailto:info@uwutech.com?subject=Solicitud de cita'">
                    ✉️ Email
                </button>
            </div>
            <p class="appointment-note">
                <strong>Horarios disponibles:</strong><br>
                Lun - Vie: 8:00 AM - 8:00 PM<br>
                Sáb: 9:00 AM - 6:00 PM
            </p>
        </div>
    `;
    
    showModal('Agendar Cita', modalContent);
}

function showModal(title, content, buttons = []) {
    const modal = $(`
        <div class="simple-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
        ">
            <div class="simple-modal-content" style="
                background: white;
                border-radius: var(--border-radius-lg);
                max-width: 500px;
                width: 100%;
                padding: var(--spacing-2xl);
                text-align: center;
            ">
                <h3 style="margin-bottom: var(--spacing-lg);">${title}</h3>
                <div class="modal-body">${content}</div>
                <div class="modal-actions" style="margin-top: var(--spacing-lg);">
                    ${buttons.map(btn => `<button class="btn btn-outline" onclick="${btn.action}">${btn.text}</button>`).join('')}
                    <button class="btn btn-primary close-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    
    modal.find('.close-modal, .simple-modal').on('click', function(e) {
        if (e.target === this) {
            modal.remove();
        }
    });
}

/**
 * Analytics
 */
function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'contacto',
        timestamp: new Date().toISOString()
    });

    // Track form field interactions
    $('#contact-form input, #contact-form select, #contact-form textarea').on('focus', function() {
        trackEvent('form_field_focus', {
            field_name: $(this).attr('name') || $(this).attr('id'),
            field_type: $(this).prop('tagName').toLowerCase()
        });
    });

    // Track FAQ views
    $('.faq-item').each(function(index) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('faq_item_view', {
                        faq_index: index,
                        faq_question: $(entry.target).find('.faq-question').text().replace(/\+|\-/g, '').trim()
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this);
    });

    // Track social media clicks
    $('.social-link').on('click', function() {
        trackEvent('social_media_click', {
            platform: $(this).data('platform'),
            location: 'contact_info'
        });
    });
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
 * Page-specific enhancements
 */
$(window).on('load', function() {
    // Add character counter styles
    $('head').append(`
        <style>
            .char-counter {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                text-align: right;
                margin-top: var(--spacing-xs);
            }
            .char-counter.warning {
                color: var(--color-warning);
                font-weight: var(--font-weight-medium);
            }
            .feature-item {
                opacity: 0;
                transform: translateX(-20px);
                transition: all 0.6s ease-out;
            }
            .feature-item.animate-in {
                opacity: 1;
                transform: translateX(0);
            }
            .appointment-options {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
                margin: var(--spacing-lg) 0;
            }
            .appointment-note {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                margin-top: var(--spacing-lg);
                text-align: left;
            }
        </style>
    `);
});

// Export functions for external use
window.contactPageFunctions = {
    validateContactForm,
    submitContactForm,
    initializeLiveChat,
    openAppointmentModal,
    trackEvent
};
