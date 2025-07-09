// uwuTech Public Site JavaScript
// Funcionalidad específica para la página pública

$(document).ready(function() {
    // Inicializar funcionalidades específicas del sitio público
    initMobileMenu();
    initSearchFunctionality();
    initScrollEffects();
    initProductCarousel();
    
    // Configurar eventos específicos del sitio
    setupPublicSiteEvents();
});

/**
 * Configurar menú móvil
 */
function initMobileMenu() {
    // Toggle para el menú móvil
    $(document).on('click', '.mobile-menu-btn', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.mobile-menu').toggleClass('show');
        
        // Animación del botón hamburguesa
        const spans = $(this).find('span');
        if ($(this).hasClass('active')) {
            spans.eq(0).css('transform', 'rotate(45deg) translate(5px, 5px)');
            spans.eq(1).css('opacity', '0');
            spans.eq(2).css('transform', 'rotate(-45deg) translate(7px, -6px)');
        } else {
            spans.css('transform', '').css('opacity', '');
        }
    });
    
    // Cerrar menú móvil al hacer click en un enlace
    $(document).on('click', '.mobile-nav-link', function() {
        $('.mobile-menu-btn').removeClass('active');
        $('.mobile-menu').removeClass('show');
        $('.mobile-menu-btn span').css('transform', '').css('opacity', '');
    });
    
    // Cerrar menú móvil al redimensionar la ventana
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $('.mobile-menu-btn').removeClass('active');
            $('.mobile-menu').removeClass('show');
            $('.mobile-menu-btn span').css('transform', '').css('opacity', '');
        }
    });
}

/**
 * Configurar funcionalidad de búsqueda
 */
function initSearchFunctionality() {
    // Modal de búsqueda
    let searchModal = null;
    
    $(document).on('click', '.search-btn', function(e) {
        e.preventDefault();
        
        if (!searchModal) {
            createSearchModal();
        }
        
        searchModal.show();
        setTimeout(() => {
            searchModal.find('#search-input').focus();
        }, 100);
    });
    
    function createSearchModal() {
        searchModal = $(`
            <div class="search-modal" style="display: none;">
                <div class="search-overlay"></div>
                <div class="search-content">
                    <div class="search-header">
                        <input type="text" id="search-input" placeholder="¿Qué estás buscando?" autocomplete="off">
                        <button class="search-close">&times;</button>
                    </div>
                    <div class="search-results">
                        <div class="search-suggestions">
                            <h4>Búsquedas populares:</h4>
                            <div class="search-tags">
                                <span class="search-tag">Laptops</span>
                                <span class="search-tag">Gaming</span>
                                <span class="search-tag">Monitores</span>
                                <span class="search-tag">Teclados</span>
                                <span class="search-tag">Mouse</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        // Agregar estilos al modal
        $('head').append(`
            <style>
                .search-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                
                .search-content {
                    background: white;
                    max-width: 600px;
                    margin: 10vh auto 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: var(--shadow-xl);
                }
                
                .search-header {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                }
                
                #search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 18px;
                    padding: 0;
                }
                
                .search-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-color-muted);
                    margin-left: 15px;
                }
                
                .search-results {
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .search-suggestions h4 {
                    margin-bottom: 15px;
                    color: var(--text-color-primary);
                }
                
                .search-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .search-tag {
                    background: var(--background-light);
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: var(--transition-normal);
                }
                
                .search-tag:hover {
                    background: var(--btn-color-blue);
                    color: white;
                }
            </style>
        `);
        
        $('body').append(searchModal);
        
        // Eventos del modal
        searchModal.find('.search-close, .search-overlay').on('click', function() {
            searchModal.hide();
        });
        
        searchModal.find('.search-tag').on('click', function() {
            const tag = $(this).text();
            window.location.href = `./pages/productos.html?search=${encodeURIComponent(tag)}`;
        });
        
        // Búsqueda en tiempo real
        const debouncedSearch = debounce(function(query) {
            if (query.length > 2) {
                performSearch(query);
            }
        }, 300);
        
        searchModal.find('#search-input').on('input', function() {
            const query = $(this).val();
            debouncedSearch(query);
        });
        
        // Enter para buscar
        searchModal.find('#search-input').on('keypress', function(e) {
            if (e.which === 13) {
                const query = $(this).val();
                if (query.trim()) {
                    window.location.href = `./pages/productos.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    function performSearch(query) {
        // Simular resultados de búsqueda
        const mockResults = [
            { name: 'Laptop Dell Inspiron 15', price: '$2.499.000', category: 'Laptops' },
            { name: 'PC Gamer Custom', price: '$3.999.000', category: 'Computadores' },
            { name: 'Teclado Mecánico RGB', price: '$299.000', category: 'Periféricos' }
        ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        
        const resultsHtml = mockResults.map(item => `
            <div class="search-result-item">
                <span class="result-name">${item.name}</span>
                <span class="result-price">${item.price}</span>
            </div>
        `).join('');
        
        searchModal.find('.search-results').html(`
            <div class="search-results-list">
                <h4>Resultados para "${query}":</h4>
                ${resultsHtml || '<p>No se encontraron resultados</p>'}
            </div>
        `);
    }
}

/**
 * Configurar carousel de productos (si es necesario)
 */
function initProductCarousel() {
    // Funcionalidad para carrusel de productos en el futuro
    $('.products-grid').on('mouseenter', '.product-card', function() {
        $(this).find('.product-image').css('transform', 'scale(1.05)');
    }).on('mouseleave', '.product-card', function() {
        $(this).find('.product-image').css('transform', 'scale(1)');
    });
}

/**
 * Configurar eventos específicos del sitio público
 */
function setupPublicSiteEvents() {
    // Tracking de clics en productos
    $(document).on('click', '.product-card', function() {
        const productName = $(this).find('.product-name').text();
        
        // Google Analytics tracking (si está configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_click', {
                'product_name': productName,
                'page_location': window.location.href
            });
        }
    });
    
    // Tracking de clics en botones CTA
    $(document).on('click', '.btn-primary, .btn-secondary, .btn-pink', function() {
        const buttonText = $(this).text();
        const buttonHref = $(this).attr('href');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'button_text': buttonText,
                'button_url': buttonHref,
                'page_location': window.location.href
            });
        }
    });
    
    // Formulario de newsletter (si se agrega en el futuro)
    $(document).on('submit', '.newsletter-form', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        
        if (isValidEmail(email)) {
            // Simular suscripción exitosa
            showNotification('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas especiales.', 'success');
            $(this)[0].reset();
        } else {
            showNotification('Por favor ingresa un email válido', 'error');
        }
    });
    
    // Efecto parallax suave en el hero
    $(window).on('scroll', function() {
        const scrolled = $(this).scrollTop();
        const parallax = $('.hero');
        const speed = scrolled * 0.5;
        
        parallax.css('transform', `translateY(${speed}px)`);
    });
}

/**
 * Configurar lazy loading para imágenes (cuando se agreguen)
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}