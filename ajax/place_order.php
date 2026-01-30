<?php
session_start();
include("../config/db.php");

/* ---------------- AUTH CHECK ---------------- */
if (!isset($_SESSION['user_id'])) {
    echo "NOT_LOGGED_IN";
    exit;
}

$user_id = $_SESSION['user_id'];

/* ---------------- INPUT DATA ---------------- */
$items   = $_POST['items'] ?? [];
$qty     = $_POST['qty'] ?? [];
$slot_id = $_POST['slot_id'] ?? null;

/* ---------------- VALIDATIONS ---------------- */
if (!$slot_id) {
    echo "NO_SLOT";
    exit;
}

if (empty($items)) {
    echo "NO_ITEMS";
    exit;
}

/* ---------------- SLOT VALIDATION ---------------- */
$slot = $conn->query(
    "SELECT max_orders FROM time_slots WHERE slot_id = $slot_id"
)->fetch_assoc();

if (!$slot) {
    echo "INVALID_SLOT";
    exit;
}

/* ---------------- SLOT CAPACITY LOGIC ---------------- */
/*
ACTIVE orders = PREORDERED + PREPARING + READY
COLLECTED orders DO NOT COUNT
*/

$active = $conn->query("
    SELECT COUNT(*) AS total
    FROM orders
    WHERE slot_id = $slot_id
    AND status IN ('PREORDERED', 'PREPARING', 'READY')
")->fetch_assoc()['total'];

if ($active >= $slot['max_orders']) {
    echo "SLOT_FULL";
    exit;
}

/* ---------------- INSERT ORDER ---------------- */
$conn->query("
    INSERT INTO orders (user_id, slot_id, status)
    VALUES ($user_id, $slot_id, 'PREORDERED')
");

$order_id = $conn->insert_id;

/* ---------------- INSERT ORDER ITEMS ---------------- */
foreach ($items as $item_id => $v) {
    $quantity = isset($qty[$item_id]) ? (int)$qty[$item_id] : 1;

    $conn->query("
        INSERT INTO order_items (order_id, item_id, quantity)
        VALUES ($order_id, $item_id, $quantity)
    ");
}

/* ---------------- SUCCESS ---------------- */
echo "ORDER_SUCCESS";
exit;
?>
