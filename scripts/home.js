document.addEventListener('DOMContentLoaded', () => {
  // Sample product data (in a real app, this would come from a server)
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
      name: "Masoor Dal",
      price: 120,
      image: "https://tiimg.tistatic.com/fp/1/007/565/100-pure-raw-organic-yellow-toor-dal-for-cooking-uses-648.jpg",
      category: "dal"
    },
    {
      id: 3,
      name: "Soap",
      price: 25,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpBhsNbkrw-qzAFle7GzIOUES6avcxxckLcw&s",
      category: "soap"
    },
    {
      id: 4,
      name: "Oil",
      price: 180,
      image: "https://naturelandorganics.com/cdn/shop/articles/organic-sunflower-oil-Natureland_organics_1200x1200.jpg?v=1673681164",
      category: "oil"
    }
  ];
  
  // Add event listeners to product items
  const productItems = document.querySelectorAll('.product-item');
  
  productItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const productId = item.getAttribute('data-id');
      const product = products.find(p => p.id == productId);
      
      if (product) {
        cartManager.addItem(product);
      }
    });
  });
  
  // Category filtering
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      
      productItems.forEach(productItem => {
        const productCategory = productItem.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
          productItem.style.display = 'block';
        } else {
          productItem.style.display = 'none';
        }
      });
    });
  });
});