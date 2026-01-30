<?php
include("../includes/auth_check.php");
include("../config/db.php");
include("../components/navbar.php");

$uid = $_SESSION['user_id'];

$res = $conn->query("
SELECT * FROM orders
WHERE user_id = $uid
AND status = 'COLLECTED'
");
?>

<div class="container mt-4">
<h3>Past Orders</h3>

<?php while($o = $res->fetch_assoc()): ?>
<div class="card p-3 mb-2">
Order #<?= $o['order_id'] ?> — Completed
</div>
<?php endwhile; ?>

</div>
