// uwuTech Shopping Cart System
// Sistema de carrito de compras compartido

class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        // Cargar carrito desde localStorage
        const savedCart = localStorage.getItem('uwutech_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        this.updateCartUI();
    }

    // Agregar producto al carrito
    addToCart(product, quantity = 1) {
        try {
            // Validar producto
            if (!product || !product.id) {
                throw new Error('Producto inválido');
            }

            // Verificar stock
            if (!product.inStock) {
                throw new Error('Producto agotado');
            }

            // Buscar si el producto ya está en el carrito
            const existingItem = this.cart.find(item => item.id === product.id);

            if (existingItem) {
                // Actualizar cantidad
                existingItem.quantity += quantity;
                this.showNotification(`Se agregó ${quantity} más de "${product.name}" al carrito`, 'success');
            } else {
                // Agregar nuevo producto
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    category: product.category
                };
                
                this.cart.push(cartItem);
                this.showNotification(`"${product.name}" agregado al carrito`, 'success');
            }

            this.saveCart();
            this.updateCartUI();

            // Tracking de analytics
            this.trackAddToCart(product, quantity);

            return { success: true, cartCount: this.getItemCount() };
        } catch (error) {
            this.showNotification(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            
            this.saveCart();
            this.updateCartUI();
            
            this.showNotification(`"${removedItem.name}" removido del carrito`, 'success');
            
            // Tracking de analytics
            this.trackRemoveFromCart(removedItem);
            
            return { success: true, cartCount: this.getItemCount() };
        }
        
        return { success: false, error: 'Producto no encontrado en el carrito' };
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            if (newQuantity <= 0) {
                return this.removeFromCart(productId);
            }
            
            const oldQuantity = item.quantity;
            item.quantity = newQuantity;
            
            this.saveCart();
            this.updateCartUI();
            
            this.showNotification(`Cantidad actualizada para "${item.name}"`, 'success');
            
            return { success: true, cartCount: this.getItemCount() };
        }
        
        return { success: false, error: 'Producto no encontrado en el carrito' };
    }

    // Limpiar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Carrito vaciado', 'success');
    }

    // Obtener carrito
    getCart() {
        return [...this.cart];
    }

    // Obtener cantidad total de items
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener total del carrito
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Verificar si un producto está en el carrito
    isInCart(productId) {
        return this.cart.some(item => item.id === productId);
    }

    // Obtener cantidad de un producto específico
    getProductQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('uwutech_cart', JSON.stringify(this.cart));
    }

    // Actualizar UI del carrito
    updateCartUI() {
        const itemCount = this.getItemCount();
        const total = this.getTotal();

        // Actualizar contador en el header
        this.updateCartCounter(itemCount);

        // Actualizar badge de productos en las tarjetas
        this.updateProductCards();

        // Si estamos en la página del carrito, actualizar contenido
        if ($('.cart-page').length) {
            this.renderCartPage();
        }

        // Actualizar mini carrito si existe
        if ($('.mini-cart').length) {
            this.renderMiniCart();
        }
    }

    // Actualizar contador del carrito en el header
    updateCartCounter(count) {
        // Agregar botón del carrito si no existe
        if (!$('.cart-btn').length) {
            $('.search-btn').after(`
                <button class="cart-btn" aria-label="Carrito">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="m1 1 4 4 14 1-1 7-13-1"></path>
                    </svg>
                    <span class="cart-count">${count}</span>
                </button>
            `);
        } else {
            $('.cart-count').text(count);
        }

        // Mostrar/ocultar contador
        if (count > 0) {
            $('.cart-count').show();
        } else {
            $('.cart-count').hide();
        }

        // Agregar estilos del carrito si no existen
        this.addCartStyles();
    }

    // Actualizar estado de las tarjetas de productos
    updateProductCards() {
        $('.product-card').each((index, card) => {
            const productId = parseInt($(card).data('product-id'));
            if (productId) {
                const quantity = this.getProductQuantity(productId);
                const addToCartBtn = $(card).find('.add-to-cart-btn');
                
                if (quantity > 0) {
                    addToCartBtn.html(`
                        <span class="quantity-controls">
                            <button class="qty-btn minus" data-product-id="${productId}">-</button>
                            <span class="qty-display">${quantity}</span>
                            <button class="qty-btn plus" data-product-id="${productId}">+</button>
                        </span>
                    `).addClass('in-cart');
                } else {
                    addToCartBtn.html('Agregar al Carrito').removeClass('in-cart');
                }
            }
        });
    }

    // Renderizar página del carrito
    renderCartPage() {
        const cartContainer = $('.cart-items');
        const cartSummary = $('.cart-summary');
        
        if (this.cart.length === 0) {
            cartContainer.html(`
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para comenzar</p>
                    <a href="./productos.html" class="btn btn-primary">Ver Productos</a>
                </div>
            `);
            cartSummary.hide();
            return;
        }

        // Renderizar items del carrito
        const itemsHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">${item.image}</div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-category">${this.getCategoryName(item.category)}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn minus" data-product-id="${item.id}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-product-id="${item.id}">+</button>
                </div>
                <div class="item-price">
                    <span class="unit-price">$${this.formatPrice(item.price)}</span>
                    <span class="total-price">$${this.formatPrice(item.price * item.quantity)}</span>
                </div>
                <button class="remove-item" data-product-id="${item.id}" title="Eliminar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6m3,0V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');

        cartContainer.html(itemsHTML);

        // Renderizar resumen
        const subtotal = this.getTotal();
        const shipping = subtotal > 200000 ? 0 : 15000; // Envío gratis por encima de $200.000
        const total = subtotal + shipping;

        cartSummary.html(`
            <div class="summary-row">
                <span>Subtotal (${this.getItemCount()} items)</span>
                <span>$${this.formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Envío</span>
                <span>${shipping === 0 ? 'Gratis' : '$' + this.formatPrice(shipping)}</span>
            </div>
            ${shipping === 0 ? '<div class="free-shipping-notice">🎉 ¡Envío gratuito!</div>' : ''}
            <div class="summary-total">
                <span>Total</span>
                <span>$${this.formatPrice(total)}</span>
            </div>
            <button class="btn btn-primary btn-full checkout-btn">
                Proceder al Checkout
            </button>
            <button class="btn btn-outline btn-full continue-shopping">
                Continuar Comprando
            </button>
        `).show();
    }

    // Renderizar mini carrito (dropdown)
    renderMiniCart() {
        // Implementar si se necesita un mini carrito dropdown
    }

    // Formatear precio
    formatPrice(price) {
        return new Intl.NumberFormat('es-CO').format(price);
    }

    // Obtener nombre de categoría
    getCategoryName(category) {
        const categoryNames = {
            'laptops': 'Laptops',
            'desktops': 'Computadores de Escritorio',
            'gaming': 'Gaming',
            'peripherals': 'Periféricos',
            'components': 'Componentes',
            'accessories': 'Accesorios'
        };
        return categoryNames[category] || 'Otros';
    }

    // Tracking de analytics
    trackAddToCart(product, quantity) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                currency: 'COP',
                value: product.price * quantity,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.category,
                    quantity: quantity,
                    price: product.price
                }]
            });
        }
    }

    trackRemoveFromCart(item) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'remove_from_cart', {
                currency: 'COP',
                value: item.price * item.quantity,
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    item_category: item.category,
                    quantity: item.quantity,
                    price: item.price
                }]
            });
        }
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Agregar estilos del carrito
    addCartStyles() {
        if (!$('#cart-styles').length) {
            $('head').append(`
                <style id="cart-styles">
                    .cart-btn {
                        position: relative;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: var(--radius-md);
                        transition: var(--transition-normal);
                        margin-left: 8px;
                    }
                    
                    .cart-btn:hover {
                        background: var(--background-light);
                    }
                    
                    .cart-count {
                        position: absolute;
                        top: 2px;
                        right: 2px;
                        background: var(--btn-color-pink);
                        color: white;
                        border-radius: 50%;
                        min-width: 18px;
                        height: 18px;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 1;
                    }
                    
                    .add-to-cart-btn.in-cart {
                        background: var(--btn-color-green);
                        color: white;
                    }
                    
                    .quantity-controls {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .qty-btn {
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    
                    .qty-btn:hover {
                        background: rgba(255,255,255,0.3);
                    }
                    
                    .qty-display {
                        min-width: 20px;
                        text-align: center;
                        font-weight: 600;
                    }
                    
                    /* Estilos para la página del carrito */
                    .cart-item {
                        display: grid;
                        grid-template-columns: 60px 1fr auto auto auto;
                        gap: 1rem;
                        align-items: center;
                        padding: 1.5rem;
                        border-bottom: 1px solid var(--border-color);
                    }
                    
                    .item-image {
                        font-size: 2rem;
                        text-align: center;
                    }
                    
                    .item-name {
                        font-weight: 600;
                        margin-bottom: 0.25rem;
                    }
                    
                    .item-category {
                        color: var(--text-color-muted);
                        font-size: 0.9rem;
                    }
                    
                    .item-quantity .qty-btn {
                        background: var(--background-light);
                        color: var(--text-color-primary);
                        border: 1px solid var(--border-color);
                    }
                    
                    .item-price {
                        text-align: right;
                    }
                    
                    .unit-price {
                        display: block;
                        color: var(--text-color-muted);
                        font-size: 0.9rem;
                    }
                    
                    .total-price {
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                    
                    .remove-item {
                        background: none;
                        border: none;
                        color: var(--text-color-muted);
                        cursor: pointer;
                        padding: 8px;
                        border-radius: var(--radius-md);
                        transition: var(--transition-normal);
                    }
                    
                    .remove-item:hover {
                        color: var(--error-color);
                        background: var(--background-light);
                    }
                    
                    .empty-cart {
                        text-align: center;
                        padding: 3rem 1rem;
                    }
                    
                    .empty-cart-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.75rem;
                    }
                    
                    .summary-total {
                        display: flex;
                        justify-content: space-between;
                        font-weight: 600;
                        font-size: 1.2rem;
                        padding-top: 0.75rem;
                        border-top: 1px solid var(--border-color);
                        margin-bottom: 1.5rem;
                    }
                    
                    .free-shipping-notice {
                        background: var(--success-color);
                        color: white;
                        padding: 0.5rem;
                        border-radius: var(--radius-md);
                        text-align: center;
                        font-size: 0.9rem;
                        margin: 0.75rem 0;
                    }
                    
                    @media (max-width: 768px) {
                        .cart-item {
                            grid-template-columns: 1fr;
                            gap: 0.75rem;
                            text-align: center;
                        }
                        
                        .item-quantity {
                            justify-self: center;
                        }
                        
                        .item-price {
                            text-align: center;
                        }
                    }
                </style>
            `);
        }
    }
}

