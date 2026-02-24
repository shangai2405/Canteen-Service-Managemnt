
<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$orderId = (int)($input['orderId'] ?? 0);
$nextStatus = $conn->real_escape_string($input['status'] ?? '');

if (!$orderId || !$nextStatus) {
    sendResponse(['success' => false, 'message' => 'Missing parameters'], 400);
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $nextStatus, $orderId);

if ($stmt->execute()) {
    sendResponse(['success' => true]);
} else {
    sendResponse(['success' => false, 'message' => 'Update failed'], 500);
}
?>
