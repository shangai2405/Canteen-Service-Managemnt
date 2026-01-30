<?php
$conn = new mysqli("localhost", "root", "", "canteen_preorder_db");

date_default_timezone_set('Asia/Kolkata');

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>
