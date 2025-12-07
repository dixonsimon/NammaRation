document.addEventListener('DOMContentLoaded', function() {
    const products = [
        {
            id: 1,
            name: "Arborio Rice",
            price: 20,
            image: "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
            category: "rice",
            link: "product-arborio-rice.html"
        },
        {
            id: 2,
            name: "Basmati Rice",
            price: 30,
            image: "https://media.istockphoto.com/id/519309790/photo/pile-of-raw-basmati-rice-with-a-spoon.jpg?s=612x612&w=0&k=20&c=A9A87HykypkOo5qLMQm6bZjBQn83NE1NHMppw8-6Tnc=",
            category: "rice",
            link: "product-basmati-rice.html"
        },
        {
            id: 3,
            name: "Masoor Dal",
            price: 30,
            image: "https://tiimg.tistatic.com/fp/1/007/565/100-pure-raw-organic-yellow-toor-dal-for-cooking-uses-648.jpg",
            category: "dal",
            link: "product-masoor-dal.html"
        },
        {
            id: 4,
            name: "Toor Dal",
            price: 50,
            image: "https://tse3.mm.bing.net/th/id/OIP.VUILLm1dh2QfP4uV_SrasAHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3",
            category: "dal",
            link: "product-toor-dal.html"
        },
        {
            id: 5,
            name: "Sunflower Oil",
            price: 85,
            image: "https://naturelandorganics.com/cdn/shop/articles/organic-sunflower-oil-Natureland_organics_1200x1200.jpg?v=1673681164",
            category: "oil",
            link: "product-sunflower-oil.html"
        },
        {
            id: 6,
            name: "Mustard Oil",
            price: 90,
            image: "https://img.freepik.com/premium-photo/mustard-oil-with-flower-white-background_525574-3245.jpg?w=2000",
            category: "oil",
            link: "product-mustard-oil.html"
        },
        {
            id: 7,
            name: "Bathing Soap",
            price: 15,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpBhsNbkrw-qzAFle7GzIOUES6avcxxckLcw&s",
            category: "soap",
            link: "product-bathing-soap.html"
        },
        {
            id: 8,
            name: "Detergent Soap",
            price: 10,
            image: "https://5.imimg.com/data5/JG/BE/PF/SELLER-3629920/detergent-soap.jpg",
            category: "soap",
            link: "product-detergent-soap.html"
        },
        {
            id: 9,
            name: "Iodized Salt",
            price: 12,
            image: "https://t3.ftcdn.net/jpg/02/94/34/76/360_F_294347652_W3RKypPIHGpnEtGn72J5pC9by14bFntb.jpg",
            category: "salt",
            link: "product-salt.html"
        },
        {
            id: 10,
            name: "Sugar",
            price: 15,
            image: "https://img.freepik.com/free-photo/world-diabetes-day-sugar-wooden-bowl-dark-surface_1150-26666.jpg",
            category: "sugar",
            link: "product-sugar.html"
        }
    ];
    
    renderProducts(products);
    
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.getAttribute('data-category');
            
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            if (categoryName === 'all') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === categoryName);
                renderProducts(filteredProducts);
            }
        });
    });
    
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
        <a href="${product.link}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price}/unit</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </a>
        </div>
    `).join('');
}