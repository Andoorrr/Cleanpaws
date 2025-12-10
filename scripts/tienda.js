// ===== VARIABLES GLOBALES =====
let cart = [];

// ===== SISTEMA DE BÚSQUEDA OPTIMIZADO =====
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        
        // Reducido de 300ms a 200ms para mejor respuesta
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            searchProducts(searchTerm);
        }, 200);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            searchProducts('');
        }
    });
}

// OPTIMIZADO: Búsqueda sin animaciones complejas
function searchProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    let foundCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
        
        const matchFound = productName.includes(searchTerm) || 
                          productDescription.includes(searchTerm) ||
                          productCategory.includes(searchTerm);
        
        // Mostrar/ocultar sin animación compleja
        if (matchFound || searchTerm === '') {
            card.style.display = 'block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResults(foundCount, searchTerm);
}

function showSearchResults(count, searchTerm) {
    const productsContainer = document.querySelector('.products-container');
    
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (searchTerm === '' && count > 0) return;
    
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 1.5rem;
        border-radius: 15px;
        background: ${count === 0 ? 'rgba(255, 0, 0, 0.05)' : 'rgba(74, 144, 226, 0.05)'};
        border: 2px solid ${count === 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(74, 144, 226, 0.1)'};
        margin-bottom: 1rem;
    `;
    
    if (count === 0) {
        message.innerHTML = `
            <p style="margin: 0 0 0.5rem 0; color: #e74c3c; font-size: 1.125rem; font-weight: 700;">
                No se encontraron productos
            </p>
            <p style="margin: 0 0 1rem 0; color: #666; font-size: 0.95rem;">
                No hay productos que coincidan con "<strong>${searchTerm}</strong>"
            </p>
            <button onclick="document.querySelector('.search-input').value = ''; searchProducts('');" 
                    style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #4A90E2 0%, #2E5C9A 100%); 
                           color: white; border: none; border-radius: 50px; cursor: pointer; font-weight: 600;">
                Limpiar búsqueda
            </button>
        `;
    } else {
        message.innerHTML = `
            <p style="margin: 0; color: #2E5C9A; font-size: 0.95rem; font-weight: 600;">
                Se encontraron <strong>${count}</strong> productos para "<strong>${searchTerm}</strong>"
            </p>
        `;
    }
    
    productsContainer.insertBefore(message, productsContainer.firstChild);
}

// ===== SISTEMA DE ORDENAMIENTO OPTIMIZADO =====
function initializeSortBy() {
    const sortSelect = document.querySelector('.sort-select');
    
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
}

// OPTIMIZADO: Ordenamiento sin animaciones
function sortProducts(sortType) {
    const productsContainer = document.querySelector('.products-container');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                return getProductPrice(a) - getProductPrice(b);
            case 'price-high':
                return getProductPrice(b) - getProductPrice(a);
            case 'newest':
                const aIsNew = a.querySelector('.product-badge')?.textContent === 'Nuevo';
                const bIsNew = b.querySelector('.product-badge')?.textContent === 'Nuevo';
                return bIsNew - aIsNew;
            case 'popular':
                return getProductRating(b) - getProductRating(a);
            default:
                return 0;
        }
    });
    
    // Reorganizar sin animación
    productCards.forEach(card => {
        productsContainer.appendChild(card);
    });
}

function getProductPrice(card) {
    const priceText = card.querySelector('.price-current').textContent;
    return parseFloat(priceText.replace('S/.', '').replace(',', '').trim());
}

function getProductRating(card) {
    const ratingText = card.querySelector('.rating-count').textContent;
    return parseInt(ratingText.replace('(', '').replace(')', ''));
}

// ===== SISTEMA DE FILTRADO POR CATEGORÍA =====
function initializeCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener categoría del botón
            const category = this.getAttribute('data-category');
            
            // Filtrar productos
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay productos en la categoría
    showCategoryResults(visibleCount, category);
}

function showCategoryResults(count, category) {
    const productsContainer = document.querySelector('.products-container');
    
    // Remover mensaje anterior
    const existingMessage = document.querySelector('.category-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Solo mostrar mensaje si no hay productos
    if (count === 0) {
        const message = document.createElement('div');
        message.className = 'category-results-message';
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 1.5rem;
            border-radius: 15px;
            background: rgba(255, 0, 0, 0.05);
            border: 2px solid rgba(255, 0, 0, 0.1);
            margin-bottom: 1rem;
        `;
        
        const categoryNames = {
            'comederos': 'Comederos',
            'juguetes': 'Juguetes',
            'accesorios': 'Accesorios',
            'salud': 'Salud'
        };
        
        message.innerHTML = `
            <p style="margin: 0 0 0.5rem 0; color: #e74c3c; font-size: 1.125rem; font-weight: 700;">
                No hay productos en esta categoría
            </p>
            <p style="margin: 0; color: #666; font-size: 0.95rem;">
                No se encontraron productos en la categoría "<strong>${categoryNames[category]}</strong>"
            </p>
        `;
        
        productsContainer.insertBefore(message, productsContainer.firstChild);
    }
}

