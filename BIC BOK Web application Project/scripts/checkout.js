
        // Import cart functionality
        import { cart } from "../data/cart.js";
        import { Products } from "../data/products_data.js";
        
        
        // Generate unique order ID
        function generateOrderId() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000);
            return `ORD${timestamp}${random}`;
        }

        // Get selected delivery option
        function getSelectedDelivery() {
            const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
            return {
                type: selectedDelivery.value,
                days: parseInt(selectedDelivery.dataset.days),
                price: parseFloat(selectedDelivery.dataset.price)
            };
        }

        // Calculate delivery date based on selected option
        function calculateDeliveryDate(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toISOString();
        }

        // Format delivery estimate
        function formatDeliveryEstimate(days) {
            if (days === 1) {
                return 'Within 24 hours';
            } else if (days === 3) {
                return '3-5 business days';
            } else {
                return '7-10 business days';
            }
        }
        // Update cart count on page load
        function updateCartQuantity() {
            let cartQuantity = 0;
            cart.forEach((item) => {
                cartQuantity += item.quantity;
            });
            document.querySelector('.cart-count').textContent = cartQuantity;
        }

        // Update quantity of an item
        function updateQuantity(productId, newQuantity) {
            const item = cart.find(item => item.productId == productId);
            
            if (item) {
                if (newQuantity <= 0) {
                    // If quantity is 0 or less, remove the item
                    removeFromCart(productId);
                } else {
                    item.quantity = parseInt(newQuantity);
                    // Save to localStorage
                    localStorage.setItem("cart", JSON.stringify(cart));
                    // Reload summary and update count
                    loadCartSummary();
                    updateCartQuantity();
                }
            }
        }

            // Remove item from cart
        function removeFromCart(productId) {
            const itemIndex = cart.findIndex(item => item.productId == productId);
            
            if (itemIndex !== -1) {
                cart.splice(itemIndex, 1);
                // Save to localStorage
                localStorage.setItem("cart", JSON.stringify(cart));
                // Reload summary and update count
                loadCartSummary();
                updateCartQuantity();
            }
        }

        // Update totals based on delivery selection
        function updateTotals() {
            let subtotal = 0;
            
            cart.forEach((item) => {
                const product = Products.find(p => p.id == item.productId);
                if (product) {
                    subtotal += product.price * item.quantity;
                }
            });

            const delivery = getSelectedDelivery();
            const shipping = delivery.price;
            const taxRate = 0.18;
            const tax = subtotal * taxRate;
            const total = subtotal + shipping + tax;

            document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
            document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
            document.getElementById('estimated-delivery').textContent = formatDeliveryEstimate(delivery.days);
        }

        // Load cart items in summary
        function loadCartSummary() {
            const cartItemsContainer = document.getElementById('cart-items-summary');
            let summaryHTML = '';
            let subtotal = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
                // Update totals to zero
                    document.getElementById('subtotal').textContent = `₹0.00`;
                    document.getElementById('shipping').textContent = `₹0.00`;
                    document.getElementById('tax').textContent = `₹0.00`;
                    document.getElementById('total').textContent = `₹50.00`;
                return;
            }

            cart.forEach((item) => {
                const product = Products.find(p => p.id == item.productId);
                
                if(product){
                    const itemTotal = product.price * item.quantity;
                    subtotal += itemTotal;
                      summaryHTML += `
                    <div class="summary-item">
                        <div class="summary-item-info">
                            <h4>${product.name}</h4>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-product-id="${product.id}">-</button>
                            <input type="number" 
                                class="quantity-input" 
                                value="${item.quantity}" 
                                min="1" 
                                max="10"
                                data-product-id="${product.id}">
                            <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
                        </div>
                    </div>
                        <div class="summary-item-actions">
                            <div class="summary-item-price">₹${itemTotal.toFixed(2)}</div>
                            <button class="delete-item-btn" data-product-id="${product.id}">
                                🗑️ Remove
                            </button>
                        </div>
                    </div>
                `;
                }
              
            });

            cartItemsContainer.innerHTML = summaryHTML;

            // Add event listeners to decrease buttons
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            const item = cart.find(item => item.productId == productId);
            if (item && item.quantity > 1) {
                updateQuantity(productId, item.quantity - 1);
            } else if (item && item.quantity === 1) {
                if (confirm('Remove this item from cart?')) {
                    removeFromCart(productId);
                }
            }
        });
    });

    // Add event listeners to increase buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            const item = cart.find(item => item.productId == productId);
            if (item && item.quantity < 10) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });

    // Add event listeners to quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.dataset.productId;
            const newQuantity = parseInt(input.value);
            if (newQuantity > 0 && newQuantity <= 10) {
                updateQuantity(productId, newQuantity);
            } else if (newQuantity <= 0) {
                if (confirm('Remove this item from cart?')) {
                    removeFromCart(productId);
                }
            } else {
                alert('Maximum quantity is 10');
                input.value = 10;
                updateQuantity(productId, 10);
            }
        });
    });

                // Add event listeners to all delete buttons
        document.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                if (confirm('Are you sure you want to remove this item?')) {
                    removeFromCart(productId);
                }
            });
        });

        
            // Calculate totals
            const shipping = 50.00;
            const taxRate = 0.18;
            const tax = subtotal * taxRate;
            const total = subtotal + shipping + tax;

            // Update summary totals
            document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
            document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `₹${total.toFixed(2)}`;

            // Update totals
            updateTotals();

        }

        // Save order to localStorage
            function saveOrder(orderData) {
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(orderData);
                localStorage.setItem('orders', JSON.stringify(orders));
            }

        // Place order button handler
        document.getElementById('placeOrderBtn').addEventListener('click', () => {
               if (cart.length === 0) {
                alert('Your cart is empty! Please add items before placing an order.');
                return;
    }
            // Basic validation
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zipCode = document.getElementById('zipCode').value;
            const country = document.getElementById('country').value;

            if (!email || !phone || !firstName || !lastName || !address || !city || !state || !zipCode || !country) {
            alert('Please fill in all required fields');
            return;
        }

            // alert('Thank you for your order! We will send you a confirmation email shortly.');
            // In a real application, you would submit the form data to a server here
             // Calculate totals
            let subtotal = 0;
            cart.forEach(item => {
                const product = Products.find(p => p.id == item.productId);
                if (product) {
                    subtotal += product.price * item.quantity;
                }
            });
            const delivery = getSelectedDelivery();
            const shipping = 50.00;
            const taxRate = 0.18;
            const tax = subtotal * taxRate;
            const total = subtotal + shipping + tax;

            // Create order object
        const orderData = {
            orderId: generateOrderId(),
            orderDate: new Date().toISOString(),
            deliveryDate: calculateDeliveryDate(delivery.days),
            deliveryType: delivery.type,
            deliveryDays: delivery.days,
            status: 'Processing',
            customerInfo: {
                email: email,
                phone: phone
            },
            shippingAddress: {
                firstName: firstName,
                lastName: lastName,
                address: address,
                apartment: document.getElementById('apartment').value,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country
            },
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            totalAmount: total,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            notes: document.getElementById('notes').value
        };

                // Save order
            saveOrder(orderData);

            // Clear cart
            cart.length = 0;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Redirect to confirmation page
            window.location.href = `orderConfirmation.html?orderId=${orderData.orderId}`;

        });

        // Toggle payment details based on selected method
        document.querySelectorAll('input[name="payment"]').forEach((radio) => {
            radio.addEventListener('change', (e) => {
                const cardDetails = document.getElementById('card-details');
                if (e.target.value === 'card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });

        // Update totals when delivery option changes
            document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
                radio.addEventListener('change', () => {
                    updateTotals();
                });
            });

        // Initialize page
        window.addEventListener('DOMContentLoaded', () => {
            updateCartQuantity();
            loadCartSummary();
        });