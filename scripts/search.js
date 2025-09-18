// scripts/search.js

// Product database
const products = [
    {
        id: 1,
        name: "Arborio Rice",
        price: 65,
        image: "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
        category: "rice",
        description: "High-quality Arborio rice perfect for risotto.",
        tags: ["rice", "arborio", "italian", "risotto"]
    },
    // ... (other products remain the same)
];

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-icon');
    
    console.log("Initializing search...");
    console.log("Search input:", searchInput);
    console.log("Search button:", searchButton);
    
    if (searchInput && searchButton) {
        // Add event listeners
        searchButton.addEventListener('click', function() {
            console.log("Search button clicked");
            performSearch();
            hideSearchResults(); // Hide results when search is performed
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            console.log("Input changed:", searchTerm);
            if (searchTerm.length > 1) {
                showSearchSuggestions(searchTerm);
            } else {
                hideSearchResults();
            }
        });
        
        searchInput.addEventListener('focus', function() {
            const searchTerm = this.value.trim();
            console.log("Input focused");
            if (searchTerm.length > 1) {
                showSearchSuggestions(searchTerm);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log("Enter pressed");
                performSearch();
                hideSearchResults();
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-bar')) {
                hideSearchResults();
            }
        });
        
        console.log("Search initialized successfully");
    } else {
        console.error("Search elements not found");
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput.value.trim();
    
    console.log("Performing search for:", searchTerm);
    
    if (searchTerm.length > 0) {
        // Filter products based on search term
        const filteredProducts = filterProducts(searchTerm);
        
        if (filteredProducts.length > 0) {
            // Show the results in dropdown
            showSearchResults(filteredProducts, searchTerm);
        } else {
            showNoResults(searchTerm);
        }
    }
}

function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    return products.filter(product => {
        // Search in product name
        if (product.name.toLowerCase().includes(term)) return true;
        
        // Search in product description
        if (product.description.toLowerCase().includes(term)) return true;
        
        // Search in product category
        if (product.category.toLowerCase().includes(term)) return true;
        
        // Search in tags
        if (product.tags.some(tag => tag.toLowerCase().includes(term))) return true;
        
        return false;
    });
}

function showSearchSuggestions(searchTerm) {
    const filteredProducts = filterProducts(searchTerm);
    showSearchResults(filteredProducts, searchTerm);
}

function showSearchResults(products, searchTerm) {
    // Remove existing results
    hideSearchResults();
    
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) {
        console.error("Search bar not found");
        return;
    }
    
    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    // Add results header
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-header';
    resultsHeader.innerHTML = `
        <span>${products.length} result${products.length !== 1 ? 's' : ''} for "${searchTerm}"</span>
        <button class="close-results">&times;</button>
    `;
    resultsContainer.appendChild(resultsHeader);
    
    // Add results
    const resultsList = document.createElement('div');
    resultsList.className = 'search-results-list';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'search-result-item';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="search-result-price">₹${product.price}</div>
            </div>
        `;
        
        productElement.addEventListener('click', function() {
            // Redirect to product page
            window.location.href = `product-details.html?id=${product.id}`;
        });
        
        resultsList.appendChild(productElement);
    });
    
    resultsContainer.appendChild(resultsList);
    
    // Add view all results option if there are many products
    if (products.length > 3) {
        const viewAll = document.createElement('div');
        viewAll.className = 'view-all-results';
        viewAll.textContent = `View all ${products.length} results`;
        viewAll.addEventListener('click', function() {
            performSearch();
        });
        resultsContainer.appendChild(viewAll);
    }
    
    searchBar.appendChild(resultsContainer);
    
    // Add close button functionality
    const closeButton = resultsContainer.querySelector('.close-results');
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        hideSearchResults();
    });
}

function showNoResults(searchTerm) {
    // Remove existing results
    hideSearchResults();
    
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    
    // Create no results message
    const noResults = document.createElement('div');
    noResults.className = 'search-results no-results';
    noResults.innerHTML = `
        <div class="search-results-header">
            <span>No results for "${searchTerm}"</span>
            <button class="close-results">&times;</button>
        </div>
        <div class="no-results-message">
            <i class="fas fa-search"></i>
            <p>Try different keywords or browse categories</p>
        </div>
    `;
    
    searchBar.appendChild(noResults);
    
    // Add close button functionality
    const closeButton = noResults.querySelector('.close-results');
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        hideSearchResults();
    });
}

function hideSearchResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}