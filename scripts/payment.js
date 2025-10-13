document.addEventListener('DOMContentLoaded', function() {
    const addressDetails = document.getElementById('address-details');
    const addressData = JSON.parse(localStorage.getItem('deliveryAddress') || '{}');
    
    if (addressData.address) {
        addressDetails.innerHTML = `
            <p><strong>Delivery Address:</strong></p>
            <p>${addressData.address}</p>
            <p>PIN: ${addressData.pincode}</p>
            <p>Phone: ${addressData.phone}</p>
        `;
    } else {
        addressDetails.innerHTML = '<p>No address found. <a href="location.html">Please add an address</a></p>';
    }
    
    const orderSummary = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('pay-now').disabled = true;
        return;
    }
    
    let total = 0;
    let summaryHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    });
    
    summaryHTML += `
        <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; font-weight: bold; display: flex; justify-content: space-between;">
            <span>Total</span>
            <span>₹${total}</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.getElementById('payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            const radio = method.querySelector('input[type="radio"]');
            radio.checked = true;
            
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            
            const methodType = method.getAttribute('data-method');
            
            switch(methodType) {
                case 'card':
                    paymentDetails.innerHTML = `
                        <div class="form-group" style="margin-top: 15px;">
                            <label for="card-number">Card Number</label>
                            <input type="text" id="card-number" class="form-control" placeholder="Enter card number">
                        </div>
                        <div class="form-group">
                            <label for="card-expiry">Expiry Date</label>
                            <input type="text" id="card-expiry" class="form-control" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="card-cvv">CVV</label>
                            <input type="text" id="card-cvv" class="form-control" placeholder="CVV">
                        </div>
                    `;
                    break;
                case 'upi':
                    paymentDetails.innerHTML = `
                        <div class="form-group" style="margin-top: 15px;">
                            <label for="upi-id">UPI ID</label>
                            <input type="text" id="upi-id" class="form-control" placeholder="Enter UPI ID">
                        </div>
                    `;
                    break;
                case 'cod':
                    paymentDetails.innerHTML = `
                        <div class="cod-message">
                            <p>Pay with cash when your order is delivered.</p>
                        </div>
                    `;
                    break;
            }
        });
    });
    
    document.getElementById('pay-now').addEventListener('click', () => {
        window.location.href = 'success.html';
    });
});