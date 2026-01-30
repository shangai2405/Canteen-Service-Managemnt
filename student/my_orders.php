<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('student');

$user_id = $_SESSION['user_id'];

$orders = $conn->query("
SELECT 
    o.order_id, 
    o.status, 
    o.order_time,
    o.prep_end,
    o.prep_minutes,
    t.start_time, 
    t.end_time
FROM orders o
JOIN time_slots t ON o.slot_id = t.slot_id
WHERE o.user_id = $user_id
ORDER BY o.order_time DESC
");

?>

<?php include("../includes/header.php"); ?>

<h2>My Orders</h2>

<?php while($o = $orders->fetch_assoc()): ?>
<div class="card" style="padding:12px; border:1px solid #ddd; margin-bottom:12px;">
    
    <b>Order #<?= $o['order_id'] ?></b><br>
    Slot: <?= $o['start_time'] ?> - <?= $o['end_time'] ?><br>
    Status: <b><?= $o['status'] ?></b><br>
    Ordered at: <?= $o['order_time'] ?><br>

    <?php if ($o['status'] == 'PREPARING' && $o['prep_end']): ?>
        <div class="timer" data-end="<?= strtotime($o['prep_end']) ?>">
            Remaining: <span class="time">calculating...</span>
        </div>
    <?php endif; ?>


    <?php if ($o['status'] == 'READY'): ?>
        <span style="color:green; font-weight:bold;">READY for Pickup!</span>
    <?php endif; ?>

    <?php if ($o['status'] == 'COLLECTED'): ?>
        <span style="color:gray;">Collected</span>
    <?php endif; ?>

</div>
<?php endwhile; ?>


<?php include("../includes/footer.php"); ?>
<script src="/Canteen-Services/assets/js/student_status.js"></script>

