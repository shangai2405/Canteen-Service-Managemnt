
<?php
/**
 * SQL SCHEMA:
 * Run this in PHPMyAdmin if you get a connection error.
 * 
 * CREATE DATABASE IF NOT EXISTS smart_canteen;
 * USE smart_canteen;
 * /*
USE smart_canteen;


Create table using these codes in phpmyadmin server: 

CREATE TABLE menu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10,2),
    popularity INT DEFAULT 0,
    stock INT DEFAULT 0
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(50),
    total DECIMAL(10,2),
    slot VARCHAR(50),
    status VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    menu_item_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

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
