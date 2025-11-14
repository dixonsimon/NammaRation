const products = [
    { id: 1, name: "Arborio Rice", price: 65, image: "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=", category: "rice", description: "High-quality Arborio rice perfect for risotto.", tags: ["rice","arborio","risotto"], url: "product-arborio-rice.html" },
    { id: 2, name: "Basmati Rice", price: 85, image: "https://media.istockphoto.com/id/519309790/photo/pile-of-raw-basmati-rice-with-a-spoon.jpg?s=612x612&w=0&k=20&c=A9A87HykypkOo5qLMQm6bZjBQn83NE1NHMppw8-6Tnc=", category: "rice", description: "Fragrant long-grain basmati rice.", tags: ["rice","basmati"], url: "product-basmati-rice.html" },
    { id: 3, name: "Masoor Dal", price: 120, image: "https://tiimg.tistatic.com/fp/1/007/565/100-pure-raw-organic-yellow-toor-dal-for-cooking-uses-648.jpg", category: "dal", description: "Masoor dal - nutritious and tasty.", tags: ["dal","masoor","lentils"], url: "product-masoor-dal.html" },
    { id: 4, name: "Toor Dal", price: 110, image: "https://tse3.mm.bing.net/th/id/OIP.VUILLm1dh2QfP4uV_SrasAHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3", category: "dal", description: "Toor dal for everyday cooking.", tags: ["dal","toor","lentils"], url: "product-toor-dal.html" },
    { id: 5, name: "Sunflower Oil", price: 180, image: "https://naturelandorganics.com/cdn/shop/articles/organic-sunflower-oil-Natureland_organics_1200x1200.jpg?v=1673681164", category: "oil", description: "Cold pressed sunflower oil.", tags: ["oil","sunflower"], url: "product-sunflower-oil.html" },
    { id: 6, name: "Mustard Oil", price: 160, image: "https://img.freepik.com/premium-photo/mustard-oil-with-flower-white-background_525574-3245.jpg?w=2000", category: "oil", description: "Pure mustard oil for cooking.", tags: ["oil","mustard"], url: "product-mustard-oil.html" },
    { id: 7, name: "Bathing Soap", price: 25, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpBhsNbkrw-qzAFle7GzIOUES6avcxxckLcw&s", category: "soap", description: "Gentle bathing soap for all skin types.", tags: ["soap","bathing"], url: "product-bathing-soap.html" },
    { id: 8, name: "Detergent Soap", price: 30, image: "https://tse4.mm.bing.net/th/id/OIP.eKqg9wIdSkRcGedOcPAutgHaHI?w=720&h=693&rs=1&pid=ImgDetMain&o=7&rm=3", category: "soap", description: "Effective detergent soap for laundry.", tags: ["soap","detergent"], url: "product-detergent-soap.html" },
    { id: 9, name: "Iodized Salt", price: 20, image: "https://t3.ftcdn.net/jpg/02/94/34/76/360_F_294347652_W3RKypPIHGpnEtGn72J5pC9by14bFntb.jpg", category: "salt", description: "Iodized salt - essential mineral.", tags: ["salt","iodized"], url: "product-salt.html" },
    { id: 10, name: "Sugar", price: 45, image: "https://img.freepik.com/free-photo/world-diabetes-day-sugar-wooden-bowl-dark-surface_1150-26666.jpg", category: "sugar", description: "Refined sugar for daily use.", tags: ["sugar"], url: "product-sugar.html" }
];
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-icon');

    console.log("initializeSearch", { searchInput, searchButton });

    if (!searchInput || !searchButton) {
        console.error("Search input or button not found");
        return;
    }

    searchButton.addEventListener('click', function (e) {
        e.stopPropagation();
        performSearch();
    });

    searchInput.addEventListener('input', function () {
        const val = this.value.trim();
        if (val.length > 1) {
            showSearchSuggestions(val);
        } else {
            hideSearchResults();
        }
    });

    searchInput.addEventListener('focus', function () {
        const val = this.value.trim();
        if (val.length > 1) showSearchSuggestions(val);
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
            hideSearchResults();
        }
    });

    window.addEventListener('resize', () => {
        const current = document.querySelector('.search-results');
        if (current) {
            positionResults(current);
        }
    });

    console.log("Search initialized");
}

function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;
    const term = searchInput.value.trim();
    console.log("performSearch:", term);
    if (term.length === 0) {
        hideSearchResults();
        return;
    }
    const filtered = filterProducts(term);
    if (filtered.length) showSearchResults(filtered, term);
    else showNoResults(term);
}

function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    return products.filter(product => {
        if (product.name.toLowerCase().includes(term)) return true;
        if (product.description.toLowerCase().includes(term)) return true;
        if (product.category.toLowerCase().includes(term)) return true;
        if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term))) return true;
        return false;
    });
}

function showSearchSuggestions(searchTerm) {
    const filtered = filterProducts(searchTerm);
    showSearchResults(filtered, searchTerm);
}

function createResultsContainer() {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.style.position = 'absolute';
    resultsContainer.style.zIndex = 9999;
    resultsContainer.style.background = '#fff';
    resultsContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    resultsContainer.style.borderRadius = '6px';
    resultsContainer.style.overflow = 'auto';
    resultsContainer.style.maxHeight = '320px';
    resultsContainer.style.padding = '8px';
    return resultsContainer;
}

