
<?php
/**
 * SQL SCHEMA:
 * Run this in PHPMyAdmin if you get a connection error.
 * 
 * CREATE DATABASE IF NOT EXISTS smart_canteen;
 * USE smart_canteen;
 * -- (Follow the instructions in the app UI if this fails)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$user = 'root';
$pass = ''; 
$dbname = 'smart_canteen';

// Suppress standard errors to return clean JSON
mysqli_report(MYSQLI_REPORT_OFF);

$conn = @new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(200); // Send 200 so React can parse the JSON error
    echo json_encode([
        'error' => "MySQL Error ({$conn->connect_errno}): {$conn->connect_error}. Please ensure MySQL is running and database '$dbname' exists."
    ]);
    exit;
}

function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
?>
