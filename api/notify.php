
<?php
/**
 * TWILIO CONFIGURATION
 * Replace placeholders with your actual keys.
 */
$account_sid = 'YOUR_TWILIO_ACCOUNT_SID';
$auth_token = 'YOUR_TWILIO_AUTH_TOKEN';
$twilio_number = 'YOUR_TWILIO_PHONE_NUMBER';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['orderId'] ?? '';
$status = $input['status'] ?? '';
$customerPhone = $input['phone'] ?? '+1234567890'; // Default for demo
$customerName = $input['name'] ?? 'Student';
$slot = $input['slot'] ?? '';

if (!$orderId || !$status) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$messages = [
    'Approved' => "Hi $customerName, your order #$orderId has been approved and is in the queue!",
    'Preparing' => "Hi $customerName, your order #$orderId is now being prepared by our chefs! 🍳",
    'Ready' => "Good news $customerName! Order #$orderId is ready for pickup at Slot $slot. 🛍️",
    'Collected' => "Thanks $customerName! Order #$orderId was collected. Enjoy your meal! ✨"
];

$messageBody = $messages[$status] ?? "Order #$orderId status updated to $status.";

// Send via Twilio REST API
$url = "https://api.twilio.com/2010-04-01/Accounts/$account_sid/Messages.json";
$data = [
    'From' => $twilio_number,
    'To' => $customerPhone,
    'Body' => $messageBody
];

$post = http_build_query($data);
$x = curl_init($url);
curl_setopt($x, CURLOPT_POST, true);
curl_setopt($x, CURLOPT_RETURNTRANSFER, true);
curl_setopt($x, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($x, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($x, CURLOPT_USERPWD, "$account_sid:$auth_token");
curl_setopt($x, CURLOPT_POSTFIELDS, $post);

$response = curl_exec($x);
$err = curl_error($x);
curl_close($x);

if ($err) {
    echo json_encode(['success' => false, 'error' => $err]);
} else {
    echo json_encode(['success' => true, 'twilio_response' => json_decode($response)]);
}
?>
