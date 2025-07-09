// uwuTech Global JavaScript
// Sistema de carga de componentes reutilizables

$(document).ready(function() {
    console.log('🚀 Iniciando sistema de componentes...');
    
    // Cargar componentes automáticamente
    loadComponents();
    
    // Cargar modales de autenticación automáticamente
    loadAuthModals();
    
    // Inicializar animaciones
    initAnimations();
    
    // Inicializar sistema de modales
    initModals();
});

/**
 * Sistema de carga de componentes dinámicos
 * Busca elementos con data-component y carga el HTML correspondiente
 */
function loadComponents() {
    const componentsToLoad = $('[data-component]');
    let loadedComponents = 0;
    
    if (componentsToLoad.length === 0) {
        console.log('📝 No hay componentes para cargar');
        return;
    }
    
    console.log(`📋 Iniciando carga de ${componentsToLoad.length} componentes...`);
    
    componentsToLoad.each(function() {
        const $element = $(this);
        const componentName = $element.data('component');
        const app = $element.data('app') || 'public-site';
        
        console.log(`🔄 Cargando componente: ${componentName}`);
        
        // Detectar la profundidad basada en la ubicación del archivo HTML actual
        const currentPath = window.location.pathname;
        const pathDepth = getPathDepth(currentPath);
        
        console.log(`📍 Path actual: ${currentPath}, Profundidad calculada: ${pathDepth}`);
        
        // Construir la ruta del componente
        const componentPath = pathDepth > 0 
            ? `../components/${componentName}.html`
            : `./components/${componentName}.html`;
        
        console.log(`📂 Intentando cargar desde: ${componentPath}`);
        
        // Cargar el componente
        $.get(componentPath)
            .done(function(data) {
                console.log(`✅ Componente ${componentName} cargado, aplicando ajustes de ruta...`);
                // Ajustar todas las rutas relativas según la profundidad
                const adjustedData = adjustRelativePaths(data, pathDepth);
                $element.html(adjustedData);
                $element.trigger('component:loaded', [componentName]);
                console.log(`🎯 Componente ${componentName} insertado exitosamente`);
                
                // Verificar y corregir imágenes en este componente específico
                verifyComponentImages($element, pathDepth);
                
                // Incrementar contador y verificar si todos los componentes están cargados
                loadedComponents++;
                if (loadedComponents === componentsToLoad.length) {
                    console.log('🎉 Todos los componentes han sido cargados exitosamente');
                    $(document).trigger('all-components:loaded');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.warn(`⚠️ No se pudo cargar el componente: ${componentName} desde ${componentPath}`);
                console.warn(`Error: ${textStatus} - ${errorThrown}`);
                // Intentar con la ruta alternativa
                const altPath = pathDepth > 0 
                    ? `./components/${componentName}.html`
                    : `../components/${componentName}.html`;
                
                console.log(`🔄 Intentando ruta alternativa: ${altPath}`);
                
                $.get(altPath)
                    .done(function(data) {
                        console.log(`✅ Componente ${componentName} cargado desde ruta alternativa`);
                        // Ajustar rutas para la ruta alternativa
                        const altDepth = pathDepth > 0 ? 0 : 1;
                        const adjustedData = adjustRelativePaths(data, altDepth);
                        $element.html(adjustedData);
                        $element.trigger('component:loaded', [componentName]);
                        console.log(`🎯 Componente ${componentName} insertado desde ruta alternativa`);
                        
                        // Verificar y corregir imágenes en este componente específico
                        verifyComponentImages($element, altDepth);
                        
                        // Incrementar contador y verificar si todos los componentes están cargados
                        loadedComponents++;
                        if (loadedComponents === componentsToLoad.length) {
                            console.log('🎉 Todos los componentes han sido cargados exitosamente');
                            $(document).trigger('all-components:loaded');
                        }
                    })
                    .fail(function() {
                        console.error(`❌ No se pudo cargar el componente ${componentName} desde ninguna ruta`);
                        $element.html(`<div style="color: red; padding: 10px; border: 1px solid red;">Error: No se pudo cargar el componente "${componentName}"</div>`);
                        
                        // Incrementar contador incluso en caso de error
                        loadedComponents++;
                        if (loadedComponents === componentsToLoad.length) {
                            console.log('🎉 Proceso de carga de componentes completado (con algunos errores)');
                            $(document).trigger('all-components:loaded');
                        }
                    });
            });
    });
}

/**
 * Detectar la profundidad del path actual
 * @param {string} path - La ruta actual
 * @returns {number} - La profundidad (0 para root, 1 para /pages/, etc.)
 */
function getPathDepth(path) {
    // Remover archivo y parámetros de query
    const cleanPath = path.split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(segment => segment.length > 0);
    
    // Si termina en .html, remover el archivo del conteo
    if (segments.length > 0 && segments[segments.length - 1].endsWith('.html')) {
        segments.pop();
    }
    
    // Buscar específicamente la carpeta 'pages' o similares
    if (segments.includes('pages')) {
        return 1;
    }
    
    // Para archivos servidos desde file://, contar segmentos después de 'public-site'
    const publicSiteIndex = segments.findIndex(segment => segment === 'public-site');
    if (publicSiteIndex >= 0) {
        return segments.length - publicSiteIndex - 1;
    }
      return 0;
}

/**
 * Verificar imágenes en un componente específico (solo logging)
 * @param {jQuery} $component - El elemento del componente cargado
 * @param {number} pathDepth - La profundidad de la ruta actual
 */
function verifyComponentImages($component, pathDepth) {
    const images = $component.find('img[src*="assets"]');
    
    if (images.length === 0) {
        console.log('📸 No hay imágenes con assets en este componente');
        return;
    }
    
    console.log(`🔍 Verificando ${images.length} imágenes en el componente (solo logging)...`);
    
    images.each(function(index, img) {
        const $img = $(img);
        const src = $img.attr('src');
        
        console.log(`🖼️ Imagen ${index + 1}: ${src}`);
        
        // Crear una nueva imagen para testear si carga
        const testImg = new Image();
        testImg.onload = function() {
            console.log(`✅ Imagen ${index + 1} carga correctamente`);
        };
        testImg.onerror = function() {
            console.error(`❌ Error cargando imagen ${index + 1}: ${src}`);
            console.error(`⚠️ La función adjustRelativePaths debería haber corregido esta ruta`);
        };
        testImg.src = src;
    });
}



/**
 * Ajustar todas las rutas relativas en el HTML según la profundidad
 * @param {string} html - El HTML del componente
 * @param {number} depth - La profundidad actual (0 = root, 1 = pages/, etc.)
 * @returns {string} - El HTML con rutas ajustadas
 */
function adjustRelativePaths(html, depth) {
    console.log(`🔧 Iniciando ajuste de rutas para profundidad ${depth}`);
    console.log(`📄 HTML original (excerpt):`, html.substring(0, 200) + '...');
    
    let adjustedHtml = html;
    const backPath = '../'.repeat(depth + 1); // +1 porque siempre necesitamos salir del directorio components
    
    console.log(`🎯 BackPath calculado: "${backPath}"`);
    console.log(`📊 Esperamos que las rutas de assets sean: "${backPath}shared/assets/"`);
    
    // Función auxiliar para hacer el reemplazo y loguearlo
    function replaceAndLog(pattern, replacement, description) {
        const matches = adjustedHtml.match(pattern);
        if (matches && matches.length > 0) {
            console.log(`  🔍 ${description}: ${matches.length} coincidencias encontradas`);
            console.log(`     Primer ejemplo: "${matches[0]}"`);
            adjustedHtml = adjustedHtml.replace(pattern, replacement);
            console.log(`     Reemplazado por: "${replacement}"`);
            return matches.length;
        } else {
            console.log(`  ⭕ ${description}: No se encontraron coincidencias`);
            return 0;
        }
    }
    
    let totalChanges = 0;
    
    // Ajustar rutas de assets (imágenes, iconos, etc.)
    console.log(`\n📸 === AJUSTANDO RUTAS DE ASSETS ===`);
    
    // Reemplazar cualquier variante de ruta de assets por la ruta correcta
    totalChanges += replaceAndLog(
        /src="(?:\.\/|\.\.\/)*shared\/assets\//g,
        `src="${backPath}shared/assets/`,
        'src de assets'
    );
    
    totalChanges += replaceAndLog(
        /href="(?:\.\/|\.\.\/)*shared\/assets\//g,
        `href="${backPath}shared/assets/`,
        'href de assets'
    );
    
    totalChanges += replaceAndLog(
        /content="(?:\.\/|\.\.\/)*shared\/assets\//g,
        `content="${backPath}shared/assets/`,
        'content de assets'
    );
    
    // Ajustar rutas de CSS y JS
    console.log(`\n🎨 === AJUSTANDO RUTAS DE CSS/JS ===`);
    
    totalChanges += replaceAndLog(
        /href="(?:\.\/|\.\.\/)*shared\/css\//g,
        `href="${backPath}shared/css/`,
        'CSS compartido'
    );
    
    totalChanges += replaceAndLog(
        /src="(?:\.\/|\.\.\/)*shared\/js\//g,
        `src="${backPath}shared/js/`,
        'JS compartido'
    );
    
    // Ajustar enlaces de navegación
    console.log(`\n🧭 === AJUSTANDO ENLACES DE NAVEGACIÓN ===`);
    
    const navBackPath = '../'.repeat(depth);
    
    if (depth === 0) {
        // Desde raíz hacia páginas
        totalChanges += replaceAndLog(
            /href="(?:\.\/)?pages\//g,
            'href="./pages/',
            'Enlaces a páginas desde raíz'
        );
        
        totalChanges += replaceAndLog(
            /href="(?:\.\/)?index\.html"/g,
            'href="index.html"',
            'Enlaces a index desde raíz'
        );
    } else {
        // Desde páginas hacia otras páginas o raíz
        totalChanges += replaceAndLog(
            /href="(?:\.\/|\.\.\/)*pages\//g,
            `href="${navBackPath}pages/`,
            'Enlaces a páginas desde subdirectorio'
        );
        
        totalChanges += replaceAndLog(
            /href="(?:\.\/|\.\.\/)*index\.html"/g,
            `href="${navBackPath}index.html"`,            'Enlaces a index desde subdirectorio'
        );    }
    
    console.log(`\n🎯 === RESUMEN ===`);
    console.log(`Total de cambios realizados: ${totalChanges}`);
    console.log(`HTML final (excerpt):`, adjustedHtml.substring(0, 200) + '...');
    console.log(`==================`);
    
    return adjustedHtml;
}

/**
 * Cargar modales de autenticación automáticamente
 */
function loadAuthModals() {
    console.log('🔐 Cargando modales de autenticación...');
    
    const currentPath = window.location.pathname;
    const pathDepth = getPathDepth(currentPath);
    
    // Construir la ruta a los modales
    const modalsPath = pathDepth > 0 
        ? `../components/auth-modals.html`
        : `./components/auth-modals.html`;
    
    console.log(`📂 Cargando modales desde: ${modalsPath}`);
    
    $.get(modalsPath)
        .done(function(data) {
            console.log('✅ Modales de autenticación cargados');
            // Los modales no necesitan ajuste de rutas ya que son solo HTML/CSS/JS
            $('body').append(data);
            console.log('🎯 Modales insertados en el body');
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.warn(`⚠️ No se pudieron cargar los modales desde ${modalsPath}`);
            console.warn(`Error: ${textStatus} - ${errorThrown}`);
        });
}

/**
 * Inicializar sistema de modales
 */
function initModals() {
    console.log('🎭 Inicializando sistema de modales...');
    
    // Función para abrir modal
    function openModal(modalId) {
        const modal = $(`#${modalId}`);
        if (modal.length) {
            modal.addClass('show');
            $('body').addClass('modal-open');
            console.log(`🎭 Modal abierto: ${modalId}`);
        }
    }
    
    // Función para cerrar modal
    function closeModal(modalId) {
        const modal = $(`#${modalId}`);
        if (modal.length) {
            modal.removeClass('show');
            $('body').removeClass('modal-open');
            console.log(`🎭 Modal cerrado: ${modalId}`);
        }
    }
    
    // Event listener para botones que abren modales
    $(document).on('click', '[data-modal]', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal');
        openModal(modalId);
    });
    
    // Event listener para cerrar modales
    $(document).on('click', '.modal-close', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal');
        closeModal(modalId);
    });
    
    // Cerrar modal al hacer clic en el overlay
    $(document).on('click', '.modal', function(e) {
        if (e.target === this) {
            const modalId = $(this).attr('id');
            closeModal(modalId);
        }
    });
    
    // Cerrar modal con la tecla Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.modal.show').each(function() {
                const modalId = $(this).attr('id');
                closeModal(modalId);
            });
        }
    });
    
    // Event listeners específicos para los modales de auth
    $(document).on('click', '#show-register-modal', function(e) {
        e.preventDefault();
        closeModal('login-modal');
        openModal('register-modal');
    });
    
    $(document).on('click', '#show-login-modal', function(e) {
        e.preventDefault();
        closeModal('register-modal');
        openModal('login-modal');
    });
    
    $(document).on('click', '#forgot-password-link', function(e) {
        e.preventDefault();
        closeModal('login-modal');
        openModal('password-recovery-modal');
    });
    
    $(document).on('click', '#back-to-login', function(e) {
        e.preventDefault();
        closeModal('password-recovery-modal');
        openModal('login-modal');
    });
}

