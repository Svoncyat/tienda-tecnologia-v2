// uwuTech Favorites System
// Sistema de favoritos compartido

class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.init();
    }

    init() {
        // Cargar favoritos desde localStorage
        const savedFavorites = localStorage.getItem('uwutech_favorites');
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
        }
        this.updateFavoritesUI();
    }

    // Agregar/remover favorito (toggle)
    toggleFavorite(product) {
        try {
            if (!product || !product.id) {
                throw new Error('Producto inválido');
            }

            const isFavorite = this.isFavorite(product.id);
            
            if (isFavorite) {
                // Remover de favoritos
                this.favorites = this.favorites.filter(fav => fav.id !== product.id);
                this.showNotification(`"${product.name}" removido de favoritos`, 'success');
            } else {
                // Agregar a favoritos
                const favoriteItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    addedAt: new Date().toISOString()
                };
                
                this.favorites.push(favoriteItem);
                this.showNotification(`"${product.name}" agregado a favoritos`, 'success');
            }

            this.saveFavorites();
            this.updateFavoritesUI();

            // Tracking de analytics
            this.trackFavoriteAction(product, !isFavorite);

            return { success: true, isFavorite: !isFavorite, count: this.favorites.length };
        } catch (error) {
            this.showNotification(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Remover favorito específico
    removeFavorite(productId) {
        const favoriteIndex = this.favorites.findIndex(fav => fav.id === productId);
        
        if (favoriteIndex !== -1) {
            const removedFavorite = this.favorites[favoriteIndex];
            this.favorites.splice(favoriteIndex, 1);
            
            this.saveFavorites();
            this.updateFavoritesUI();
            
            this.showNotification(`"${removedFavorite.name}" removido de favoritos`, 'success');
            
            return { success: true, count: this.favorites.length };
        }
        
        return { success: false, error: 'Producto no encontrado en favoritos' };
    }

    // Limpiar todos los favoritos
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
        this.updateFavoritesUI();
        this.showNotification('Favoritos eliminados', 'success');
    }

    // Verificar si un producto es favorito
    isFavorite(productId) {
        return this.favorites.some(fav => fav.id === productId);
    }

    // Obtener todos los favoritos
    getFavorites() {
        return [...this.favorites];
    }

    // Obtener cantidad de favoritos
    getFavoritesCount() {
        return this.favorites.length;
    }

    // Guardar favoritos en localStorage
    saveFavorites() {
        localStorage.setItem('uwutech_favorites', JSON.stringify(this.favorites));
    }

    // Actualizar UI de favoritos
    updateFavoritesUI() {
        // Actualizar iconos de corazón en las tarjetas de productos
        this.updateProductCards();

        // Actualizar contador de favoritos si existe
        this.updateFavoritesCounter();

        // Si estamos en la página de favoritos, actualizar contenido
        if ($('.favorites-page').length) {
            this.renderFavoritesPage();
        }
    }

    // Actualizar iconos de favoritos en las tarjetas
    updateProductCards() {
        $('.product-card').each((index, card) => {
            const productId = parseInt($(card).data('product-id'));
            if (productId) {
                const isFav = this.isFavorite(productId);
                const heartBtn = $(card).find('.favorite-btn');
                
                if (heartBtn.length) {
                    heartBtn.toggleClass('active', isFav);
                    heartBtn.attr('aria-label', isFav ? 'Remover de favoritos' : 'Agregar a favoritos');
                }
            }
        });
    }

    // Actualizar contador de favoritos
    updateFavoritesCounter() {
        const count = this.getFavoritesCount();
        
        // Agregar botón de favoritos si no existe
        if (!$('.favorites-btn').length && $('.cart-btn').length) {
            $('.cart-btn').after(`
                <button class="favorites-btn" aria-label="Favoritos">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="favorites-count">${count}</span>
                </button>
            `);
        } else if ($('.favorites-btn').length) {
            $('.favorites-count').text(count);
        }

        // Mostrar/ocultar contador
        if (count > 0) {
            $('.favorites-count').show();
        } else {
            $('.favorites-count').hide();
        }

        // Agregar estilos si no existen
        this.addFavoritesStyles();
    }

    // Renderizar página de favoritos
    renderFavoritesPage() {
        const favoritesContainer = $('.favorites-grid');
        
        if (this.favorites.length === 0) {
            favoritesContainer.html(`
                <div class="empty-favorites">
                    <div class="empty-favorites-icon">💝</div>
                    <h3>No tienes favoritos aún</h3>
                    <p>Agrega productos a tus favoritos para encontrarlos fácilmente más tarde</p>
                    <a href="./productos.html" class="btn btn-primary">Explorar Productos</a>
                </div>
            `);
            return;
        }

        // Renderizar productos favoritos
        const favoritesHTML = this.favorites.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${this.formatPrice(product.price)}</div>
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-sm favorite-btn active" data-product-id="${product.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${product.id}">
                        Agregar al Carrito
                    </button>
                </div>
                <div class="favorite-date">
                    Agregado ${this.getRelativeTime(product.addedAt)}
                </div>
            </div>
        `).join('');

        favoritesContainer.html(favoritesHTML);

        // Actualizar estado del carrito para estos productos
        if (window.cartManager) {
            window.cartManager.updateProductCards();
        }
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

    // Obtener tiempo relativo
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'hace 1 día';
        } else if (diffDays < 7) {
            return `hace ${diffDays} días`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
        } else {
            const months = Math.floor(diffDays / 30);
            return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
        }
    }

    // Tracking de analytics
    trackFavoriteAction(product, isAdded) {
        if (typeof gtag !== 'undefined') {
            gtag('event', isAdded ? 'add_to_wishlist' : 'remove_from_wishlist', {
                currency: 'COP',
                value: product.price,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.category,
                    price: product.price
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

    // Agregar estilos de favoritos
    addFavoritesStyles() {
        if (!$('#favorites-styles').length) {
            $('head').append(`
                <style id="favorites-styles">
                    .favorites-btn {
                        position: relative;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: var(--radius-md);
                        transition: var(--transition-normal);
                        margin-left: 8px;
                    }
                    
                    .favorites-btn:hover {
                        background: var(--background-light);
                    }
                    
                    .favorites-count {
                        position: absolute;
                        top: 2px;
                        right: 2px;
                        background: var(--error-color);
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
                    
                    .favorite-btn {
                        color: var(--text-color-muted);
                        transition: var(--transition-normal);
                    }
                    
                    .favorite-btn:hover {
                        color: var(--error-color);
                    }
                    
                    .favorite-btn.active {
                        color: var(--error-color);
                    }
                    
                    .favorite-btn.active svg {
                        fill: currentColor;
                    }
                    
                    /* Estilos para la página de favoritos */
                    .empty-favorites {
                        text-align: center;
                        padding: 3rem 1rem;
                        grid-column: 1 / -1;
                    }
                    
                    .empty-favorites-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    
                    .product-actions {
                        display: flex;
                        gap: 0.5rem;
                        margin-top: 1rem;
                    }
                    
                    .product-actions .btn {
                        flex: 1;
                    }
                    
                    .favorite-date {
                        font-size: 0.8rem;
                        color: var(--text-color-muted);
                        margin-top: 0.5rem;
                        text-align: center;
                    }
                    
                    .favorites-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                        margin-top: 2rem;
                    }
                    
                    .favorites-grid .product-card {
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-lg);
                        padding: 1.5rem;
                        background: white;
                        transition: var(--transition-normal);
                    }
                    
                    .favorites-grid .product-card:hover {
                        transform: translateY(-2px);
                        box-shadow: var(--shadow-lg);
                    }
                    
                    .favorites-grid .product-image {
                        font-size: 3rem;
                        text-align: center;
                        margin-bottom: 1rem;
                    }
                    
                    .favorites-grid .product-name {
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }
                    
                    .favorites-grid .product-price {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: var(--btn-color-blue);
                        margin-bottom: 0.25rem;
                    }
                    
                    .favorites-grid .product-category {
                        color: var(--text-color-muted);
                        font-size: 0.9rem;
                        margin-bottom: 1rem;
                    }
                </style>
            `);
        }
    }
}

// Instancia global del gestor de favoritos
window.favoritesManager = new FavoritesManager();

// Eventos globales de favoritos
$(document).ready(function() {
    // Toggle favorito
    $(document).on('click', '.favorite-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productCard = $(this).closest('.product-card');
        const productData = productCard.data('product');
        const productId = parseInt($(this).data('product-id'));
        
        if (productData) {
            window.favoritesManager.toggleFavorite(productData);
        } else if (productId) {
            // Si no tenemos los datos completos del producto, intentar obtenerlos
            const product = window.favoritesManager.favorites.find(fav => fav.id === productId);
            if (product) {
                window.favoritesManager.removeFavorite(productId);
            }
        }
    });

    // Botón de favoritos en header
    $(document).on('click', '.favorites-btn', function(e) {
        e.preventDefault();
        window.location.href = './pages/favoritos.html';
    });

    // Limpiar favoritos
    $(document).on('click', '.clear-favorites', function(e) {
        e.preventDefault();
        
        if (confirm('¿Estás seguro de que quieres eliminar todos tus favoritos?')) {
            window.favoritesManager.clearFavorites();
        }
    });
});
