app.js

 /**
 * TradeFair Connect - Client-Side Logic
 * Purpose: Handle product browsing, currency conversion, and cart functionality
 * Storage: localStorage for cart and user preferences
 */

// ========== CONSTANTS & STATE ==========
const STORAGE_KEY = 'tradefair_cart_v1';
const CURRENCY_RATE = 0.0025; // 1 Naira = 0.0025 Espees (example rate)

let cart = [];
let products = [
  {
    id: 1,
    title: 'Premium Ankara Fabric - Blue Pattern',
    seller: 'Grace Fabrics Ltd',
    price: 25000,
    category: 'fabrics',
    image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\'%3E%3Crect fill=\'%23e2e8f0\' width=\'400\' height=\'200\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-family=\'sans-serif\' font-size=\'16\'%3EProduct Image%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    title: 'Rhapsody of Realities - 2026 Edition',
    seller: 'Loveworld Books',
    price: 3500,
    category: 'books',
    image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\'%3E%3Crect fill=\'%23e2e8f0\' width=\'400\' height=\'200\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-family=\'sans-serif\' font-size=\'16\'%3EProduct Image%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    title: 'Organic Honey - 500ml',
    seller: 'Pure Foods Nigeria',
    price: 8000,
    category: 'foods',
    image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\'%3E%3Crect fill=\'%23e2e8f0\' width=\'400\' height=\'200\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-family=\'sans-serif\' font-size=\'16\'%3EProduct Image%3C/text%3E%3C/svg%3E'
  }
];

// ========== LOAD & SAVE DATA ==========
/**
 * Load cart from localStorage
 * @returns {Array} Cart items
 */
function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    cart = stored ? JSON.parse(stored) : [];
    console.log('Cart loaded:', cart.length, 'items');
  } catch (error) {
    console.error('Error loading cart:', error);
    cart = [];
  }
  return cart;
}

/**
 * Save cart to localStorage
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    console.log('Cart saved:', cart.length, 'items');
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

// ========== RENDER FUNCTIONS ==========
/**
 * Render product list with filtering
 * @param {string} filter - Category filter or search term
 */
function renderList(filter = 'all') {
  const listRoot = document.getElementById('list-root');
  if (!listRoot) return;

  // Filter products
  let filteredProducts = products;
  
  if (filter && filter !== 'all') {
    // Check if filter is a category or search term
    const searchLower = filter.toLowerCase();
    filteredProducts = products.filter(product => {
      const matchesCategory = product.category === filter;
      const matchesSearch = product.title.toLowerCase().includes(searchLower) ||
                           product.seller.toLowerCase().includes(searchLower);
      return matchesCategory || matchesSearch;
    });
  }

  // Clear existing content
  listRoot.innerHTML = '';

  // Empty state
  if (filteredProducts.length === 0) {
    listRoot.innerHTML = 
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #64748b;">
        <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">🔍 No products found</p>
        <p>Try adjusting your search or browse all categories.</p>
      </div>
    ;
    return;
  }

  // Render each product
  filteredProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-product-id', product.id);
    card.setAttribute('data-category', product.category);
 card.innerHTML = 
      <img 
        src="${product.image}" 
        alt="${product.title}" 
        class="product-card__image"
        loading="lazy"
      >
      <div class="product-card__content">
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__seller">🏪 ${product.seller}</p>
        <p class="product-card__price">₦${product.price.toLocaleString()}</p>
        <div class="product-card__actions">
          <button class="btn-secondary" data-action="add-cart" data-product-id="${product.id}">Add to Cart</button>
          <button class="btn-secondary" data-action="view-details" data-product-id="${product.id}">View Details</button>
        </div>
      </div>
    ;

    listRoot.appendChild(card);
  });

  console.log('Rendered', filteredProducts.length, 'products');
}

/**
 * Render insights panel with currency conversion and stats
 */
