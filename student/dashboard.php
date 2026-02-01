<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
include("../includes/header.php");
include("../components/navbar.php");

checkRole('student');

/* ---------------- CANTEEN ---------------- */
$canteen = $_COOKIE['canteen'] ?? 'AB1';

/* ---------------- FETCH ITEMS ---------------- */
$stmt = $conn->prepare(
    "SELECT * FROM menu_items 
     WHERE is_available = 1 AND canteen = ?"
);
$stmt->bind_param("s", $canteen);
$stmt->execute();
$items = $stmt->get_result();

/* ---------------- MOST ORDERED ---------------- */
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

/* ---------------- CATEGORY ORDER ---------------- */
$sections = [
    "popular"   => "Most Ordered",
    "Biriyani"  => "Biriyani",
    "Gravies"   => "Gravies",
    "Savories"  => "Savouries",
    "Snacks"    => "Snacks",
    "Beverages" => "Beverages"
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Dashboard</title>

    <!-- CSS -->
    <link rel="stylesheet" href="/Canteen-Services/assets/css/dashboard.css">
    <link rel="stylesheet" href="/Canteen-Services/assets/css/menu.css">
    <link rel="stylesheet" href="/Canteen-Services/assets/css/cart.css">

    <!-- JS -->
    <script src="/Canteen-Services/assets/js/profile.js" defer></script>
    <script src="/Canteen-Services/assets/js/canteen.js" defer></script>
    <script src="/Canteen-Services/assets/js/search.js" defer></script>
    <script src="/Canteen-Services/assets/js/cart.js" defer></script>
    <script src="/Canteen-Services/assets/js/cart_checkout.js" defer></script>
    <script src="/Canteen-Services/assets/js/floating_cart.js" defer></script>
</head>

<body>

<!-- ================= FOOD TABS ================= -->
<div class="food-tabs">
    <?php foreach ($sections as $key => $label): ?>
        <button class="tab" onclick="document.getElementById('<?= $key ?>').scrollIntoView({behavior:'smooth'})">
            <?= $label ?>
        </button>
    <?php endforeach; ?>
</div>

<!-- ================= FOOD SECTIONS ================= -->
<section class="food-section">

<?php foreach ($sections as $key => $title): ?>

    <h3 class="food-heading" id="<?= $key ?>"><?= $title ?></h3>

    <div class="food-grid">
    <?php
    $items->data_seek(0); // rewind result set

    while ($f = $items->fetch_assoc()):

        $isPopular = in_array($f['item_id'], $popularItems);

        $show =
            ($key === "popular" && $isPopular) ||
            ($key !== "popular" && $f['category'] === $key);

        if (!$show) continue;
    ?>

        <div class="food-card"
             data-id="<?= $f['item_id'] ?>"
             data-price="<?= $f['price'] ?>">

            <?php if ($isPopular): ?>
                <span class="badge-popular">🔥 Popular</span>
            <?php endif; ?>

            <img src="/Canteen-Services/uploads/<?= $f['image'] ?: 'food.png' ?>">

            <h4><?= htmlspecialchars($f['item_name']) ?></h4>
            <p class="price">₹<?= $f['price'] ?></p>

            <button class="add-btn">ADD</button>

            <div class="qty-controls hidden">
                <button class="minus">−</button>
                <span class="qty">1</span>
                <button class="plus">+</button>
            </div>
        </div>

    <?php endwhile; ?>
    </div>

<?php endforeach; ?>

</section>

<!-- ================= CART MODAL ================= -->
<?php include("../components/cart_modal.php"); ?>

<!-- ================= FLOATING CART BAR ================= -->
<div id="floatingCartBar" class="floating-cart hidden">
    <div><b><span id="floatQty">0</span> items</b></div>
    <div>₹ <span id="floatTotal">0</span></div>
    <button onclick="openCart()">View Cart</button>
</div>

</body>
</html>
