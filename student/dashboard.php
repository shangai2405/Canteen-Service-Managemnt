<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
include("../includes/header.php");

include("../components/navbar.php");

checkRole('student');

$items = $conn->query("SELECT * FROM menu_items WHERE is_available = 1");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Dashboard</title>

    <!-- NAVBAR + SEARCH -->
    <link rel="stylesheet" href="/Canteen-Services/assets/css/dashboard.css">
    <script src="/Canteen-Services/assets/js/profile.js" defer></script>
    <script src="/Canteen-Services/assets/js/canteen.js" defer></script>
    <script src="/Canteen-Services/assets/js/search.js" defer></script>

    <!-- MENU + CART -->
    <link rel="stylesheet" href="/Canteen-Services/assets/css/menu.css">
    <link rel="stylesheet" href="/Canteen-Services/assets/css/cart.css">

    <script src="/Canteen-Services/assets/js/cart.js" defer></script>
    <script src="/Canteen-Services/assets/js/cart_checkout.js" defer></script>

</head>
<body>



<!-- ================= WHAT'S ON YOUR MIND ================= -->
<section class="category-section">
    <h2>What’s on your mind?</h2>

    <div class="categories">
        <?php
        $cats = ["Biriyani","Parota","Gravies","Snacks","Savories","Hot Drinks","Beverages"];
        foreach ($cats as $c):
        ?>
            <div class="category" data-category="<?= $c ?>">
                <?= $c ?>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- ================= FOOD LIST ================= -->
<section class="food-section">
    <div class="food-grid">
    <?php while($f = $items->fetch_assoc()): ?>

    <div class="food-card"
        data-id="<?= $f['item_id'] ?>"
        data-price="<?= $f['price'] ?>">

        <img src="/Canteen-Services/uploads/<?= $f['image'] ?? 'food.png' ?>">

        <h4><?= $f['item_name'] ?></h4>
        <p>₹<?= $f['price'] ?></p>

        <!-- ADD BUTTON -->
        <button class="add-btn">ADD</button>

        <!-- QTY CONTROLS -->
        <div class="qty-controls hidden">
            <button class="minus">-</button>
            <span class="qty">1</span>
            <button class="plus">+</button>
        </div>

    </div>

<?php endwhile; ?>

    </div>
</section>

<!-- ================= CUSTOMISATION MODAL ================= -->
<div id="customModal" class="modal hidden">
    <div class="modal-box">
        <h3>Customise Item</h3>

        <label>
            <input type="checkbox" data-price="20"> Extra Parota (+₹20)
        </label><br>

        <label>
            <input type="checkbox" data-price="15"> Chapati (+₹15)
        </label><br>

        <label>
            <input type="checkbox" data-price="10"> Mayo (+₹10)
        </label><br>

        <hr>

        <p><b>Total: ₹<span id="customPrice">0</span></b></p>

        <button id="addCustomItem">Add to Cart</button>
        <button onclick="closeModal()">Cancel</button>
    </div>
</div>
<?php include("../components/cart_modal.php"); ?>

<script src="/Canteen-Services/assets/js/cart_checkout.js"></script>

</body>
</html>
