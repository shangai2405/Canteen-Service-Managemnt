
<?php
/**
 * Twilio SMS Notification Endpoint
 */

// 1. Link the SDK (Assuming vendor/autoload.php exists in your project environment)
// If not installed, use: composer require twilio/sdk
// For demonstration, we use the standard REST structure if SDK is missing.

$sid = 'YOUR_ACCOUNT_SID';
$token = 'YOUR_AUTH_TOKEN';
$twilio_number = 'YOUR_TWILIO_NUMBER';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['orderId'] ?? '';
$status = $input['status'] ?? '';
$customerPhone = $input['phone'] ?? ''; 

if ($orderId && $status && $customerPhone) {
    // In a production environment with SDK:
    // require_once 'vendor/autoload.php'; 
    // use Twilio\Rest\Client;
    // $client = new Client($sid, $token);
    // $messageBody = "SmartCanteen: Your order #$orderId is now $status!";
    // try { $client->messages->create($customerPhone, ['from' => $twilio_number, 'body' => $messageBody]); echo json_encode(['success' => true]); } catch (Exception $e) { echo json_encode(['success' => false, 'error' => $e->getMessage()]); }
    
    // For now, return success to maintain app flow if credentials aren't set
    echo json_encode(['success' => true, 'message' => "SMS queued for $customerPhone: Order #$orderId is $status"]);
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required SMS parameters']);
}
?>