/**
 * Inicializar animaciones de scroll
 */
function initAnimations() {
    // Observador de intersección para animaciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos con la clase animate-on-scroll
    $('.animate-on-scroll').each(function() {
        observer.observe(this);
    });
}

/**
 * Utilidad para mostrar notificaciones
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = $(`
        <div class="notification notification-${type}">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto-ocultar después del tiempo especificado
    setTimeout(() => {
        notification.addClass('notification-hide');
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Cerrar al hacer click en X
    notification.find('.notification-close').on('click', function() {
        notification.addClass('notification-hide');
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Utilidad para validar formularios
 */
function validateForm(formElement) {
    let isValid = true;
    const $form = $(formElement);
    
    // Limpiar errores previos
    $form.find('.field-error').removeClass('field-error');
    $form.find('.error-message').remove();
    
    // Validar campos requeridos
    $form.find('[required]').each(function() {
        const $field = $(this);
        const value = $field.val().trim();
        
        if (!value) {
            showFieldError($field, 'Este campo es requerido');
            isValid = false;
        }
    });
    
    // Validar emails
    $form.find('input[type="email"]').each(function() {
        const $field = $(this);
        const email = $field.val().trim();
        
        if (email && !isValidEmail(email)) {
            showFieldError($field, 'Por favor ingresa un email válido');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Mostrar error en un campo específico
 */
function showFieldError($field, message) {
    $field.addClass('field-error');
    $field.after(`<div class="error-message">${message}</div>`);
}

/**
 * Validar formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth scroll para enlaces internos
 */
$(document).on('click', 'a[href^="#"]', function(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    
    if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - 80
        }, 800);
    }
});

/**
 * Utilidad para formatear números como moneda
 */
function formatCurrency(amount, currency = 'COP') {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Debounce para optimizar eventos de búsqueda
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