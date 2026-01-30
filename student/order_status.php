<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('student');

$user = $_SESSION['user_id'];

$q = $conn->query("
SELECT *
FROM orders
WHERE user_id=$user
ORDER BY order_time DESC
LIMIT 1
");

$order = $q->fetch_assoc();
?>

<h2>Your Latest Order</h2>

<?php if (!$order): ?>
    <p>No active orders.</p>
<?php else: ?>

Status: <b><?= $order['status'] ?></b><br>

<?php if ($order['status'] == 'PREPARING' && $order['prep_end']): ?>
    <div class="timer" data-end="<?= strtotime($order['prep_end']) ?>">
        <b>Remaining:</b>
        <span class="time">calculating...</span>
    </div>
<?php endif; ?>

<?php if ($order['status'] == 'READY'): ?>
    <b style="color:green;">READY for collection</b>
<?php endif; ?>

<?php if ($order['status'] == 'COLLECTED'): ?>
    <p>Collected</p>
<?php endif; ?>

<?php endif; ?>

<script src="/Canteen-Services/assets/js/student_status.js"></script>
