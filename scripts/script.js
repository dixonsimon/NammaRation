document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    updateCartCount();
    
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
    
    const locationForm = document.getElementById('location-form');
    if (locationForm) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pincode = document.getElementById('pincode').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            
            if (pincode.length !== 6 || isNaN(pincode)) {
                alert('Please enter a valid 6-digit PIN code');
                return;
            }
            
            if (phone.length !== 10 || isNaN(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            if (address.length < 10) {
                alert('Please enter a complete address');
                return;
            }
            
            localStorage.setItem('deliveryAddress', JSON.stringify({
                pincode,
                address,
                phone
            }));
            
            window.location.href = 'payment.html';
        });
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rationCard = document.getElementById('ration-card').value;
            const phone = document.getElementById('phone').value;
            
            if (rationCard.length < 5) {
                alert('Please enter a valid ration card number');
                return;
            }
            
            if (phone.length !== 10 || isNaN(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            localStorage.setItem('userInfo', JSON.stringify({
                rationCard,
                phone
            }));
            
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

const recentAdds = new Set();

function addToCart(productId, productName, productPrice, productImage) {
    const id = productId != null ? String(productId) : `tmp-${Date.now()}`;

    if (recentAdds.has(id)) {
        return;
    }
    recentAdds.add(id);
    setTimeout(() => recentAdds.delete(id), 600);

    const name = productName || 'Unknown product';
    const price = typeof productPrice === 'number' && !isNaN(productPrice) ? productPrice : parseFloat(productPrice) || 0;
    const image = productImage || '';

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
    
    showNotification(`${name} added to cart`);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializeSearch === 'function') {
        initializeSearch();
    }
    
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest && e.target.closest('.add-to-cart, .view-btn, [data-add-to-cart], [data-action="add-to-cart"]');
        if (!trigger) return;

        const isAddAction = trigger.matches('.add-to-cart, [data-add-to-cart], [data-action="add-to-cart"]');
        if (isAddAction) {
            e.preventDefault();
        }

        const parsePriceText = (text) => {
            if (!text) return 0;
            const m = String(text).replace(/,/g, '').match(/(\d+(\.\d+)?)/);
            return m ? parseFloat(m[0]) : 0;
        };

        let productId = trigger.dataset.id ?? trigger.getAttribute('data-id');
        let productName = trigger.dataset.name ?? trigger.getAttribute('data-name');
        let productPriceRaw = trigger.dataset.price ?? trigger.getAttribute('data-price');
        let productImage = trigger.dataset.image ?? trigger.getAttribute('data-image');

        if (!productId || !productName || !productPriceRaw || !productImage) {
            const productCard = trigger.closest && trigger.closest('.product-card');
            if (productCard) {
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

        const productPrice = parseFloat(productPriceRaw) || parsePriceText(productPriceRaw);

        if (!productId || !productName) {
            showNotification('Unable to add product to cart (missing data)', 'error');
            return;
        }

        addToCart(productId, productName, productPrice, productImage);
    });
});