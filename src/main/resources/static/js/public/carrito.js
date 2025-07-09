/**
 * Página del Carrito de Compras
 * Gestión y visualización del carrito de compras
 */

$(document).ready(function() {
    initCartPage();
});

function initCartPage() {
    // Cargar contenido del carrito
    loadCartItems();
    
    // Event listeners
    setupCartEventListeners();
    
    // Cargar recomendaciones
    loadRecommendations();
    
    // Actualizar contadores en header
    updateHeaderCounters();
}

function setupCartEventListeners() {
    // Vaciar carrito
    $('#clear-cart-btn').on('click', function() {
        if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
            window.cartManager.clear();
            loadCartItems();
            window.notificationManager.info('Carrito vaciado');
        }
    });
    
    // Proceder al pago
    $('#checkout-btn').on('click', function() {
        if (!window.authManager.isAuthenticated()) {
            window.notificationManager.warning('Debes iniciar sesión para continuar con la compra');
            $('#login-modal').addClass('modal-active');
            return;
        }
        
        const cartItems = window.cartManager.getItems();
        if (cartItems.length === 0) {
            window.notificationManager.warning('Tu carrito está vacío');
            return;
        }
        
        // Redirigir al checkout (por ahora simulamos)
        window.notificationManager.info('Redirigiendo al proceso de pago...', 2000);
        setTimeout(() => {
            // window.location.href = 'checkout.html';
            console.log('Proceder al checkout con items:', cartItems);
        }, 2000);
    });
    
    // Aplicar código promocional
    $('#apply-promo-btn').on('click', function() {
        const promoCode = $('#promo-code').val().trim();
        if (promoCode) {
            applyPromoCode(promoCode);
        } else {
            window.notificationManager.warning('Ingresa un código promocional válido');
        }
    });
    
    // Enter en código promocional
    $('#promo-code').on('keypress', function(e) {
        if (e.which === 13) {
            $('#apply-promo-btn').click();
        }
    });
}

function loadCartItems() {
    const cartItems = window.cartManager.getItems();
    const $container = $('#cart-items-container');
    const $emptyCart = $('#empty-cart');
    const $cartSummary = $('#cart-summary');
    const $continueShoppingBtn = $('#continue-shopping');
    
    if (cartItems.length === 0) {
        $container.hide();
        $cartSummary.hide();
        $continueShoppingBtn.hide();
        $emptyCart.show();
        return;
    }
    
    $emptyCart.hide();
    $container.show();
    $cartSummary.show();
    $continueShoppingBtn.show();
    
    // Renderizar items del carrito
    $container.html('');
    cartItems.forEach(item => {
        const $cartItem = createCartItemElement(item);
        $container.append($cartItem);
    });
    
    // Actualizar resumen
    updateCartSummary();
}

function createCartItemElement(item) {
    const totalPrice = item.price * item.quantity;
    
    return $(`
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-brand">${item.brand}</p>
                <div class="cart-item-specs">
                    ${item.specs ? item.specs.slice(0, 2).map(spec => `<span class="spec-tag">${spec}</span>`).join('') : ''}
                </div>
            </div>
            <div class="cart-item-price">
                <span class="current-price">S/ ${item.price.toFixed(2)}</span>
                ${item.originalPrice && item.originalPrice > item.price ? 
                    `<span class="original-price">S/ ${item.originalPrice.toFixed(2)}</span>` : ''
                }
            </div>
            <div class="cart-item-quantity">
                <div class="quantity-controls">
                    <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">−</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                    <button class="quantity-btn quantity-increase" data-product-id="${item.id}">+</button>
                </div>
                <span class="stock-info">${item.stock ? `${item.stock} disponibles` : 'En stock'}</span>
            </div>
            <div class="cart-item-total">
                <span class="item-total">S/ ${totalPrice.toFixed(2)}</span>
            </div>
            <div class="cart-item-actions">
                <button class="btn-icon btn-remove" data-product-id="${item.id}" title="Eliminar del carrito">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6 v14 a2,2 0 0,1 -2,2 H7 a2,2 0 0,1 -2,-2 V6 m3,0 V4 a2,2 0 0,1 2,-2 h4 a2,2 0 0,1 2,2 v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <button class="btn-icon btn-favorite ${window.favoritesManager.isFavorite(item.id) ? 'active' : ''}" 
                        data-product-id="${item.id}" title="Añadir a favoritos">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `);
}

