/**
 * Página de Favoritos
 * Gestión y visualización de productos favoritos
 */

$(document).ready(function() {
    initFavoritesPage();
});

let currentView = 'grid';
let currentFilter = 'all';
let currentSort = 'date-desc';

function initFavoritesPage() {
    // Cargar favoritos
    loadFavorites();
    
    // Event listeners
    setupFavoritesEventListeners();
    
    // Actualizar contadores en header
    updateHeaderCounters();
}

function setupFavoritesEventListeners() {
    // Cambiar vista
    $('.view-btn').on('click', function() {
        $('.view-btn').removeClass('active');
        $(this).addClass('active');
        currentView = $(this).data('view');
        updateFavoritesView();
    });
    
    // Filtros
    $('#category-filter').on('change', function() {
        currentFilter = $(this).val();
        loadFavorites();
    });
    
    $('#sort-filter').on('change', function() {
        currentSort = $(this).val();
        loadFavorites();
    });
    
    // Limpiar favoritos
    $('#clear-favorites-btn').on('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar todos tus favoritos?')) {
            window.favoritesManager.clear();
            loadFavorites();
            window.notificationManager.info('Lista de favoritos limpiada');
            updateHeaderCounters();
        }
    });
    
    // Compartir en redes sociales
    $('#share-whatsapp').on('click', function() {
        shareOnWhatsApp();
    });
    
    $('#share-facebook').on('click', function() {
        shareOnFacebook();
    });
    
    $('#copy-link').on('click', function() {
        copyFavoritesLink();
    });
}

function loadFavorites() {
    let favorites = window.favoritesManager.getFavorites();
    
    // Aplicar filtro de categoría
    if (currentFilter !== 'all') {
        favorites = favorites.filter(item => item.category === currentFilter);
    }
    
    // Aplicar ordenamiento
    favorites = sortFavorites(favorites, currentSort);
    
    const $container = $('#favorites-container');
    const $emptyState = $('#empty-favorites');
    const $shareSection = $('#share-favorites');
    
    // Actualizar contador
    updateFavoritesCount(favorites.length);
    
    if (favorites.length === 0) {
        $container.hide();
        $shareSection.hide();
        $emptyState.show();
        return;
    }
    
    $emptyState.hide();
    $container.show();
    $shareSection.show();
    
    // Renderizar favoritos
    renderFavorites(favorites);
}

