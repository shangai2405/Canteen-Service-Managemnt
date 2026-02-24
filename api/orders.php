
<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $role = $_GET['role'] ?? '';
    $userId = $_GET['userId'] ?? '';

    $sql = "SELECT * FROM orders";
    if ($role === 'student') {
        $sql .= " WHERE userId = '" . $conn->real_escape_string($userId) . "'";
    }
    $sql .= " ORDER BY timestamp DESC";

    $result = $conn->query($sql);
    $orders = [];
    while($row = $result->fetch_assoc()) {
        $orderId = $row['id'];
        // Fetch items for this order
        $itemsResult = $conn->query("
            SELECT m.*, oi.quantity 
            FROM order_items oi 
            JOIN menu m ON oi.menu_item_id = m.id 
            WHERE oi.order_id = $orderId
        ");
        $items = [];
        while($item = $itemsResult->fetch_assoc()) {
            $items[] = $item;
        }
        $row['items'] = $items;
        $row['timestamp'] = date('h:i A', strtotime($row['timestamp']));
        $orders[] = $row;
    }
    sendResponse($orders);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $userId = $conn->real_escape_string($input['userId']);
    $total = (float)$input['total'];
    $slot = $conn->real_escape_string($input['slot']);

    // Create Order
    $conn->query("INSERT INTO orders (userId, total, slot, status) VALUES ('$userId', $total, '$slot', 'Placed')");
    $orderId = $conn->insert_id;

    // Add Items
    foreach ($input['items'] as $item) {
        $itemId = (int)$item['id'];
        $qty = (int)$item['quantity'];
        $conn->query("INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($orderId, $itemId, $qty)");
        // Increment Popularity
        $conn->query("UPDATE menu SET popularity = popularity + $qty WHERE id = $itemId");
    }

    sendResponse(['success' => true, 'orderId' => $orderId]);
}
?>
