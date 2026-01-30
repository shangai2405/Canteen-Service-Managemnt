<?php
session_start();
include("../config/db.php");

if ($_SESSION['role'] !== 'counter') {
    echo "UNAUTHORIZED";
    exit;
}

$order_id = $_POST['order_id'];
$status = $_POST['status'];

if (!in_array($status, ['READY','COLLECTED'])) {
    echo "INVALID_STATUS";
    exit;
}

$conn->query("UPDATE orders SET status='$status' WHERE order_id=$order_id");

echo "STATUS_UPDATED";
?>
