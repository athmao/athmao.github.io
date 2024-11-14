document.addEventListener('DOMContentLoaded', () => {
    // Initialize content and UI components
    initializeContent();
    initializeNavigation();
    initializeCarousel();
    initializeCards();
});

/**
 * Initialize the about section content
 */
function initializeContent() {
    document.getElementById('about-text').innerHTML = aboutContent.text;
}

/**
 * Initialize smooth scrolling navigation
 */
function initializeNavigation() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

/**
 * Handle navigation link clicks
 * @param {Event} e - Click event
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        scrollToSection(targetSection);
    }
}

/**
 * Scroll to the target section with offset
 * @param {HTMLElement} targetSection - The section to scroll to
 */
function scrollToSection(targetSection) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const extraSpace = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--extra-space'));
    const yOffset = -(headerHeight + extraSpace);
    
    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
        top: y,
        behavior: 'smooth'
    });
}

/**
 * Initialize the image carousel
 */
function initializeCarousel() {
    const state = {
        currentIndex: 0,
        isTransitioning: false,
        autoplayInterval: null
    };

    const elements = {
        container: document.querySelector('.carousel-container'),
        carousel: document.querySelector('.carousel'),
        images: document.querySelectorAll('.carousel-image'),
        prevButton: document.querySelector('.carousel-button.prev'),
        nextButton: document.querySelector('.carousel-button.next'),
        dotsContainer: document.querySelector('.carousel-dots')
    };

    // Create carousel dots
    createCarouselDots(elements, state);

    // Add event listeners
    setupCarouselListeners(elements, state);

    // Initialize carousel state
    updateCarousel(elements, state);
    startAutoplay(elements, state);
}

/**
 * Create dots for carousel navigation
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function createCarouselDots(elements, state) {
    elements.images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            if (!state.isTransitioning) {
                goToSlide(elements, state, index);
            }
        });
        
        elements.dotsContainer.appendChild(dot);
    });
    
    elements.dots = document.querySelectorAll('.dot');
}

/**
 * Setup carousel event listeners
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function setupCarouselListeners(elements, state) {
    // Button listeners
    elements.prevButton.addEventListener('click', () => prevSlide(elements, state));
    elements.nextButton.addEventListener('click', () => nextSlide(elements, state));

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    elements.container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    elements.container.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    elements.container.addEventListener('touchend', () => {
        handleTouchEnd(elements, state, touchStartX, touchEndX);
    });

    // Autoplay pause/resume
    elements.container.addEventListener('mouseenter', () => {
        clearInterval(state.autoplayInterval);
    });

    elements.container.addEventListener('mouseleave', () => {
        startAutoplay(elements, state);
    });
}

/**
 * Handle touch end event for swipe
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 * @param {number} startX - Touch start X position
 * @param {number} endX - Touch end X position
 */
function handleTouchEnd(elements, state, startX, endX) {
    const swipeDistance = endX - startX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) >= minSwipeDistance) {
        if (swipeDistance > 0) {
            prevSlide(elements, state);
        } else {
            nextSlide(elements, state);
        }
    }
}

/**
 * Update carousel display
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function updateCarousel(elements, state) {
    if (state.isTransitioning) return;
    
    state.isTransitioning = true;
    const offset = state.currentIndex * -100;
    elements.carousel.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    elements.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.currentIndex);
    });

    // Update button visibility
    elements.prevButton.style.display = state.currentIndex === 0 ? 'none' : 'flex';
    elements.nextButton.style.display = 
        state.currentIndex === elements.images.length - 1 ? 'none' : 'flex';

    // Reset transition lock
    setTimeout(() => {
        state.isTransitioning = false;
    }, 500);
}

/**
 * Go to specific slide
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 * @param {number} index - Target slide index
 */
function goToSlide(elements, state, index) {
    if (state.isTransitioning || index === state.currentIndex) return;
    resetAutoplay(elements, state);
    state.currentIndex = index;
    updateCarousel(elements, state);
}

/**
 * Go to next slide
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function nextSlide(elements, state) {
    if (state.isTransitioning || state.currentIndex >= elements.images.length - 1) return;
    resetAutoplay(elements, state);
    state.currentIndex++;
    updateCarousel(elements, state);
}

/**
 * Go to previous slide
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function prevSlide(elements, state) {
    if (state.isTransitioning || state.currentIndex <= 0) return;
    resetAutoplay(elements, state);
    state.currentIndex--;
    updateCarousel(elements, state);
}

/**
 * Reset autoplay timer
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function resetAutoplay(elements, state) {
    clearInterval(state.autoplayInterval);
    startAutoplay(elements, state);
}

/**
 * Start autoplay
 * @param {Object} elements - Carousel DOM elements
 * @param {Object} state - Carousel state
 */
function startAutoplay(elements, state) {
    state.autoplayInterval = setInterval(() => {
        if (state.currentIndex < elements.images.length - 1) {
            nextSlide(elements, state);
        } else {
            state.currentIndex = 0;
            updateCarousel(elements, state);
        }
    }, 5000);
}

/**
 * Initialize card functionality
 */
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    const navLinks = document.querySelectorAll('nav a');
    let isAnimating = false;

    function setActiveCard(targetId) {
        if (isAnimating) return;

        const targetCard = document.getElementById(targetId);
        const otherCard = [...cards].find(card => card.id !== targetId);

        if (!targetCard || !otherCard) return;
        if (targetCard.classList.contains('active')) return;

        isAnimating = true;

        // Remove all position classes
        cards.forEach(card => {
            card.classList.remove('front', 'back', 'active');
        });

        // Set new positions
        targetCard.classList.add('front', 'active');
        otherCard.classList.add('back');

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Add click handlers to cards
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('active')) {
                setActiveCard(card.id);
            }
        });
    });

    // Add click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            setActiveCard(targetId);
        });
    });

    // Set initial state
    setActiveCard('about');
}
