import { Products } from "../data/products_data.js";
import { cart, addToCart, updateCartQuantity } from "../data/cart.js";

// When the page loads shpwa on cart icon total product selected 
window.addEventListener('DOMContentLoaded', () => {
    updateCartQuantity()
});

// Make product grid dynamic 

let products_html = ``;

Products.forEach((product)=>{
    products_html+= `
    <div class="product-card">
                    <div class="product-image">
                        <img src="images/${product.image}" alt="${product.name}" />
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">₹${product.price}</p>
                        <div class="quantity-selector">
                            
                        </div>
                        <button class="add-to-cart-btn" data-product-id= "${product.id}" data-price="${product.price}">Add to Cart</button>
                    </div>
                </div>
    `;
});

document.querySelector(".products-grid").innerHTML = products_html;

// Cart logic 
document.querySelectorAll(".add-to-cart-btn").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        const cart_product_Id = btn.dataset.productId;
        addToCart(cart_product_Id);
        updateCartQuantity();
    });
});

// After inserting HTML, add error handlers
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'images/placeholder.jpg'; // Add a placeholder image
        this.alt = 'Image not available';
    });
});