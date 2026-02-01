<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
include("../includes/header.php");
include("../components/navbar.php");

checkRole('student');

/* ---------- CANTEEN ---------- */
$canteen = $_COOKIE['canteen'] ?? 'AB1';

/* ---------- MENU ITEMS ---------- */
$stmt = $conn->prepare(
    "SELECT * FROM menu_items 
     WHERE is_available = 1 
     AND canteen = ?
     ORDER BY item_name"
);
$stmt->bind_param("s", $canteen);
$stmt->execute();
$items = $stmt->get_result();

/* ---------- POPULAR ITEMS ---------- */
$popularItems = [];
$popularQ = $conn->query("
    SELECT item_id
    FROM order_items
    GROUP BY item_id
    ORDER BY COUNT(*) DESC
    LIMIT 10
");
while ($p = $popularQ->fetch_assoc()) {
    $popularItems[] = $p['item_id'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student Dashboard</title>

<link rel="stylesheet" href="/Canteen-Services/assets/css/dashboard.css">
<link rel="stylesheet" href="/Canteen-Services/assets/css/menu.css">
<link rel="stylesheet" href="/Canteen-Services/assets/css/cart.css">

<script src="/Canteen-Services/assets/js/menu_filter.js" defer></script>
<script src="/Canteen-Services/assets/js/cart.js" defer></script>
<script src="/Canteen-Services/assets/js/cart_checkout.js" defer></script>
<script src="/Canteen-Services/assets/js/floating_cart.js" defer></script>

</head>

<body>

<!-- ================= FOOD TABS ================= -->
<div class="food-tabs">
    <button class="tab active" data-filter="popular">Most Ordered</button>
    <button class="tab" data-filter="biriyani">Biriyani</button>
    <button class="tab" data-filter="gravies">Gravies</button>
    <button class="tab" data-filter="savories">Savouries</button>
    <button class="tab" data-filter="snacks">Snacks</button>
    <button class="tab" data-filter="beverages">Beverages</button>
</div>

<!-- ================= FOOD GRID ================= -->
<section class="food-section">
<div class="food-grid">

<?php while ($f = $items->fetch_assoc()): 
    $category = strtolower(trim($f['category']));
?>
<div class="food-card modern"
     data-id="<?= $f['item_id'] ?>"
     data-price="<?= $f['price'] ?>"
     data-category="<?= $category ?>"
     data-popular="<?= in_array($f['item_id'], $popularItems) ? '1' : '0' ?>">

    <div class="food-img">
        <img src="/Canteen-Services/uploads/<?= $f['image'] ?? 'food.png' ?>">
        <?php if (in_array($f['item_id'], $popularItems)): ?>
            <span class="badge popular">🔥 Popular</span>
        <?php endif; ?>
    </div>

    <div class="food-info">
        <h4><?= htmlspecialchars($f['item_name']) ?></h4>
        <p class="price">₹<?= $f['price'] ?></p>

        <button class="add-btn">ADD</button>

        <div class="qty-controls hidden">
            <button class="minus">−</button>
            <span class="qty">1</span>
            <button class="plus">+</button>
        </div>
    </div>

</div>


<?php endwhile; ?>

</div>
</section>

<!-- ================= CART MODAL ================= -->
<?php include("../components/cart_modal.php"); ?>

<!-- ================= FLOATING CART ================= -->
<div id="floatingCartBar" class="floating-cart hidden">
    <div><b><span id="floatQty">0</span> items</b></div>
    <div>₹ <span id="floatTotal">0</span></div>
    <button onclick="openCart()">View Cart</button>
</div>

</body>
</html>