// ===== SISTEMA DE CARRITO OPTIMIZADO =====
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('.product-name').textContent,
                price: getProductPrice(productCard),
                image: productCard.querySelector('.product-image img').src,
                category: productCard.querySelector('.product-category').textContent
            };
            
            addToCart(product, this);
        });
    });
    
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        floatingCart.addEventListener('click', showCartModal);
    }
}

function addToCart(product, button) {
    cart.push(product);
    updateCartCount();
    
    // Feedback visual simple
    const originalText = button.innerHTML;
    button.innerHTML = '<span>✓ Agregado</span>';
    button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
    
    showNotification(`${product.name} agregado al carrito`, 'success');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// OPTIMIZADO: Modal del carrito sin backdrop-filter
function showCartModal() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'info');
        return;
    }
    
    const modal = createCartModal();
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    modal.innerHTML = `
        <div class="cart-content" style="
            background: white;
            border-radius: 24px;
            padding: 2.5rem;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.95);
            transition: transform 0.2s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="margin: 0; color: #2E5C9A; font-size: 1.75rem;">Tu Carrito</h2>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #999;
                    transition: color 0.2s ease;
                    padding: 0;
                    line-height: 1;
                ">×</button>
            </div>
            
            <div class="cart-items" style="margin-bottom: 2rem;">
                ${cart.map((item, index) => `
                    <div class="cart-item" style="
                        display: flex;
                        gap: 1.5rem;
                        padding: 1.25rem;
                        background: #f8f9fa;
                        border-radius: 15px;
                        margin-bottom: 1rem;
                    ">
                        <img src="${item.image}" alt="${item.name}" style="
                            width: 70px;
                            height: 70px;
                            object-fit: cover;
                            border-radius: 12px;
                        ">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.25rem 0; color: #2E5C9A; font-size: 1rem;">${item.name}</h4>
                            <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.8125rem;">${item.category}</p>
                            <p style="margin: 0; color: #2E5C9A; font-weight: 700; font-size: 1.125rem;">S/. ${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-item" data-index="${index}" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 1.125rem;
                            transition: all 0.2s ease;
                            padding: 0;
                            line-height: 1;
                        ">×</button>
                    </div>
                `).join('')}
            </div>
            
            <div style="
                border-top: 2px solid #e9ecef;
                padding-top: 1.5rem;
                margin-bottom: 1.5rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.125rem; font-weight: 600; color: #666;">Total:</span>
                    <span style="font-size: 1.875rem; font-weight: 800; color: #2E5C9A;">S/. ${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button class="continue-shopping" style="
                    flex: 1;
                    padding: 1rem 1.5rem;
                    background: white;
                    color: #2E5C9A;
                    border: 2px solid #4A90E2;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">Seguir Comprando</button>
                <button class="checkout" style="
                    flex: 1;
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #FDB71A 0%, #F5A623 100%);
                    color: #2E5C9A;
                    border: none;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(253, 183, 26, 0.3);
                ">Finalizar Compra</button>
            </div>
        </div>
    `;
    
    // Event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.continue-shopping').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.checkout').addEventListener('click', () => {
        closeModal(modal);
        showNotification('¡Gracias por tu compra! 🎉', 'success');
        cart = [];
        updateCartCount();
    });
    
    modal.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            closeModal(modal);
            updateCartCount();
            if (cart.length > 0) {
                setTimeout(() => showCartModal(), 50);
            } else {
                showNotification('Carrito vacío', 'info');
            }
        });
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    return modal;
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 200);
}

// ===== VISTA RÁPIDA OPTIMIZADA =====
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showQuickView(this.closest('.product-card'));
        });
    });
}

