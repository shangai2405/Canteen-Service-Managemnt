console.log("cart.js loaded");

// GLOBAL CART SAFE INIT
if (!window.cart) {
    window.cart = {};
}

document.addEventListener("DOMContentLoaded", () => {

    setupFoodCards();
    setupCustomModal();
    setupCartModal();

});

// ================= FOOD CARD LOGIC =================

function setupFoodCards() {

    document.querySelectorAll(".food-card").forEach(card => {

        const addBtn = card.querySelector(".add-btn");
        const qtyBox = card.querySelector(".qty-controls");
        const plus = card.querySelector(".plus");
        const minus = card.querySelector(".minus");
        const qtyText = card.querySelector(".qty");

        if (!addBtn) return;

        addBtn.addEventListener("click", () => {

            const id = card.dataset.id;
            const price = parseInt(card.dataset.price);

            window.cart[id] = {
                qty: 1,
                price: price
            };

            addBtn.classList.add("hidden");
            qtyBox.classList.remove("hidden");

            // ✅ ADDED FEEDBACK ANIMATION (ONLY NEW PART)
            addBtn.innerText = "✔ Added";
            setTimeout(() => {
                addBtn.innerText = "ADD";
            }, 800);

            updateCartUI();
        });

        plus.addEventListener("click", () => {
            const id = card.dataset.id;
            window.cart[id].qty++;
            qtyText.innerText = window.cart[id].qty;
            updateCartUI();
        });

        minus.addEventListener("click", () => {
            const id = card.dataset.id;
            window.cart[id].qty--;

            if (window.cart[id].qty <= 0) {
                delete window.cart[id];

                addBtn.classList.remove("hidden");
                qtyBox.classList.add("hidden");
                qtyText.innerText = 1;
            } else {
                qtyText.innerText = window.cart[id].qty;
            }

            updateCartUI();
        });

    });

}

// ================= CUSTOMISE MODAL =================

let activeItem = null;

function setupCustomModal() {

    document.querySelectorAll(".customise-btn").forEach(btn => {

        btn.addEventListener("click", e => {
            activeItem = e.target.closest(".food-card");
            openCustomModal();
        });

    });

    const modal = document.getElementById("customModal");
    if (!modal) return;

    modal.querySelectorAll("input").forEach(cb => {
        cb.addEventListener("change", updateCustomPrice);
    });

    const addBtn = document.getElementById("addCustomItem");
    if (addBtn) {
        addBtn.addEventListener("click", addCustomToCart);
    }

}

function openCustomModal() {
    document.getElementById("customModal").classList.remove("hidden");
    updateCustomPrice();
}

function closeCustomModal() {
    document.getElementById("customModal").classList.add("hidden");
}

function updateCustomPrice() {

    if (!activeItem) return;

    let base = parseInt(activeItem.dataset.price);
    let extras = 0;

    document.querySelectorAll("#customModal input:checked")
        .forEach(cb => extras += parseInt(cb.dataset.price));

    document.getElementById("customPrice").innerText = base + extras;

}

function addCustomToCart() {

    if (!activeItem) return;

    const id = activeItem.dataset.id;
    const price = parseInt(document.getElementById("customPrice").innerText);

    if (!window.cart[id]) {
        window.cart[id] = { qty: 1, price };
    } else {
        window.cart[id].qty++;
        window.cart[id].price = price;
    }

    updateCartUI();
    closeCustomModal();
}

// ================= CART MODAL =================

function setupCartModal(){

    const cartBtn = document.getElementById("cartIcon");

    if(!cartBtn) return;

    cartBtn.onclick = openCart;
}

function renderCartModal() {

    const list = document.getElementById("cartItems");
    const totalText = document.getElementById("cartTotal");

    if (!list || !totalText) return;

    list.innerHTML = "";

    let total = 0;

    Object.entries(window.cart).forEach(([id, item]) => {

        total += item.qty * item.price;

        list.innerHTML += `
            <div class="cart-row">
                Item ${id} × ${item.qty} — ₹${item.qty * item.price}
            </div>
        `;
    });

    if (total === 0) {
        list.innerHTML = "No items added yet";
    }

    totalText.innerText = total;

}

// ================= GLOBAL CART UI =================

function updateCartUI() {
    updateCartCount();
    renderCartModal();
}

function updateCartCount() {

    const badge = document.getElementById("cartCount");
    if (!badge) return;

    let total = 0;
    Object.values(window.cart).forEach(i => total += i.qty);

    if (total > 0) {
        badge.innerText = total;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }

    console.log("Cart State:", window.cart);
    badge.classList.add("cart-pop");
    setTimeout(()=> badge.classList.remove("cart-pop"), 300);

}

function openCart(){
    const modal = document.getElementById("cartModal");
    renderCartModal();
    modal.classList.remove("hidden");
}

function closeCart(){
    const modal = document.getElementById("cartModal");
    modal.classList.add("hidden");
}

document.addEventListener("click", function(e){
    const modal = document.getElementById("cartModal");
    if(!modal.classList.contains("hidden") && e.target === modal){
        closeCart();
    }
});
