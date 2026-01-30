<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('counter');
include("../includes/header.php");

// Fetch active orders
$orders = $conn->query("
SELECT o.*, u.name 
FROM orders o
JOIN users u ON o.user_id = u.user_id
ORDER BY o.order_time DESC
");
?>

<h2>Counter Dashboard</h2>

<?php while ($row = $orders->fetch_assoc()): ?>

<div class="card" style="margin-bottom:20px; padding:15px; border:1px solid #ccc;">

    <b>Order #<?= $row['order_id'] ?></b><br>
    Student: <?= $row['name'] ?><br>
    Status: <b><?= $row['status'] ?></b><br>

    <?php if ($row['status'] == 'PREORDERED'): ?>
        <form method="POST" action="../ajax/start_preparing.php">
            <input type="hidden" name="order_id" value="<?= $row['order_id'] ?>">
            <select name="prep_minutes">
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
            </select>
            <button type="submit">Start Preparing</button>
        </form>
    <?php endif; ?>

    <?php if ($row['status'] == 'PREPARING'): ?>
    <div class="timer" 
         data-order="<?= $row['order_id'] ?>" 
         data-end="<?= strtotime($row['prep_end']) ?>">
        <b>Remaining:</b> 
        <span class="time">calculating...</span>
    </div>

    <form method="POST" action="../ajax/mark_ready.php">
        <input type="hidden" name="order_id" value="<?= $row['order_id'] ?>">
        <button type="submit">Mark Ready</button>
    </form>
<?php endif; ?>
    <?php if ($row['status'] == 'READY'): ?>
        <form method="POST" action="../ajax/mark_collected.php">
            <input type="hidden" name="order_id" value="<?= $row['order_id'] ?>">
            <button type="submit">Collected</button>
        </form>
    <?php endif; ?>

    <?php if ($row['status'] == 'COLLECTED'): ?>
        <span style="color:gray;">Collected</span>
    <?php endif; ?>

</div>

<?php endwhile; ?>

<script src="../assets/js/counter_timer.js"></script>

<?php include("../includes/footer.php"); ?>
