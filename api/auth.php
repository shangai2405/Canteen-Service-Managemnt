<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Simple Credential Mapping
$users = [
    'student' => ['role' => 'student', 'id' => 'STU_001', 'name' => 'Alex Student'],
    'counter' => ['role' => 'counter', 'id' => 'CNT_001', 'name' => 'Kitchen Lead'],
    'admin'   => ['role' => 'admin', 'id' => 'ADM_001', 'name' => 'Canteen Manager']
];

if (isset($users[$username]) && $password === 'password') {
    sendResponse([
        'success' => true,
        'user' => $users[$username]
    ]);
} else {
    sendResponse(['success' => false, 'message' => 'Invalid username or password'], 401);
}
?>