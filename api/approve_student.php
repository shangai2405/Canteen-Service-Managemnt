
<?php
/**
 * APPROVAL & EMAIL NOTIFICATION
 * Replace with actual SMTP/Mail API keys.
 */
$sendgrid_api_key = 'YOUR_SENDGRID_KEY';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['userId'] ?? '';
$action = $input['action'] ?? 'approve'; // approve or reject

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit;
}

// Logic: 
// 1. Fetch user from 'pending_users'
// 2. If action=approve, INSERT INTO 'users' table
// 3. DELETE FROM 'pending_users'
// 4. Send Email Notification

// MOCK SUCCESS FOR DEMO
if ($action === 'approve') {
    // Send Approval Email Template
    $subject = "Welcome to SmartCanteen! Your account is approved.";
    $body = "Hi, your SmartCanteen registration has been approved. You can now login with your email and password '123'. Happy ordering!";
    
    // In production, call your Mail API (SendGrid, Twilio, etc)
    // mail($userEmail, $subject, $body);
    
    echo json_encode(['success' => true, 'message' => 'User approved and notified via email.']);
} else {
    echo json_encode(['success' => true, 'message' => 'Registration rejected.']);
}
?>
