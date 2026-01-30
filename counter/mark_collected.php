<?php
session_start();
include("../config/db.php");

$order_id = (int)$_POST['order_id'];

$conn->query("
UPDATE orders
SET status='COLLECTED'
WHERE order_id=$order_id
");

// decrement slot count
$conn->query("
UPDATE time_slots t
JOIN orders o ON o.slot_id = t.slot_id
SET t.current_orders = t.current_orders - 1
WHERE o.order_id=$order_id
");

header("Location: dashboard.php");
exit;
?>
