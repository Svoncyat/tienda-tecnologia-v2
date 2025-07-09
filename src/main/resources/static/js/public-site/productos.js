// Productos Page JavaScript
// Funcionalidad específica para la página de productos

// Base de datos mock de productos
const mockProducts = [
    {
        id: 1,
        name: "Laptop Dell Inspiron 15",
        category: "laptops",
        price: 2499000,
        oldPrice: 2799000,
        rating: 4.5,
        reviews: 124,
        description: "Intel Core i5-12450H, 8GB RAM, 512GB SSD, Windows 11",
        image: "💻",
        badge: "Oferta",
        inStock: true
    },
    {
        id: 2,
        name: "PC Gamer Custom RGB",
        category: "gaming",
        price: 3999000,
        rating: 4.8,
        reviews: 89,
        description: "AMD Ryzen 7 5700X, RTX 4060, 16GB RAM DDR4, 1TB NVMe",
        image: "🖥️",
        badge: "Nuevo",
        inStock: true
    },
    {
        id: 3,
        name: "Teclado Mecánico RGB Corsair",
        category: "peripherals",
        price: 299000,
        rating: 4.7,
        reviews: 256,
        description: "Switches Cherry MX Red, iluminación RGB, reposamuñecas",
        image: "⌨️",
        inStock: true
    },
    {
        id: 4,
        name: "Mouse Gaming Logitech G502",
        category: "peripherals",
        price: 159000,
        rating: 4.6,
        reviews: 412,
        description: "Sensor HERO 25K, 11 botones programables, pesos ajustables",
        image: "🖱️",
        inStock: true
    },
    {
        id: 5,
        name: "Monitor Gaming ASUS 27\"",
        category: "peripherals",
        price: 899000,
        rating: 4.4,
        reviews: 78,
        description: "2560x1440, 165Hz, 1ms, G-Sync Compatible, IPS",
        image: "🖥️",
        inStock: true
    },
    {
        id: 6,
        name: "Laptop HP Pavilion Gaming",
        category: "gaming",
        price: 3299000,
        oldPrice: 3599000,
        rating: 4.3,
        reviews: 67,
        description: "AMD Ryzen 5 5600H, GTX 1650, 8GB RAM, 512GB SSD",
        image: "💻",
        badge: "Descuento",
        inStock: true
    },
    {
        id: 7,
        name: "SSD Samsung 970 EVO Plus 1TB",
        category: "components",
        price: 459000,
        rating: 4.9,
        reviews: 189,
        description: "NVMe M.2, hasta 3,500 MB/s lectura, 5 años garantía",
        image: "💾",
        inStock: true
    },
    {
        id: 8,
        name: "Tarjeta Gráfica RTX 4070",
        category: "components",
        price: 2899000,
        rating: 4.8,
        reviews: 145,
        description: "12GB GDDR6X, Ray Tracing, DLSS 3.0, 1440p Gaming",
        image: "🎮",
        badge: "Popular",
        inStock: false
    },
    {
        id: 9,
        name: "Procesador AMD Ryzen 9 7900X",
        category: "components",
        price: 1999000,
        rating: 4.7,
        reviews: 98,
        description: "12 núcleos, 24 hilos, 4.7GHz boost, AM5",
        image: "🔧",
        inStock: true
    },
    {
        id: 10,
        name: "MacBook Air M2",
        category: "laptops",
        price: 4999000,
        rating: 4.9,
        reviews: 234,
        description: "Chip M2, 8GB RAM, 256GB SSD, Pantalla Liquid Retina",
        image: "💻",
        badge: "Premium",
        inStock: true
    },
    {
        id: 11,
        name: "PC Workstation Dell Precision",
        category: "desktops",
        price: 5499000,
        rating: 4.6,
        reviews: 45,
        description: "Intel Xeon, 32GB RAM, Quadro RTX A2000, 1TB SSD",
        image: "🖥️",
        inStock: true
    },
    {
        id: 12,
        name: "Audífonos Gaming SteelSeries",
        category: "peripherals",
        price: 389000,
        rating: 4.5,
        reviews: 167,
        description: "7.1 Surround, micrófono retráctil, iluminación RGB",
        image: "🎧",
        inStock: true
    }
];

let currentProducts = [...mockProducts];
let currentPage = 1;
const productsPerPage = 9;

$(document).ready(function() {
    initProductsPage();
    setupEventListeners();
    renderProducts();
});

/**
 * Inicializar la página de productos
 */