// Instancia global del gestor de carrito
window.cartManager = new CartManager();

// Eventos globales del carrito
$(document).ready(function() {
    // Agregar al carrito
    $(document).on('click', '.add-to-cart-btn:not(.in-cart)', function(e) {
        e.preventDefault();
        const productCard = $(this).closest('.product-card');
        const productData = productCard.data('product');
        
        if (productData) {
            window.cartManager.addToCart(productData);
        }
    });

    // Controles de cantidad en tarjetas
    $(document).on('click', '.qty-btn.plus', function(e) {
        e.preventDefault();
        const productId = parseInt($(this).data('product-id'));
        const currentQty = window.cartManager.getProductQuantity(productId);
        window.cartManager.updateQuantity(productId, currentQty + 1);
    });

    $(document).on('click', '.qty-btn.minus', function(e) {
        e.preventDefault();
        const productId = parseInt($(this).data('product-id'));
        const currentQty = window.cartManager.getProductQuantity(productId);
        window.cartManager.updateQuantity(productId, currentQty - 1);
    });

    // Remover del carrito
    $(document).on('click', '.remove-item', function(e) {
        e.preventDefault();
        const productId = parseInt($(this).data('product-id'));
        window.cartManager.removeFromCart(productId);
    });

    // Botón del carrito en header
    $(document).on('click', '.cart-btn', function(e) {
        e.preventDefault();
        window.location.href = './pages/carrito.html';
    });

    // Checkout
    $(document).on('click', '.checkout-btn', function(e) {
        e.preventDefault();
        
        // Verificar autenticación
        if (!window.authManager.isAuthenticated()) {
            sessionStorage.setItem('returnUrl', './pages/checkout.html');
            window.authManager.showAuthModal('login');
            return;
        }
        
        window.location.href = './pages/checkout.html';
    });

    // Continuar comprando
    $(document).on('click', '.continue-shopping', function(e) {
        e.preventDefault();
        window.location.href = './pages/productos.html';
    });
});
