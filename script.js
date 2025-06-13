// Constantes y variables globales
const TRANSITION_TIME = 500;

// Clase para manejar el carrusel de promociones
class PromoCarousel {
    constructor() {
        this.carousel = document.getElementById('promoCarousel');
        this.slides = document.querySelectorAll('.promo-slide');
        this.prevButton = document.getElementById('prevPromo');
        this.nextButton = document.getElementById('nextPromo');
        this.dotsContainer = document.getElementById('promoDots');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoplayInterval = null;
        
        this.init();
    }

    init() {
        // Crear los puntos indicadores
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('promo-dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // Configurar los botones de navegación
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Iniciar el autoplay
        this.startAutoplay();

        // Pausar el autoplay cuando el mouse está sobre el carrusel
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Actualizar el estado inicial
        this.updateCarousel();
    }

    updateCarousel() {
        // Actualizar la posición del carrusel
        this.carousel.style.transform = `translateX(-${this.currentSlide * 25}%)`;

        // Actualizar los puntos indicadores
        const dots = this.dotsContainer.querySelectorAll('.promo-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Función de utilidad para debounce
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

// Mostrar/ocultar el campo de búsqueda al hacer clic en el ícono
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');

    // Función para mostrar/ocultar el campo de búsqueda
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.classList.toggle('visible');
        if (searchInput.classList.contains('visible')) {
            searchInput.focus();
        }
    });

    // Cerrar búsqueda al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
            searchInput.classList.remove('visible');
            suggestionsContainer.style.display = 'none';
        }
    });

    // Manejar la búsqueda
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredGames = videojuegos.filter(game =>
            game.nombre.toLowerCase().includes(query)
        );

        if (filteredGames.length > 0) {
            suggestionsContainer.innerHTML = filteredGames
                .map(game => `
                    <div class="suggestion-item">
                        <div class="suggestion-content">
                            <div class="suggestion-title">${game.nombre}</div>
                            <div class="suggestion-price">$${game.precio.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.innerHTML = '<div class="suggestion-item no-results">No se encontraron juegos</div>';
            suggestionsContainer.style.display = 'block';
        }
    });

    // Cerrar sugerencias al presionar ESC
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.classList.remove('visible');
            suggestionsContainer.style.display = 'none';
            searchInput.value = '';
        }
    });
});

// Función de búsqueda mejorada
class SearchEngine {
    constructor() {
        this.searchIcon = document.getElementById('searchIcon');
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('suggestions');
        this.games = this.indexGames();
        this.init();
    }

    indexGames() {
        return Array.from(document.querySelectorAll('.game-item')).map(game => ({
            element: game,
            title: game.querySelector('h3').textContent.toLowerCase(),
            price: game.querySelector('.price').textContent,
            searchableText: game.querySelector('h3').textContent.toLowerCase()
        }));
    }

    init() {
        // Asegurarse de que los elementos existen
        if (!this.searchIcon || !this.searchInput || !this.suggestionsContainer) {
            console.error('No se encontraron los elementos necesarios para la búsqueda');
            return;
        }

        // Evento para el ícono de búsqueda
        this.searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSearch();
        });

        // Evento para el input de búsqueda
        this.searchInput.addEventListener('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Evento para cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.suggestionsContainer.contains(e.target) && 
                !this.searchIcon.contains(e.target)) {
                this.hideSearch();
            }
        });

        // Evento para las sugerencias
        this.suggestionsContainer.addEventListener('click', (e) => {
            const suggestionItem = e.target.closest('.suggestion-item');
            if (suggestionItem) {
                e.preventDefault();
            e.stopPropagation();
                const gameTitle = suggestionItem.querySelector('.suggestion-title').textContent;
                this.scrollToGame(gameTitle);
            }
        });

        // Eventos de teclado
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSearch();
            } else if (e.key === 'Enter') {
                const firstSuggestion = this.suggestionsContainer.querySelector('.suggestion-item');
                if (firstSuggestion) {
                    const gameTitle = firstSuggestion.querySelector('.suggestion-title').textContent;
                    this.scrollToGame(gameTitle);
                }
            }
        });

        // Inicializar estado
        this.hideSearch();
    }

    toggleSearch() {
        if (this.searchInput.classList.contains('visible')) {
            this.hideSearch();
        } else {
            this.showSearch();
        }
    }

    showSearch() {
        this.searchInput.classList.add('visible');
            this.searchInput.style.width = '200px';
            this.searchInput.style.opacity = '1';
            this.searchInput.style.visibility = 'visible';
        this.searchInput.focus();
    }

    hideSearch() {
        this.searchInput.classList.remove('visible');
        this.searchInput.value = '';
        this.searchInput.style.width = '0';
        this.searchInput.style.opacity = '0';
        this.searchInput.style.visibility = 'hidden';
        this.suggestionsContainer.style.display = 'none';
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.suggestionsContainer.style.display = 'none';
            return;
        }

        query = query.toLowerCase().trim();
        const results = this.searchGames(query);
        this.displayResults(results);
    }

    searchGames(query) {
        const words = query.split(' ').filter(word => word.length > 0);
        return this.games.filter(game => {
            // Búsqueda exacta
            if (game.searchableText.includes(query)) {
                return true;
            }
            
            // Búsqueda por palabras individuales
            return words.every(word => game.searchableText.includes(word));
        });
    }

    displayResults(results) {
        if (results.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-item no-results">
                    No se encontraron juegos
                </div>`;
        } else {
            this.suggestionsContainer.innerHTML = results
                .slice(0, 5)
                .map(game => `
                    <div class="suggestion-item">
                <div class="suggestion-content">
                    <div class="suggestion-title">${game.title}</div>
                    <div class="suggestion-price">${game.price}</div>
                </div>
                    </div>
                `).join('');
        }
        this.suggestionsContainer.style.display = 'block';
    }

    scrollToGame(gameTitle) {
        const game = this.games.find(g => g.title === gameTitle.toLowerCase());
        if (game && game.element) {
            // Ocultar la búsqueda
            this.hideSearch();
            
            // Remover resaltado de cualquier juego previamente resaltado
            document.querySelectorAll('.game-found').forEach(el => {
                el.classList.remove('game-found');
                el.style.animation = 'none';
            });

            // Desplazarse a la sección de juegos
            const featuredSection = document.querySelector('#featured');
            featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Calcular la posición del juego y desplazarse a él
            const targetGame = game.element;
            setTimeout(() => {
                const gameRect = targetGame.getBoundingClientRect();
                const offset = window.pageYOffset + gameRect.top - (window.innerHeight / 2) + (gameRect.height / 2);
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                // Resaltar el juego encontrado
                targetGame.style.animation = 'none';
                targetGame.offsetHeight; // Forzar reflow
                targetGame.style.animation = 'highlight-found 2s ease-in-out';
                targetGame.classList.add('game-found');

                // Remover la clase después de la animación
                setTimeout(() => {
                    targetGame.classList.remove('game-found');
                }, 2000);
            }, 500);
        }
    }
}

// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartIcon = document.getElementById('cartIcon');
        this.cartDropdown = document.getElementById('cartDropdown');
        this.cartItems = document.getElementById('cartItems');
        this.cartCount = document.getElementById('cartCount');
        this.cartTotal = document.getElementById('cartTotal');
        this.checkoutButton = document.getElementById('checkoutButton');
        this.paymentModal = document.getElementById('paymentModal');
        
        this.init();
        this.bindEvents();
    }

    init() {
        // Cargar carrito del localStorage si existe
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCart();
        }
    }

    bindEvents() {
        // Event listeners
        this.cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCart();
        });
        
        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.cartIcon.contains(e.target) && 
                !this.cartDropdown.contains(e.target)) {
                this.cartDropdown.classList.remove('show');
            }
        });

        // Usar delegación de eventos para los botones de compra
        document.body.addEventListener('click', (e) => {
            const buyButton = e.target.closest('.buy-button');
            if (buyButton) {
                e.preventDefault();
                e.stopPropagation();
                this.addItem(buyButton);
            }
        });

        // Listener para el botón de checkout
        this.checkoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.items.length > 0) {
                this.processPayment();
            } else {
                alert('El carrito está vacío');
            }
        });

        // Listener para remover items
        this.cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const itemId = parseInt(e.target.dataset.id);
                this.removeItem(itemId);
            }
        });

        // Cerrar modal al hacer clic fuera
        this.paymentModal.addEventListener('click', (e) => {
            if (e.target === this.paymentModal) {
                this.closePaymentModal();
            }
        });
    }

    toggleCart() {
        this.cartDropdown.classList.toggle('show');
    }

    addItem(item) {
        const platform = item.closest('.game-item').querySelector('.platform-select').value;
        const cartItem = {
            id: item.dataset.id,
            name: `${item.dataset.name} (${platform})`,
            price: parseFloat(item.dataset.price),
            platform: platform
        };

        this.items.push(cartItem);
        this.updateCart();
        this.saveCart();
        
        // Actualizar el contador del carrito
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = this.items.length;
        cartCount.classList.add('updated');
        setTimeout(() => cartCount.classList.remove('updated'), 200);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
        this.saveCart();
        
        // Actualizar el contador del carrito
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = this.items.length;
    }

    updateCart() {
        // Actualizar lista de items
        this.cartItems.innerHTML = this.items.length > 0 ? this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">×</button>
            </div>
        `).join('') : '<p class="empty-cart">El carrito está vacío</p>';

        // Actualizar total
        const total = this.items.reduce((sum, item) => sum + item.price, 0);
        this.cartTotal.textContent = `$${total.toFixed(2)}`;

        // Actualizar visibilidad del botón de pago
        this.checkoutButton.style.display = this.items.length > 0 ? 'block' : 'none';
    }

    clearCart() {
        this.items = [];
        this.updateCart();
        this.saveCart();
        this.cartDropdown.classList.remove('show');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    processPayment() {
        // Preparar el modal
        const modal = this.paymentModal;
        const details = modal.querySelector('.payment-details');
        const total = this.items.reduce((sum, item) => 
            sum + (item.price * (item.quantity || 1)), 0);

        // Mostrar detalles de la compra
        details.innerHTML = `
            <p>Total de la compra: $${total.toFixed(2)}</p>
            <p>Número de artículos: ${this.items.length}</p>
            <p>Fecha: ${new Date().toLocaleDateString()}</p>
        `;

        // Mostrar y animar el modal
        modal.classList.add('show');
        setTimeout(() => {
            modal.querySelector('.payment-modal-content').style.opacity = '1';
            modal.querySelector('.payment-modal-content').style.transform = 'translateY(0)';
        }, 10);

        // Simular procesamiento de pago
        setTimeout(() => {
            modal.classList.add('success');
            
            // Esperar a que termine la animación antes de limpiar el carrito
            setTimeout(() => {
                this.clearCart();
                
                // Cerrar el modal después de mostrar el éxito
                setTimeout(() => {
                    this.closePaymentModal();
                }, 2000);
            }, 2500);
        }, 2000);
    }

    closePaymentModal() {
        const modal = this.paymentModal;
        modal.querySelector('.payment-modal-content').style.opacity = '0';
        modal.querySelector('.payment-modal-content').style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            modal.classList.remove('show', 'success');
        }, 300);
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el carrito
    window.cart = new ShoppingCart();
    
    // Función simple para la búsqueda
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    let isSearchVisible = false;

    // Función para mostrar/ocultar la búsqueda
    function toggleSearch(show) {
        isSearchVisible = show !== undefined ? show : !isSearchVisible;
        searchInput.classList.toggle('visible', isSearchVisible);
        if (isSearchVisible) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            suggestionsContainer.style.display = 'none';
        }
    }

    // Función para buscar juegos
    function searchGames(query) {
        return Array.from(document.querySelectorAll('.game-item'))
            .map(game => ({
                element: game,
                title: game.querySelector('h3').textContent,
                price: game.querySelector('.price').textContent
            }))
            .filter(game => 
                game.title.toLowerCase().includes(query.toLowerCase())
            );
    }

    // Función para mostrar sugerencias
    function showSuggestions(results) {
        if (results.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="suggestion-item no-results">
                    No se encontraron juegos
                </div>`;
        } else {
            suggestionsContainer.innerHTML = results
                .slice(0, 5)
                .map(game => `
                    <div class="suggestion-item" data-title="${game.title}">
                        <div class="suggestion-content">
                            <div class="suggestion-title">${game.title}</div>
                            <div class="suggestion-price">${game.price}</div>
                        </div>
                    </div>
                `).join('');
        }
        suggestionsContainer.style.display = 'block';
    }

    // Función para resaltar juego
    function highlightGame(gameElement) {
        if (!gameElement) return;

        // Limpiar resaltados anteriores
        document.querySelectorAll('.game-found').forEach(el => {
            el.classList.remove('game-found');
            el.style.animation = 'none';
        });

        // Scroll a la sección de juegos
        const featuredSection = document.querySelector('#featured');
        featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Resaltar el juego seleccionado
        setTimeout(() => {
            const offset = gameElement.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (gameElement.offsetHeight / 2);
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });

            gameElement.style.animation = 'none';
            gameElement.offsetHeight; // Forzar reflow
            gameElement.style.animation = 'highlight-found 2s ease-in-out';
            gameElement.classList.add('game-found');

            setTimeout(() => {
                gameElement.classList.remove('game-found');
            }, 2000);
        }, 500);
    }

    // Event Listeners
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSearch();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            const results = searchGames(query);
            showSuggestions(results);
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    suggestionsContainer.addEventListener('click', (e) => {
        const suggestionItem = e.target.closest('.suggestion-item');
        if (suggestionItem && !suggestionItem.classList.contains('no-results')) {
            const gameTitle = suggestionItem.dataset.title;
            const gameElement = Array.from(document.querySelectorAll('.game-item'))
                .find(game => game.querySelector('h3').textContent === gameTitle);
            
            if (gameElement) {
                toggleSearch(false);
                highlightGame(gameElement);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && 
            !searchButton.contains(e.target) && 
            !suggestionsContainer.contains(e.target)) {
            toggleSearch(false);
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleSearch(false);
        } else if (e.key === 'Enter') {
            const firstSuggestion = suggestionsContainer.querySelector('.suggestion-item:not(.no-results)');
            if (firstSuggestion) {
                const gameTitle = firstSuggestion.dataset.title;
                const gameElement = Array.from(document.querySelectorAll('.game-item'))
                    .find(game => game.querySelector('h3').textContent === gameTitle);
                
                if (gameElement) {
                    toggleSearch(false);
                    highlightGame(gameElement);
                }
            }
        }
    });

    // Inicializar estado
    toggleSearch(false);

    // Inicializar el carrusel
    new PromoCarousel();
});

// Datos de videojuegos
const videojuegos = [
    { nombre: "Grand Theft Auto V", id: "featured", precio: 29.99 },
    { nombre: "Minecraft", id: "featured", precio: 26.99 },
    { nombre: "Red Dead Redemption 2", id: "featured", precio: 39.99 },
    { nombre: "The Witcher 3", id: "featured", precio: 39.99 },
    { nombre: "Elden Ring", id: "featured", precio: 59.99 },
    { nombre: "EA Sports FC 24", id: "featured", precio: 69.99 },
    { nombre: "Cyberpunk 2077", id: "featured", precio: 49.99 },
    { nombre: "Assassin's Creed Mirage", id: "featured", precio: 49.99 },
    { nombre: "Hogwarts Legacy", id: "featured", precio: 59.99 },
    { nombre: "Resident Evil 4", id: "featured", precio: 59.99 },
    { nombre: "Mortal Kombat 1", id: "featured", precio: 69.99 },
    { nombre: "Diablo IV", id: "featured", precio: 69.99 },
    { nombre: "Street Fighter 6", id: "featured", precio: 59.99 },
    { nombre: "Final Fantasy XVI", id: "featured", precio: 69.99 },
    { nombre: "Lies of P", id: "featured", precio: 59.99 }
];