function renderInsights() {
  const insightsPanel = document.getElementById('insights-panel');
  if (!insightsPanel) return;

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Find or create stats container
  let statsContainer = insightsPanel.querySelector('.stats-summary');
  if (!statsContainer) {
    statsContainer = document.createElement('div');
    statsContainer.className = 'stats-summary';
    statsContainer.style.cssText = 'background: #f8fafc; padding: 1rem; border-radius: 8px; margin-top: 1rem;';
    insightsPanel.appendChild(statsContainer);
  }

  statsContainer.innerHTML = 
    <h3 style="font-size: 1rem; margin-bottom: 0.75rem; color: #2563eb;">📊 Marketplace Stats</h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-size: 0.875rem;">
      <div>
        <strong style="color: #1e293b;">${totalProducts}</strong>
        <span style="color: #64748b; display: block;">Products Available</span>
      </div>
      <div>
        <strong style="color: #1e293b;">${cart.length}</strong>
        <span style="color: #64748b; display: block;">Items in Cart</span>
      </div>
      <div>
        <strong style="color: #1e293b;">₦${cartTotal.toLocaleString()}</strong>
        <span style="color: #64748b; display: block;">Cart Total</span>
      </div>
      <div>
        <strong style="color: #1e293b;">ESP ${Math.round(cartTotal * CURRENCY_RATE)}</strong>
        <span style="color: #64748b; display: block;">In Espees</span>
      </div>
    </div>
  ;

  console.log('Insights rendered');
}

/**
 * Update currency converter display
 * @param {number} naira - Amount in Naira
 */
function updateCurrencyDisplay(naira) {
  const nairaInput = document.getElementById('naira-amount');
  const espeesInput = document.getElementById('espees-amount');
  
  if (!nairaInput || !espeesInput) return;

  if (nairaInput.value && naira >= 0) {
    const espees = (naira * CURRENCY_RATE).toFixed(2);
    espeesInput.value = espees;
  } else {
    espeesInput.value = '';
  }
}

// ========== EVENT HANDLERS ==========
/**
 * Handle search and filter functionality
 */
function setupSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.trim();
      renderList(searchTerm);
    });
  }

  // Category chips
  const categoryChips = document.querySelectorAll('.category-chip');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      // Remove active class from all
      categoryChips.forEach(c => c.classList.remove('category-chip--active'));
      // Add active to clicked
      e.target.classList.add('category-chip--active');
      // Filter products
      const category = e.target.getAttribute('data-category');
      renderList(category);
    });
  });
 // Search form submit
  const searchForm = document.querySelector('.hero__search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      renderList(searchTerm);
    });
  }
}

/**
 * Handle currency converter
 */
function setupCurrencyConverter() {
  const nairaInput = document.getElementById('naira-amount');
  if (nairaInput) {
    nairaInput.addEventListener('input', (e) => {
      const naira = parseFloat(e.target.value) || 0;
      updateCurrencyDisplay(naira);
    });
  }
}

/**
 * Handle cart actions (delegated event listener)
 */
function setupCartActions() {
  const listRoot = document.getElementById('list-root');
  if (!listRoot) return;

  listRoot.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const productId = parseInt(button.getAttribute('data-product-id'));

    if (action === 'add-cart' && productId) {
      addToCart(productId);
    } else if (action === 'view-details' && productId) {
      viewProductDetails(productId);
    }
  });
}

/**
 * Add product to cart
 * @param {number} productId - Product ID to add
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Check if already in cart
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    });
  }

  saveData();
  renderInsights();
  
  // Visual feedback
  alert(✅ ${product.title} added to cart!);
  console.log('Added to cart:', product.title);
}

/**
 * View product details (placeholder for future modal/page)
 * @param {number} productId - Product ID to view
 */
function viewProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  alert(📦 ${product.title}\n\n🏪 ${product.seller}\n💰 ₦${product.price.toLocaleString()}\n\nFull product details coming soon!);
  console.log('Viewing product:', product.id);
}

/**
 * Handle load more button
 */
function setupLoadMore() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      // In real app, this would fetch more products from API
      alert('🚀 Loading more products... (This would fetch from backend in production)');
      console.log('Load more clicked');
    });
  }
}

// ========== INITIALIZATION ==========
/**
 * Initialize app on DOM ready
 */
function init() {
  console.log('🚀 TradeFair Connect initializing...');

  // Load data from storage
  loadData();

  // Render initial state
  renderList('all');
  renderInsights();

  // Setup event listeners
  setupSearchAndFilters();
  setupCurrencyConverter();
  setupCartActions();
  setupLoadMore();

  console.log('✅ TradeFair Connect ready!');
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);