document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productItems = document.querySelectorAll('.product-item');

    // Check if search elements exist on the page before adding listeners
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
        
        // Filter as the user types
        searchInput.addEventListener('keyup', filterProducts);
    }
});