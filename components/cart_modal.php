<div id="cartModal" class="hidden">

    <div class="cart-box">

        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>🛒 Your Cart</h4>
            <span onclick="closeCart()" style="cursor:pointer;font-size:22px;">✕</span>
        </div>

        <div id="cartItems" style="margin-top:15px;">
            No items added yet
        </div>

        <div id="smartSuggestions" class="suggestions-box"></div>

        <hr>

        <h5>Total: ₹<span id="cartTotal">0</span></h5>

        <select id="slotSelect" class="form-select mt-3"></select>

        <button id="placeOrderBtn" class="btn btn-success w-100 mt-3">
            Place Order
        </button>

        <button onclick="closeCart()" class="btn btn-outline-secondary w-100 mt-2">
            Close
        </button>

    </div>

</div>


