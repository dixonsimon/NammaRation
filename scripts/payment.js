document.addEventListener('DOMContentLoaded', function () {
    const addressContainer = document.getElementById('address-details');
    const orderSummaryEl = document.getElementById('order-summary');
    const paymentDetails = document.getElementById('payment-details');
    const payNowBtn = document.getElementById('pay-now');
    const paymentMethodEls = document.querySelectorAll('.payment-method');

    const payNowAnchor = payNowBtn.querySelector && payNowBtn.querySelector('a');
    if (payNowAnchor) {
        payNowAnchor.addEventListener('click', (e) => e.preventDefault());
    }

    function formatCurrency(v) {
        return `₹${Number(v || 0).toFixed(2)}`;
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch (e) {
            return [];
        }
    }

    function getDeliveryAddress() {
        try {
            return JSON.parse(localStorage.getItem('deliveryAddress') || 'null');
        } catch (e) {
            return null;
        }
    }

    function renderAddress() {
        const addr = getDeliveryAddress();
        if (!addressContainer) return;
        addressContainer.innerHTML = '';
        if (!addr || !addr.address) {
            addressContainer.innerHTML = '<div style="color:var(--text-light)">No delivery address found. Please add one on the Location page.</div>';
            return;
        }
        const d = document.createElement('div');
        d.className = 'address-card';
        d.innerHTML = `
            <div style="font-weight:700">${addr.address}</div>
            <div style="color:var(--text-light)">PIN: ${addr.pincode || ''} • Phone: ${addr.phone || ''}</div>
        `;
        addressContainer.appendChild(d);
    }

    function renderOrderSummary() {
        if (!orderSummaryEl) return;
        const cart = getCart();
        orderSummaryEl.innerHTML = '';

        if (!cart || cart.length === 0) {
            orderSummaryEl.innerHTML = '<div style="color:var(--text-light)">Your cart is empty.</div>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'order-items';
        let subtotal = 0;

        cart.forEach(item => {
            const qty = Number(item.quantity || 1);
            const price = Number(item.price || 0);
            const line = qty * price;
            subtotal += line;

            const row = document.createElement('div');
            row.className = 'order-item';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.marginBottom = '8px';
            row.innerHTML = `
                <div style="display:flex;gap:8px;align-items:center">
                    <img src="${item.image || ''}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:6px">
                    <div style="min-width:160px">
                        <div style="font-weight:600">${item.name || 'Item'}</div>
                        <div style="color:var(--text-light);font-size:13px">Qty: ${qty}</div>
                    </div>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:700">${formatCurrency(line)}</div>
                    <div style="font-size:12px;color:var(--text-light)">₹${price} / unit</div>
                </div>
            `;
            list.appendChild(row);
        });

        const subtotalRow = document.createElement('div');
        subtotalRow.style.marginTop = '12px';
        subtotalRow.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <div>Subtotal</div>
                <div style="font-weight:700">${formatCurrency(subtotal)}</div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <div>Delivery Fee</div>
                <div>FREE</div>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid #eee;padding-top:8px">
                <div style="font-weight:700">Total</div>
                <div style="font-weight:800">${formatCurrency(subtotal)}</div>
            </div>
        `;

        orderSummaryEl.appendChild(list);
        orderSummaryEl.appendChild(subtotalRow);
    }

    function clearPaymentDetails() {
        if (!paymentDetails) return;
        paymentDetails.innerHTML = '';
    }

    function showCardForm() {
        if (!paymentDetails) return;
        paymentDetails.innerHTML = `
            <div class="card-form">
                <div class="form-row"><label>Card Number</label><input id="card-number" class="form-control" maxlength="19" placeholder="1234 5678 9012 3456"></div>
                <div style="display:flex;gap:8px">
                    <div style="flex:1" class="form-row"><label>Card Holder</label><input id="card-name" class="form-control" placeholder="Name on card"></div>
                    <div style="width:120px" class="form-row"><label>Expiry (MM/YY)</label><input id="card-exp" class="form-control" maxlength="5" placeholder="MM/YY"></div>
                    <div style="width:90px" class="form-row"><label>CVV</label><input id="card-cvv" class="form-control" maxlength="4" placeholder="CVV"></div>
                </div>
            </div>
        `;
    }

    function showUpiForm() {
        if (!paymentDetails) return;
        paymentDetails.innerHTML = `
            <div class="upi-form">
                <div class="form-row"><label>UPI ID</label><input id="upi-id" class="form-control" placeholder="example@bank"></div>
                <div style="color:var(--text-light);font-size:13px;margin-top:6px">You will be redirected to complete UPI payment in a real app.</div>
            </div>
        `;
    }

    function showCodMessage() {
        if (!paymentDetails) return;
        paymentDetails.innerHTML = `<div class="cod-message"><p>Pay with cash when your order is delivered.</p></div>`;
    }

    function setSelectedMethodUI(selectedMethod) {
        paymentMethodEls.forEach(pm => {
            if (pm.dataset.method === selectedMethod) pm.classList.add('selected');
            else pm.classList.remove('selected');
        });
        clearPaymentDetails();
        if (selectedMethod === 'card') showCardForm();
        else if (selectedMethod === 'upi') showUpiForm();
        else showCodMessage();
    }

    function initPaymentMethods() {
        paymentMethodEls.forEach(pm => {
            pm.addEventListener('click', () => {
                const method = pm.dataset.method;
                const input = pm.querySelector('input[type="radio"]');
                if (input) input.checked = true;
                setSelectedMethodUI(method);
            });
            const input = pm.querySelector('input[type="radio"]');
            if (input && input.checked) setSelectedMethodUI(pm.dataset.method);
        });
    }

    function validateCard() {
        const num = (document.getElementById('card-number') || {}).value || '';
        const name = (document.getElementById('card-name') || {}).value || '';
        const exp = (document.getElementById('card-exp') || {}).value || '';
        const cvv = (document.getElementById('card-cvv') || {}).value || '';
        if (num.replace(/\s/g,'').length < 12) { alert('Please enter a valid card number'); return false; }
        if (name.trim().length < 2) { alert('Please enter card holder name'); return false; }
        if (!/^\d{2}\/\d{2}$/.test(exp)) { alert('Please enter expiry in MM/YY'); return false; }
        if (!/^\d{3,4}$/.test(cvv)) { alert('Please enter CVV'); return false; }
        return true;
    }

    function validateUpi() {
        const upi = (document.getElementById('upi-id') || {}).value || '';
        if (upi.trim().length < 3 || !upi.includes('@')) { alert('Please enter a valid UPI ID'); return false; }
        return true;
    }

    function validateBeforePay() {
        const addr = getDeliveryAddress();
        if (!addr || !addr.address) { alert('Please provide a delivery address on the Location page before paying.'); return false; }
        const cart = getCart();
        if (!Array.isArray(cart) || cart.length === 0) { alert('Your cart is empty. Add items before proceeding to payment.'); return false; }

        const selected = document.querySelector('.payment-method input[type="radio"]:checked');
        const method = selected ? (selected.closest('.payment-method') || {}).dataset.method : 'cod';

        if (method === 'card') return validateCard();
        if (method === 'upi') return validateUpi();
        return true; 
    }

    function buildOrderAndRedirect() {
        const cart = getCart();
        const addr = getDeliveryAddress();
        const subtotal = cart.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
        const order = {
            id: 'ORD-' + Date.now(),
            items: cart,
            subtotal,
            deliveryFee: 0,
            total: subtotal,
            address: addr,
            date: new Date().toISOString()
        };
        localStorage.setItem('lastOrder', JSON.stringify(order));
        localStorage.removeItem('cart');
        if (typeof updateCartCount === 'function') try { updateCartCount(); } catch(e) {}
        window.location.href = 'success.html';
    }

    payNowBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!validateBeforePay()) return;
        buildOrderAndRedirect();
    });

    renderAddress();
    renderOrderSummary();
    initPaymentMethods();
});