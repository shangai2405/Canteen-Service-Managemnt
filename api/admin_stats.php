
<?php
require_once 'db.php';

// Revenue
$revRes = $conn->query("SELECT SUM(total) as totalRevenue, COUNT(*) as totalOrders FROM orders");
$stats = $revRes->fetch_assoc();

// Popular Items
$popRes = $conn->query("SELECT * FROM menu ORDER BY popularity DESC LIMIT 5");
$popularItems = [];
while($row = $popRes->fetch_assoc()) {
    $popularItems[] = $row;
}

sendResponse([
    'totalRevenue' => $stats['totalRevenue'] ?? 0,
    'totalOrders' => $stats['totalOrders'] ?? 0,
    'popularItems' => $popularItems
]);
?>