// OPTIMIZADO: Vista rápida sin backdrop-filter
function showQuickView(productCard) {
    const product = {
        name: productCard.querySelector('.product-name').textContent,
        description: productCard.querySelector('.product-description').textContent,
        price: productCard.querySelector('.price-current').textContent,
        oldPrice: productCard.querySelector('.price-old')?.textContent || '',
        image: productCard.querySelector('.product-image img').src,
        category: productCard.querySelector('.product-category').textContent,
        rating: productCard.querySelector('.stars').textContent,
        ratingCount: productCard.querySelector('.rating-count').textContent
    };
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    modal.innerHTML = `
        <div class="quick-view-content" style="
            background: white;
            border-radius: 24px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.95);
            transition: transform 0.2s ease;
        ">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2.5rem;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="
                        width: 100%;
                        height: 400px;
                        object-fit: cover;
                        border-radius: 20px;
                    ">
                </div>
                
                <div>
                    <button class="close-quick-view" style="
                        float: right;
                        background: none;
                        border: none;
                        font-size: 2rem;
                        cursor: pointer;
                        color: #999;
                        transition: color 0.2s ease;
                        padding: 0;
                        line-height: 1;
                    ">×</button>
                    
                    <span style="
                        display: inline-block;
                        padding: 0.375rem 1rem;
                        background: rgba(74, 144, 226, 0.1);
                        color: #4A90E2;
                        font-size: 0.8125rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        border-radius: 50px;
                        margin-bottom: 1rem;
                    ">${product.category}</span>
                    
                    <h2 style="
                        font-size: 1.75rem;
                        font-weight: 800;
                        color: #2E5C9A;
                        margin: 0 0 1rem 0;
                        line-height: 1.3;
                    ">${product.name}</h2>
                    
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                        <span style="color: #FDB71A; font-size: 1rem;">${product.rating}</span>
                        <span style="color: #999; font-size: 0.875rem;">${product.ratingCount}</span>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 2rem; font-size: 0.95rem;">
                        ${product.description}
                    </p>
                    
                    <div style="margin-bottom: 2rem;">
                        <span style="font-size: 2rem; font-weight: 800; color: #2E5C9A;">${product.price}</span>
                        ${product.oldPrice ? `
                            <span style="font-size: 1.125rem; color: #999; text-decoration: line-through; margin-left: 1rem;">
                                ${product.oldPrice}
                            </span>
                        ` : ''}
                    </div>
                    
                    <button class="add-from-quick-view" style="
                        width: 100%;
                        padding: 1.125rem 2rem;
                        background: linear-gradient(135deg, #FDB71A 0%, #F5A623 100%);
                        color: #2E5C9A;
                        border: none;
                        border-radius: 50px;
                        font-size: 1rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 15px rgba(253, 183, 26, 0.3);
                    ">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.querySelector('.quick-view-content').style.transform = 'scale(1)';
    });
    
    modal.querySelector('.close-quick-view').addEventListener('click', () => closeQuickView(modal));
    
    modal.querySelector('.add-from-quick-view').addEventListener('click', function() {
        const product = {
            name: productCard.querySelector('.product-name').textContent,
            price: getProductPrice(productCard),
            image: productCard.querySelector('.product-image img').src,
            category: productCard.querySelector('.product-category').textContent
        };
        addToCart(product, this);
        closeQuickView(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeQuickView(modal);
    });
}

function closeQuickView(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.quick-view-content').style.transform = 'scale(0.95)';
    setTimeout(() => modal.remove(), 200);
}

// ===== CARGAR MÁS PRODUCTOS =====
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'Cargando...';
            this.style.opacity = '0.6';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                showNotification('No hay más productos para mostrar', 'info');
                this.textContent = 'No hay más productos';
                this.style.background = '#e9ecef';
                this.style.color = '#999';
                this.style.cursor = 'not-allowed';
            }, 1000);
        });
    }
}

// ===== SISTEMA DE NOTIFICACIONES OPTIMIZADO =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#4A90E2'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        font-size: 0.95rem;
        transform: translateX(400px);
        transition: transform 0.2s ease;
        max-width: 320px;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.25rem;">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 200);
    }, 2500);
}

// ===== NEWSLETTER FORM =====
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('.newsletter-input');
            const email = input.value;
            
            if (email) {
                showNotification('¡Gracias por suscribirte!', 'success');
                input.value = '';
            }
        });
    }
}

// ===== ESTILOS CSS OPTIMIZADOS =====
const style = document.createElement('style');
style.textContent = `
    /* Modales optimizados */
    .cart-modal.show {
        opacity: 1 !important;
    }
    
    .cart-modal.show .cart-content {
        transform: scale(1) !important;
    }
    
    /* Hover states simples */
    .close-modal:hover,
    .close-quick-view:hover {
        color: #e74c3c !important;
    }
    
    .remove-item:hover {
        background: #c0392b !important;
        transform: scale(1.05);
    }
    
    .continue-shopping:hover {
        background: rgba(74, 144, 226, 0.1) !important;
    }
    
    .checkout:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(253, 183, 26, 0.4) !important;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .quick-view-content > div {
            grid-template-columns: 1fr !important;
            padding: 1.5rem !important;
        }
        
        .quick-view-content img {
            height: 300px !important;
        }
        
        .notification {
            right: 1rem !important;
            left: 1rem !important;
            max-width: none !important;
        }
        
        .cart-content {
            padding: 1.5rem !important;
        }
    }
    
    /* Optimización para dispositivos con motion reducido */
    @media (prefers-reduced-motion: reduce) {
        * {
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeCategoryFilters();
    initializeSortBy();
    initializeCart();
    initializeQuickView();
    initializeLoadMore();
    initializeNewsletterForm();
});