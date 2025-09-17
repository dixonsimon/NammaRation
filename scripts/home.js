// scripts/home.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Arborio Rice",
            price: 65,
            image: "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
            category: "rice"
        },
        {
            id: 2,
            name: "Basmati Rice",
            price: 85,
            image: "https://tse1.mm.bing.net/th/id/OIP.jq7GRp6cLYbHxk9TY7KzqQHaF7?rs=1&pid=ImgDetMain&o=7&rm=3",
            category: "rice"
        },
        {
            id: 3,
            name: "Masoor Dal",
            price: 120,
            image: "https://tiimg.tistatic.com/fp/1/007/565/100-pure-raw-organic-yellow-toor-dal-for-cooking-uses-648.jpg",
            category: "dal"
        },
        {
            id: 4,
            name: "Toor Dal",
            price: 110,
            image: "https://tse3.mm.bing.net/th/id/OIP.VUILLm1dh2QfP4uV_SrasAHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3",
            category: "dal"
        },
        {
            id: 5,
            name: "Sunflower Oil",
            price: 180,
            image: "https://naturelandorganics.com/cdn/shop/articles/organic-sunflower-oil-Natureland_organics_1200x1200.jpg?v=1673681164",
            category: "oil"
        },
        {
            id: 6,
            name: "Mustard Oil",
            price: 160,
            image: "https://img.freepik.com/premium-photo/mustard-oil-with-flower-white-background_525574-3245.jpg?w=2000",
            category: "oil"
        },
        {
            id: 7,
            name: "Bathing Soap",
            price: 25,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpBhsNbkrw-qzAFle7GzIOUES6avcxxckLcw&s",
            category: "soap"
        },
        {
            id: 8,
            name: "Detergent Soap",
            price: 30,
            image: "https://tse4.mm.bing.net/th/id/OIP.eKqg9wIdSkRcGedOcPAutgHaHI?w=720&h=693&rs=1&pid=ImgDetMain&o=7&rm=3",
            category: "soap"
        },
        {
            id: 9,
            name: "Iodized Salt",
            price: 20,
            image: "https://t3.ftcdn.net/jpg/02/94/34/76/360_F_294347652_W3RKypPIHGpnEtGn72J5pC9by14bFntb.jpg",
            category: "salt"
        },
        {
            id: 10,
            name: "Sugar",
            price: 45,
            image: "https://img.freepik.com/free-photo/world-diabetes-day-sugar-wooden-bowl-dark-surface_1150-26666.jpg",
            category: "sugar"
        }
    ];
    
    // Render products
    renderProducts(products);
    
    // Category filtering
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.getAttribute('data-category');
            
            // Update active category
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            if (categoryName === 'all') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === categoryName);
                renderProducts(filteredProducts);
            }
        });
    });
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            
            if (product) {
                addToCart(product.id, product.name, product.price, product.image);
            }
        }
    });
});

function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price}/unit</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}