function initProductsPage() {
    // Verificar si hay parámetros de búsqueda en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        $('#product-search').val(searchQuery);
        filterProducts();
    }
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Búsqueda de productos
    const debouncedSearch = debounce(function() {
        filterProducts();
    }, 300);
    
    $('#product-search').on('input', debouncedSearch);
    $('.search-product-btn').on('click', filterProducts);
    
    // Filtros por categoría
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        filterProducts();
    });
    
    // Ordenamiento
    $('#sort-products').on('change', function() {
        sortProducts($(this).val());
        renderProducts();
    });
    
    // Paginación
    $(document).on('click', '.pagination-btn', function() {
        const page = $(this).data('page');
        handlePagination(page);
    });
    
    // Acciones de productos
    $(document).on('click', '.btn-add-cart', function(e) {
        e.stopPropagation();
        const productId = $(this).closest('.product-card').data('product-id');
        addToCart(productId);
    });
    
    $(document).on('click', '.btn-wishlist', function(e) {
        e.stopPropagation();
        const productId = $(this).closest('.product-card').data('product-id');
        toggleWishlist(productId);
    });
    
    // Click en producto para ver detalles
    $(document).on('click', '.product-card', function() {
        const productId = $(this).data('product-id');
        viewProductDetails(productId);
    });
}

/**
 * Filtrar productos por búsqueda y categoría
 */
function filterProducts() {
    const searchQuery = $('#product-search').val().toLowerCase().trim();
    const selectedCategory = $('.filter-btn.active').data('category');
    
    currentProducts = mockProducts.filter(product => {
        const matchesSearch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery);
        
        const matchesCategory = selectedCategory === 'all' || 
            product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    renderProducts();
    updatePagination();
}

/**
 * Ordenar productos
 */
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'name':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            currentProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
}

/**
 * Renderizar productos
 */
function renderProducts() {
    const container = $('#products-container');
    
    if (currentProducts.length === 0) {
        container.html(`
            <div class="no-products">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o categorías</p>
            </div>
        `);
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = currentProducts.slice(startIndex, endIndex);
    
    const productsHtml = productsToShow.map(product => `
        <div class="product-card animate-on-scroll" data-product-id="${product.id}">
            <div class="product-image">
                ${product.image}
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    ${formatCurrency(product.price)}
                    ${product.oldPrice ? `<span class="price-old">${formatCurrency(product.oldPrice)}</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? '🛒 Agregar' : 'Agotado'}
                    </button>
                    <button class="btn-wishlist" title="Agregar a favoritos">♡</button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.html(productsHtml);
    
    // Reinicializar animaciones
    initAnimations();
}

/**
 * Renderizar estrellas de rating
 */
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '☆';
    }
    
    return stars;
}

/**
 * Obtener nombre de categoría
 */
function getCategoryName(category) {
    const categories = {
        'laptops': 'Laptops',
        'desktops': 'Computadores',
        'gaming': 'Gaming',
        'peripherals': 'Periféricos',
        'components': 'Componentes'
    };
    
    return categories[category] || 'Otros';
}

/**
 * Manejar paginación
 */
function handlePagination(page) {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    
    if (page === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (page === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
        currentPage = page;
    }
    
    renderProducts();
    updatePagination();
    
    // Scroll to top of products
    $('.products-catalog').get(0).scrollIntoView({ behavior: 'smooth' });
}

/**
 * Actualizar paginación
 */
function updatePagination() {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    const pagination = $('.pagination');
    
    if (totalPages <= 1) {
        pagination.hide();
        return;
    }
    
    pagination.show();
    
    // Actualizar botones de navegación
    $('.pagination-btn[data-page="prev"]').prop('disabled', currentPage === 1);
    $('.pagination-btn[data-page="next"]').prop('disabled', currentPage === totalPages);
    
    // Actualizar números de página
    const numbersContainer = $('.pagination-numbers');
    let numbersHtml = '';
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const isActive = i === currentPage ? 'active' : '';
        numbersHtml += `<button class="pagination-btn ${isActive}" data-page="${i}">${i}</button>`;
    }
    
    numbersContainer.html(numbersHtml);
}

/**
 * Agregar al carrito
 */
function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product || !product.inStock) {
        showNotification('Producto no disponible', 'warning');
        return;
    }
    
    // Simular agregar al carrito
    showNotification(`${product.name} agregado al carrito`, 'success');
    
    // Tracking para analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            'currency': 'COP',
            'value': product.price,
            'items': [{
                'item_id': product.id,
                'item_name': product.name,
                'category': product.category,
                'price': product.price
            }]
        });
    }
}

/**
 * Toggle wishlist
 */
function toggleWishlist(productId) {
    const product = mockProducts.find(p => p.id === productId);
    const button = $(`.product-card[data-product-id="${productId}"] .btn-wishlist`);
    
    if (button.hasClass('active')) {
        button.removeClass('active').html('♡');
        showNotification(`${product.name} removido de favoritos`, 'info');
    } else {
        button.addClass('active').html('♥');
        showNotification(`${product.name} agregado a favoritos`, 'success');
    }
}

/**
 * Ver detalles del producto
 */
function viewProductDetails(productId) {
    const product = mockProducts.find(p => p.id === productId);
    
    // Por ahora mostrar notificación, en el futuro abrir modal o nueva página
    showNotification(`Ver detalles de ${product.name}`, 'info');
    
    // Tracking para analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            'currency': 'COP',
            'value': product.price,
            'items': [{
                'item_id': product.id,
                'item_name': product.name,
                'category': product.category,
                'price': product.price
            }]
        });
    }
}
