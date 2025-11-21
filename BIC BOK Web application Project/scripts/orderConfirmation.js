import { Products } from "../data/products_data.js";

// Get order data from URL parameters or localStorage
function getOrderData() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
        // Get from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders.find(order => order.orderId === orderId);
    }
    
    // If no orderId, get the most recent order
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders[orders.length - 1];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// Get delivery date from order data
function getDeliveryDate(orderData) {
    if (orderData.deliveryDate) {
        return formatDate(orderData.deliveryDate);
    }
    // Fallback if old orders don't have deliveryDate
    const date = new Date(orderData.orderDate);
    date.setDate(date.getDate() + 7);
    return formatDate(date);
}

// Load order confirmation
function loadOrderConfirmation() {
    const orderData = getOrderData();
    
    if (!orderData) {
        document.querySelector('.confirmation-container').innerHTML = `
            <div class="empty-orders">
                <h3>No Order Found</h3>
                <p>We couldn't find your order details.</p>
                <a href="index.html" class="btn btn-primary">Go to Home</a>
            </div>
        `;
        return;
    }

    // Display order ID and dates
    document.getElementById('order-id').textContent = orderData.orderId;
    document.getElementById('delivery-date').textContent = getDeliveryDate(orderData);
    document.getElementById('customer-email').textContent = orderData.customerInfo.email;

    // Display order items
    let itemsHTML = '';
    let subtotal = 0;

    orderData.items.forEach(item => {
        const product = Products.find(p => p.id == item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            itemsHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <h4>${product.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="item-price">₹${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }
    });

    document.getElementById('order-items').innerHTML = itemsHTML;

    // Calculate and display totals
    const shipping = 50.00;
    const taxRate = 0.18;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;

    // Display shipping address
    const address = orderData.shippingAddress;
    document.getElementById('shipping-address').innerHTML = `
        <p><strong>${address.firstName} ${address.lastName}</strong></p>
        <p>${address.address}</p>
        ${address.apartment ? `<p>${address.apartment}</p>` : ''}
        <p>${address.city}, ${address.state} ${address.zipCode}</p>
        <p>${address.country}</p>
        <p>Phone: ${orderData.customerInfo.phone}</p>
    `;

    // Update cart count
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartQuantity = 0;
    cart.forEach(item => cartQuantity += item.quantity);
    document.querySelector('.cart-count').textContent = cartQuantity;
}

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    loadOrderConfirmation();
});