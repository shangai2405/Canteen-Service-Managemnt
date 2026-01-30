<?php
include("../includes/auth_check.php");
checkRole('student');
?>

<link rel="stylesheet" href="/Canteen-Services/assets/css/cart.css">
<script src="/Canteen-Services/assets/js/cart.js" defer></script>

<h2>Your Cart</h2>

<div id="cartItems"></div>

<h3>Total: ₹<span id="cartTotal">0</span></h3>

<select name="slot_id" id="slot">
    <option value="">Select Time Slot</option>
</select>

<button onclick="placeOrder()">Place Order</button>
