// Utility Functions
const Utility = {
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },
  
  // Get element by ID
  get: (id) => document.getElementById(id),
  
  // Create element
  create: (tag, classes = []) => {
    const element = document.createElement(tag);
    if (classes.length) {
      element.classList.add(...classes);
    }
    return element;
  },
  
  // Show notification
  showNotification: (message, type = 'info') => {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create new notification
    const notification = Utility.create('div', ['notification', `notification-${type}`]);
    notification.textContent = message;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
      const styles = Utility.create('style', [], `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 5px;
          color: white;
          z-index: 1000;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease;
        }
        .notification-info { background-color: #17a2b8; }
        .notification-success { background-color: #28a745; }
        .notification-warning { background-color: #ffc107; color: #212529; }
        .notification-error { background-color: #dc3545; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `);
      styles.id = 'notification-styles';
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Cart Management
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('nammaRationCart')) || [];
    this.init();
  }
  
  init() {
    this.updateCartIcon();
  }
  
  addItem(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartIcon();
    Utility.showNotification(`${product.name} added to cart`, 'success');
  }
  
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartIcon();
  }
  
  updateQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
      }
    }
  }
  
  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }
  
  getTotalAmount() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartIcon();
  }
  
  saveCart() {
    localStorage.setItem('nammaRationCart', JSON.stringify(this.cart));
  }
  
  updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartBadge = document.querySelector('.cart-badge');
    const totalItems = this.getTotalItems();
    
    if (cartIcon && !cartBadge && totalItems > 0) {
      const badge = Utility.create('span', ['cart-badge']);
      badge.textContent = totalItems;
      cartIcon.appendChild(badge);
    } else if (cartBadge) {
      if (totalItems > 0) {
        cartBadge.textContent = totalItems;
      } else {
        cartBadge.remove();
      }
    }
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const productItems = document.querySelectorAll('.product-item');
  
  // Initialize search if elements exist
  if (searchInput && searchButton && productItems.length > 0) {
    const filterProducts = () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      productItems.forEach(item => {
        const productName = item.getAttribute('data-name').toLowerCase();
        if (productName.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    };
    
    searchButton.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', filterProducts);
  }
  
  // Add cart badge if needed
  cartManager.updateCartIcon();
});