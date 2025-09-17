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

function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm.length > 0) {
        alert(`Searching for: ${searchTerm}`);
        // In a real application, this would filter products or redirect to search results
    }
}

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

function addToCart(productId, productName, productPrice, productImage) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${productName} added to cart`);
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