function positionResults(resultsContainer) {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    const rect = searchBar.getBoundingClientRect();
    resultsContainer.style.left = `${rect.left + window.scrollX}px`;
    resultsContainer.style.top = `${rect.bottom + window.scrollY + 6}px`;
    resultsContainer.style.width = `${rect.width}px`;
}

function showSearchResults(list, searchTerm = '') {
    hideSearchResults();

    const resultsContainer = createResultsContainer();

    // Header
    const header = document.createElement('div');
    header.className = 'search-results-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '6px';
    header.innerHTML = `<span style="font-size:14px">${list.length} result${list.length !== 1 ? 's' : ''} for "${escapeHtml(searchTerm)}"</span>`;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-results';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        hideSearchResults();
    });
    header.appendChild(closeBtn);
    resultsContainer.appendChild(header);

    const listEl = document.createElement('div');
    listEl.className = 'search-results-list';

    list.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.display = 'flex';
        item.style.gap = '8px';
        item.style.padding = '6px';
        item.style.alignItems = 'center';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '4px';
        item.addEventListener('mouseenter', () => item.style.background = '#f6f6f6');
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');

        const targetUrl = product.url ? product.url : `product-details.html?id=${product.id}`;
        item.innerHTML = `
            <a href="${escapeHtml(targetUrl)}" style="display:flex;text-decoration:none;color:inherit;align-items:center;width:100%">
                <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width:56px;height:56px;object-fit:cover;border-radius:4px">
                <div style="flex:1;margin-left:8px">
                    <div style="font-weight:600">${escapeHtml(product.name)}</div>
                    <div style="font-size:13px;color:#555">${escapeHtml(product.description)}</div>
                </div>
                <div style="margin-left:8px;font-weight:700">₹${product.price}</div>
            </a>
        `;

        item.querySelector('a').addEventListener('click', (e) => {
        });

        listEl.appendChild(item);
    });

    resultsContainer.appendChild(listEl);

    if (list.length > 3) {
        const viewAll = document.createElement('div');
        viewAll.className = 'view-all-results';
        viewAll.textContent = `View all ${list.length} results`;
        viewAll.style.padding = '8px';
        viewAll.style.textAlign = 'center';
        viewAll.style.cursor = 'pointer';
        viewAll.style.borderTop = '1px solid #eee';
        viewAll.addEventListener('click', () => performSearch());
        resultsContainer.appendChild(viewAll);
    }

    document.body.appendChild(resultsContainer);
    positionResults(resultsContainer);

    resultsContainer.addEventListener('click', (e) => e.stopPropagation());
}

function showNoResults(searchTerm) {
    hideSearchResults();
    const resultsContainer = createResultsContainer();
    resultsContainer.innerHTML = `
        <div class="search-results-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span>No results for "${escapeHtml(searchTerm)}"</span>
            <button class="close-results" style="border:none;background:transparent;font-size:20px;cursor:pointer">&times;</button>
        </div>
        <div style="padding:12px;color:#555">
            <p style="margin:0 0 8px">Try different keywords or browse categories</p>
        </div>
    `;
    const closeBtn = resultsContainer.querySelector('.close-results');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); hideSearchResults(); });
    document.body.appendChild(resultsContainer);
    positionResults(resultsContainer);
    resultsContainer.addEventListener('click', (e) => e.stopPropagation());
}

function hideSearchResults() {
    const existing = document.querySelectorAll('.search-results');
    existing.forEach(el => el.remove());
}

function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (list.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'no-products';
        empty.textContent = 'No products found.';
        grid.appendChild(empty);
        return;
    }

    list.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.border = '1px solid #eee';
        card.style.borderRadius = '6px';
        card.style.padding = '8px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';
        const productUrl = product.url ? product.url : `product-details.html?id=${product.id}`;
        card.innerHTML = `
            <a href="${escapeHtml(productUrl)}" style="text-decoration:none;color:inherit">
                <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width:100%;height:160px;object-fit:cover;border-radius:4px">
                <div class="product-info">
                    <h3 style="margin:4px 0">${escapeHtml(product.name)}</h3>
                    <p class="product-desc" style="font-size:14px;color:#555;margin:0">${escapeHtml(product.description)}</p>
                    <div class="product-meta" style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                        <span class="price" style="font-weight:700">₹${product.price}</span>
                        <button class="view-btn" data-id="${product.id}" style="padding:6px 8px;border:none;background:#007bff;color:#fff;border-radius:4px;cursor:pointer">View</button>
                    </div>
                </div>
            </a>
        `;
        card.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const url = product.url ? product.url : `product-details.html?id=${product.id}`;
            window.location.href = url;
        });
        grid.appendChild(card);
    });
}

function setupCategoryFilters() {
    const categories = document.querySelectorAll('.category');
    if (!categories) return;
    categories.forEach(cat => {
        cat.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            const catName = cat.dataset.category;
            if (!catName || catName === 'all') renderProducts(products);
            else renderProducts(products.filter(p => p.category === catName));
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeSearch();
        renderProducts(products);
        setupCategoryFilters();
    });
} else {
    initializeSearch();
    renderProducts(products);
    setupCategoryFilters();
}