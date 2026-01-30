<?php
include("../includes/auth_check.php");
include("../config/db.php");
include("../components/navbar.php");

$uid = $_SESSION['user_id'];

$orders = $conn->query("
SELECT o.*, t.start_time, t.end_time
FROM orders o
JOIN time_slots t ON o.slot_id = t.slot_id
WHERE o.user_id = $uid
AND o.status IN ('PREORDERED','PREPARING','READY')
ORDER BY o.order_time DESC
");
?>

<div class="container mt-4">
<h3>Current Orders</h3>

<?php while($o = $orders->fetch_assoc()): ?>

<?php
$items = $conn->query("
SELECT m.item_name, oi.quantity
FROM order_items oi
JOIN menu_items m ON oi.item_id = m.item_id
WHERE oi.order_id = ".$o['order_id']);
?>

<div class="card mb-3 shadow-sm">

    <!-- HEADER CLICKABLE -->
    <div class="card-header d-flex justify-content-between align-items-center"
         onclick="toggleOrder(<?= $o['order_id'] ?>)"
         style="cursor:pointer">

        <div>
            <b>Order #<?= $o['order_id'] ?></b>
            — <span class="order-status 
                <?= $o['status']=='PREPARING'?'text-warning':'' ?>
                <?= $o['status']=='READY'?'text-success':'' ?>">
                <?= $o['status'] ?>
            </span>
        </div>

        <div>▼</div>
    </div>

    <!-- DROPDOWN BODY -->
    <div id="orderBody<?= $o['order_id'] ?>" class="card-body d-none">

        <p><b>Slot:</b> <?= $o['start_time'] ?> - <?= $o['end_time'] ?></p>

        <!-- TIMER -->
        <?php if ($o['status'] == 'PREPARING' && $o['prep_end']): ?>
            <div class="timer mb-2"
                 data-end="<?= strtotime($o['prep_end']) ?>">
                 ⏳ Remaining:
                 <span class="time">calculating...</span>
            </div>
        <?php endif; ?>

        <!-- ITEMS -->
        <p><b>Items:</b></p>
        <ul>
        <?php while($it = $items->fetch_assoc()): ?>
            <li><?= $it['item_name'] ?> × <?= $it['quantity'] ?></li>
        <?php endwhile; ?>
        </ul>

    </div>

</div>

<?php endwhile; ?>

</div>

<script src="/Canteen-Services/assets/js/student_status.js"></script>

<script>
function toggleOrder(id){
    document.getElementById("orderBody"+id).classList.toggle("d-none");
}
</script>
<script src="/Canteen-Services/assets/js/live_order_updates.js"></script>