function updateCartSummary() {
    const cartItems = window.cartManager.getItems();
    const summary = window.cartManager.getSummary();
    
    // Actualizar contadores y totales
    $('#items-count').text(summary.totalItems);
    $('#subtotal-amount').text(`S/ ${summary.subtotal.toFixed(2)}`);
    $('#total-amount').text(`S/ ${summary.total.toFixed(2)}`);
    
    // Calcular envío
    const shippingCost = summary.subtotal >= 500 ? 0 : 25;
    $('#shipping-amount').text(shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`);
    
    // Mostrar descuentos si los hay
    const discount = summary.discount || 0;
    $('#discount-amount').text(discount > 0 ? `-S/ ${discount.toFixed(2)}` : '-S/ 0.00');
    
    // Actualizar total final incluyendo envío
    const finalTotal = summary.total + shippingCost;
    $('#total-amount').text(`S/ ${finalTotal.toFixed(2)}`);
}

// Event delegation para botones dinámicos
$(document).on('click', '.quantity-decrease', function() {
    const productId = $(this).data('product-id');
    const currentQuantity = window.cartManager.getQuantity(productId);
    if (currentQuantity > 1) {
        window.cartManager.updateQuantity(productId, currentQuantity - 1);
        loadCartItems();
        updateHeaderCounters();
    }
});

$(document).on('click', '.quantity-increase', function() {
    const productId = $(this).data('product-id');
    const currentQuantity = window.cartManager.getQuantity(productId);
    window.cartManager.updateQuantity(productId, currentQuantity + 1);
    loadCartItems();
    updateHeaderCounters();
});

$(document).on('change', '.quantity-input', function() {
    const productId = $(this).data('product-id');
    const newQuantity = parseInt($(this).val());
    if (newQuantity >= 1 && newQuantity <= 99) {
        window.cartManager.updateQuantity(productId, newQuantity);
        loadCartItems();
        updateHeaderCounters();
    } else {
        $(this).val(window.cartManager.getQuantity(productId));
    }
});

$(document).on('click', '.btn-remove', function() {
    const productId = $(this).data('product-id');
    const item = window.cartManager.getItem(productId);
    if (confirm(`¿Eliminar "${item.name}" del carrito?`)) {
        window.cartManager.removeItem(productId);
        window.notificationManager.info(`"${item.name}" eliminado del carrito`);
        loadCartItems();
        updateHeaderCounters();
    }
});

$(document).on('click', '.btn-favorite', function() {
    const productId = $(this).data('product-id');
    const cartItem = window.cartManager.getItem(productId);
    
    if (window.favoritesManager.isFavorite(productId)) {
        window.favoritesManager.removeFavorite(productId);
        $(this).removeClass('active');
        window.notificationManager.favoriteRemoved(cartItem.name);
    } else {
        // Convertir item del carrito a formato de favorito
        const favoriteItem = {
            id: cartItem.id,
            name: cartItem.name,
            brand: cartItem.brand,
            price: cartItem.price,
            originalPrice: cartItem.originalPrice,
            image: cartItem.image,
            category: cartItem.category || 'general',
            specs: cartItem.specs || []
        };
        window.favoritesManager.addFavorite(favoriteItem);
        $(this).addClass('active');
        window.notificationManager.favoriteAdded(cartItem.name);
    }
    
    updateHeaderCounters();
});

function applyPromoCode(code) {
    // Simular validación de código promocional
    const validCodes = {
        'UWUTECH10': { type: 'percentage', value: 0.10, description: '10% de descuento' },
        'BIENVENIDO': { type: 'fixed', value: 50, description: 'S/ 50 de descuento' },
        'ENVIOGRATIS': { type: 'shipping', value: 0, description: 'Envío gratuito' }
    };
    
    const promo = validCodes[code.toUpperCase()];
    
    if (promo) {
        window.notificationManager.success(`Código aplicado: ${promo.description}`);
        // Aquí se aplicaría el descuento real
        updateCartSummary();
        $('#promo-code').val('');
    } else {
        window.notificationManager.error('Código promocional no válido');
    }
}

function loadRecommendations() {
    // Simular productos recomendados
    const recommendations = [
        {
            id: 'rec1',
            name: 'Mouse Gaming RGB',
            brand: 'Logitech',
            price: 89.90,
            image: '/api/placeholder/200/200',
            category: 'peripherals'
        },
        {
            id: 'rec2',
            name: 'Teclado Mecánico',
            brand: 'Corsair',
            price: 159.90,
            image: '/api/placeholder/200/200',
            category: 'peripherals'
        },
        {
            id: 'rec3',
            name: 'Auriculares Gaming',
            brand: 'HyperX',
            price: 199.90,
            image: '/api/placeholder/200/200',
            category: 'peripherals'
        },
        {
            id: 'rec4',
            name: 'Monitor 24" Full HD',
            brand: 'ASUS',
            price: 599.90,
            image: '/api/placeholder/200/200',
            category: 'peripherals'
        }
    ];
    
    const $container = $('#recommendations-grid');
    $container.html('');
    
    recommendations.forEach(product => {
        const $productCard = createRecommendationCard(product);
        $container.append($productCard);
    });
}

function createRecommendationCard(product) {
    const isInCart = window.cartManager.isInCart(product.id);
    const isFavorite = window.favoritesManager.isFavorite(product.id);
    
    return $(`
        <div class="product-card recommendation-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="btn-favorite ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-price">
                    <span class="current-price">S/ ${product.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-sm btn-add-cart ${isInCart ? 'added' : ''}" 
                        data-product-id="${product.id}">
                    ${isInCart ? 'En el carrito' : 'Añadir al carrito'}
                </button>
            </div>
        </div>
    `);
}

// Event listeners para productos recomendados
$(document).on('click', '.recommendation-card .btn-add-cart', function(e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    
    if (window.cartManager.isInCart(productId)) {
        window.location.href = 'carrito.html';
        return;
    }
    
    // Simular datos del producto
    const productData = {
        id: productId,
        name: $(this).closest('.product-card').find('.product-name').text(),
        brand: $(this).closest('.product-card').find('.product-brand').text(),
        price: parseFloat($(this).closest('.product-card').find('.current-price').text().replace('S/ ', '')),
        image: $(this).closest('.product-card').find('img').attr('src'),
        category: 'peripherals'
    };
    
    window.cartManager.addItem(productData);
    window.notificationManager.cartAdded(productData.name);
    
    $(this).addClass('added').text('En el carrito');
    updateHeaderCounters();
    loadCartItems(); // Actualizar el carrito si estamos en la página
});

$(document).on('click', '.recommendation-card .btn-favorite', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = $(this).data('product-id');
    const productCard = $(this).closest('.product-card');
    const productName = productCard.find('.product-name').text();
    
    if (window.favoritesManager.isFavorite(productId)) {
        window.favoritesManager.removeFavorite(productId);
        $(this).removeClass('active');
        window.notificationManager.favoriteRemoved(productName);
    } else {
        const favoriteData = {
            id: productId,
            name: productName,
            brand: productCard.find('.product-brand').text(),
            price: parseFloat(productCard.find('.current-price').text().replace('S/ ', '')),
            image: productCard.find('img').attr('src'),
            category: 'peripherals'
        };
        
        window.favoritesManager.addFavorite(favoriteData);
        $(this).addClass('active');
        window.notificationManager.favoriteAdded(productName);
    }
    
    updateHeaderCounters();
});

function updateHeaderCounters() {
    // Actualizar contadores en el header
    if (window.cartManager) {
        const cartCount = window.cartManager.getTotalItems();
        $('#cart-counter').text(cartCount);
        $('#cart-counter').toggle(cartCount > 0);
    }
    
    if (window.favoritesManager) {
        const favCount = window.favoritesManager.getCount();
        $('#favorites-counter').text(favCount);
        $('#favorites-counter').toggle(favCount > 0);
    }
}
