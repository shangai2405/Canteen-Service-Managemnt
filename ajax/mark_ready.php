<?php
session_start();
include("../config/db.php");

if ($_SESSION['role'] != 'counter') exit;

$order_id = $_POST['order_id'];

$conn->query("UPDATE orders SET status='READY' WHERE order_id=$order_id");

header("Location: ../counter/dashboard.php");
exit;