function sortFavorites(favorites, sortType) {
    return favorites.sort((a, b) => {
        switch (sortType) {
            case 'date-desc':
                return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
            case 'date-asc':
                return new Date(a.addedAt || 0) - new Date(b.addedAt || 0);
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
}

function renderFavorites(favorites) {
    const $container = $('#favorites-container');
    $container.html('');
    
    favorites.forEach(item => {
        const $favoriteItem = createFavoriteElement(item);
        $container.append($favoriteItem);
    });
    
    updateFavoritesView();
}

function createFavoriteElement(item) {
    const isInCart = window.cartManager.isInCart(item.id);
    const discount = item.originalPrice && item.originalPrice > item.price ? 
        Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
    
    return $(`
        <div class="favorite-item" data-product-id="${item.id}" data-category="${item.category}">
            <div class="favorite-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <div class="favorite-overlay">
                    <button class="btn btn-primary btn-sm btn-quick-view" data-product-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Vista rápida
                    </button>
                </div>
            </div>
            <div class="favorite-details">
                <div class="favorite-info">
                    <h3 class="favorite-name">${item.name}</h3>
                    <p class="favorite-brand">${item.brand}</p>
                    <div class="favorite-specs">
                        ${item.specs ? item.specs.slice(0, 3).map(spec => `<span class="spec-tag">${spec}</span>`).join('') : ''}
                    </div>
                    <div class="favorite-price">
                        <span class="current-price">S/ ${item.price.toFixed(2)}</span>
                        ${item.originalPrice && item.originalPrice > item.price ? 
                            `<span class="original-price">S/ ${item.originalPrice.toFixed(2)}</span>` : ''
                        }
                    </div>
                    <div class="favorite-meta">
                        <span class="added-date">Agregado ${formatDate(item.addedAt)}</span>
                        <span class="category-tag">${getCategoryName(item.category)}</span>
                    </div>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-primary ${isInCart ? 'btn-in-cart' : ''}" 
                            data-product-id="${item.id}">
                        ${isInCart ? 'En el carrito' : 'Añadir al carrito'}
                    </button>
                    <div class="action-buttons">
                        <button class="btn-icon btn-share" data-product-id="${item.id}" title="Compartir">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>
                        <button class="btn-icon btn-remove-favorite" data-product-id="${item.id}" title="Quitar de favoritos">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function updateFavoritesView() {
    const $container = $('#favorites-container');
    $container.removeClass('favorites-grid favorites-list');
    $container.addClass(`favorites-${currentView}`);
}

function updateFavoritesCount(count) {
    $('#favorites-count').text(`${count} producto${count !== 1 ? 's' : ''}`);
}

function formatDate(dateString) {
    if (!dateString) return 'hace tiempo';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `hace ${Math.ceil(diffDays / 30)} mes${Math.ceil(diffDays / 30) > 1 ? 'es' : ''}`;
    return `hace ${Math.ceil(diffDays / 365)} año${Math.ceil(diffDays / 365) > 1 ? 's' : ''}`;
}

function getCategoryName(category) {
    const categories = {
        'laptops': 'Laptops',
        'desktops': 'PCs de Escritorio',
        'gaming': 'Gaming',
        'peripherals': 'Periféricos',
        'components': 'Componentes',
        'general': 'General'
    };
    return categories[category] || 'General';
}

// Event delegation para elementos dinámicos
$(document).on('click', '.btn-remove-favorite', function() {
    const productId = $(this).data('product-id');
    const favoriteItem = window.favoritesManager.getFavorite(productId);
    
    if (confirm(`¿Eliminar "${favoriteItem.name}" de tus favoritos?`)) {
        window.favoritesManager.removeFavorite(productId);
        window.notificationManager.favoriteRemoved(favoriteItem.name);
        loadFavorites();
        updateHeaderCounters();
    }
});

$(document).on('click', '.favorite-item .btn-primary:not(.btn-quick-view)', function() {
    const productId = $(this).data('product-id');
    
    if (window.cartManager.isInCart(productId)) {
        window.location.href = 'carrito.html';
        return;
    }
    
    const favoriteItem = window.favoritesManager.getFavorite(productId);
    
    // Convertir favorito a item de carrito
    const cartItem = {
        id: favoriteItem.id,
        name: favoriteItem.name,
        brand: favoriteItem.brand,
        price: favoriteItem.price,
        originalPrice: favoriteItem.originalPrice,
        image: favoriteItem.image,
        category: favoriteItem.category,
        specs: favoriteItem.specs
    };
    
    window.cartManager.addItem(cartItem);
    window.notificationManager.cartAdded(favoriteItem.name);
    
    $(this).addClass('btn-in-cart').text('En el carrito');
    updateHeaderCounters();
});

$(document).on('click', '.btn-quick-view', function() {
    const productId = $(this).data('product-id');
    // Aquí se abriría un modal con vista rápida del producto
    window.notificationManager.info('Vista rápida próximamente disponible');
});

$(document).on('click', '.btn-share', function() {
    const productId = $(this).data('product-id');
    const favoriteItem = window.favoritesManager.getFavorite(productId);
    shareProduct(favoriteItem);
});

function shareProduct(product) {
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: `Mira este producto en uwuTech: ${product.name} - S/ ${product.price.toFixed(2)}`,
            url: `${window.location.origin}/productos/${product.id}`
        });
    } else {
        // Fallback: copiar al portapapeles
        const shareText = `Mira este producto en uwuTech: ${product.name} - S/ ${product.price.toFixed(2)} - ${window.location.origin}/productos/${product.id}`;
        navigator.clipboard.writeText(shareText).then(() => {
            window.notificationManager.success('Enlace copiado al portapapeles');
        });
    }
}

function shareOnWhatsApp() {
    const favorites = window.favoritesManager.getFavorites();
    if (favorites.length === 0) return;
    
    const message = `Mira mi lista de productos favoritos en uwuTech:\n\n${favorites.slice(0, 5).map(item => 
        `• ${item.name} - S/ ${item.price.toFixed(2)}`
    ).join('\n')}\n\n${window.location.href}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function copyFavoritesLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        window.notificationManager.success('Enlace copiado al portapapeles');
    });
}

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
