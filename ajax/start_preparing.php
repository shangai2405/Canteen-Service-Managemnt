<?php
session_start();
include("../config/db.php");

if ($_SESSION['role'] != 'counter') exit;

$order_id = $_POST['order_id'];
$mins = intval($_POST['prep_minutes']);

$conn->query("
UPDATE orders SET 
status='PREPARING',
prep_start=NOW(),
prep_end=DATE_ADD(NOW(), INTERVAL $mins MINUTE),
prep_minutes=$mins
WHERE order_id=$order_id
");


header("Location: ../counter/dashboard.php");
exit;
