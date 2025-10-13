// scripts/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count in navigation
    updateCartCount();
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-icon');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Form validation for location page
    const locationForm = document.getElementById('location-form');
    if (locationForm) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const pincode = document.getElementById('pincode').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            
            // Validate pincode
            if (pincode.length !== 6 || isNaN(pincode)) {
                alert('Please enter a valid 6-digit PIN code');
                return;
            }
            
            // Validate phone number
            if (phone.length !== 10 || isNaN(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Validate address
            if (address.length < 10) {
                alert('Please enter a complete address');
                return;
            }
            
            // Save address to localStorage
            localStorage.setItem('deliveryAddress', JSON.stringify({
                pincode,
                address,
                phone
            }));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    }
    
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rationCard = document.getElementById('ration-card').value;
            const phone = document.getElementById('phone').value;
            
            // Simple validation
            if (rationCard.length < 5) {
                alert('Please enter a valid ration card number');
                return;
            }
            
            if (phone.length !== 10 || isNaN(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Store user info
            localStorage.setItem('userInfo', JSON.stringify({
                rationCard,
                phone
            }));
            
            // Redirect to home page
            window.location.href = 'home.html';
        });
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// guard set to avoid double-add when multiple handlers fire
const recentAdds = new Set();

function addToCart(productId, productName, productPrice, productImage) {
    // Normalize inputs and provide safe defaults
    const id = productId != null ? String(productId) : `tmp-${Date.now()}`;

    // Prevent accidental duplicate adds (multiple event handlers firing)
    if (recentAdds.has(id)) {
        return;
    }
    recentAdds.add(id);
    // keep key for short period to ignore duplicates (600ms)
    setTimeout(() => recentAdds.delete(id), 600);

    const name = productName || 'Unknown product';
    const price = typeof productPrice === 'number' && !isNaN(productPrice) ? productPrice : parseFloat(productPrice) || 0;
    const image = productImage || '';

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Compare ids as strings to avoid type mismatch
    const existingItem = cart.find(item => String(item.id) === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart`);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
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
            .notification-success { background-color: #28a745; }
            .notification-error { background-color: #dc3545; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search
    if (typeof initializeSearch === 'function') {
        initializeSearch();
    }
    
    // Add to cart functionality for search results and product lists
    document.addEventListener('click', function(e) {
        // match elements that are explicit add-to-cart triggers or common view/add buttons
        const trigger = e.target.closest && e.target.closest('.add-to-cart, .view-btn, [data-add-to-cart], [data-action="add-to-cart"]');
        if (!trigger) return;

        // If this is an Add-to-Cart action, prevent navigation (e.g. when button is inside an <a>)
        const isAddAction = trigger.matches('.add-to-cart, [data-add-to-cart], [data-action="add-to-cart"]');
        if (isAddAction) {
            e.preventDefault();
        }

        // Helper to extract numeric price from text like "₹123" or "123"
        const parsePriceText = (text) => {
            if (!text) return 0;
            const m = String(text).replace(/,/g, '').match(/(\d+(\.\d+)?)/);
            return m ? parseFloat(m[0]) : 0;
        };

        // Try dataset first
        let productId = trigger.dataset.id ?? trigger.getAttribute('data-id');
        let productName = trigger.dataset.name ?? trigger.getAttribute('data-name');
        let productPriceRaw = trigger.dataset.price ?? trigger.getAttribute('data-price');
        let productImage = trigger.dataset.image ?? trigger.getAttribute('data-image');

        // If any important info missing, try to find nearest product card and read from DOM
        if (!productId || !productName || !productPriceRaw || !productImage) {
            const productCard = trigger.closest && trigger.closest('.product-card');
            if (productCard) {
                // id from data-id on card or from link href ?id=
                if (!productId) {
                    productId = productCard.dataset.id || (() => {
                        const a = productCard.querySelector('a[href*="?id="]');
                        if (a) {
                            const url = new URL(a.href, window.location.origin);
                            return url.searchParams.get('id');
                        }
                        return null;
                    })();
                }
                if (!productName) {
                    productName = productCard.querySelector('h3')?.textContent?.trim() ||
                                  productCard.querySelector('.product-info > div')?.textContent?.trim();
                }
                if (!productPriceRaw) {
                    productPriceRaw = productCard.querySelector('.price')?.textContent || productCard.querySelector('.product-price')?.textContent;
                }
                if (!productImage) {
                    productImage = productCard.querySelector('img')?.src;
                }
            }
        }

        // Final normalization
        const productPrice = parseFloat(productPriceRaw) || parsePriceText(productPriceRaw);

        // If still missing a sensible id/name, abort
        if (!productId || !productName) {
            showNotification('Unable to add product to cart (missing data)', 'error');
            return;
        }

        addToCart(productId, productName, productPrice, productImage);
    });
});