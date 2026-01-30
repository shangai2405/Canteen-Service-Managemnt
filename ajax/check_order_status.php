<?php
session_start();
include("../config/db.php");

$user_id = $_SESSION['user_id'];

$q = $conn->query("
SELECT status FROM orders 
WHERE user_id = $user_id 
ORDER BY order_time DESC 
LIMIT 1
");

if ($q->num_rows == 0) {
    echo "NO_ORDER";
} else {
    $r = $q->fetch_assoc();
    echo $r['status'];
}
?>
