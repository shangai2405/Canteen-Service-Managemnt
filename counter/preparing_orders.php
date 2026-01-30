<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('counter');
include("../includes/header.php");

$orders = $conn->query("
SELECT o.order_id, o.status, u.name, t.start_time, t.end_time 
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN time_slots t ON o.slot_id = t.slot_id
WHERE o.status IN ('PREORDERED','PREPARING','READY')
ORDER BY FIELD(o.status,'PREORDERED','PREPARING','READY'), o.order_time ASC
");
?>

<h2>Orders Queue</h2>

<?php
while ($o = $orders->fetch_assoc()):
?>
<div style="border:1px solid #aaa;padding:10px;margin:10px;">
    <b>Order #<?= $o['order_id'] ?></b><br>
    Student: <?= $o['name'] ?><br>
    Slot: <?= $o['start_time']." - ".$o['end_time'] ?><br>
    Status: <b><?= $o['status'] ?></b><br><br>

    <?php if ($o['status'] == 'PREORDERED'): ?>
        <button onclick="updateStatus(<?= $o['order_id'] ?>, 'PREPARING')">Start Preparing</button>
    <?php elseif ($o['status'] == 'PREPARING'): ?>
        <button onclick="updateStatus(<?= $o['order_id'] ?>, 'READY')">Mark READY</button>
    <?php elseif ($o['status'] == 'READY'): ?>
        <button onclick="updateStatus(<?= $o['order_id'] ?>, 'COLLECTED')">Mark COLLECTED</button>
    <?php endif; ?>
</div>
<?php endwhile; ?>

<script src="/Canteen-Services/assets/js/counter.js"></script>

<?php include("../includes/footer.php"); ?>
