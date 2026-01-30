-- Create Database
CREATE DATABASE IF NOT EXISTS canteen_preorder_db;
USE canteen_preorder_db;

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','counter','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- Time Slots Table
CREATE TABLE time_slots (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_orders INT NOT NULL,
    current_orders INT DEFAULT 0,
    cutoff_minutes INT DEFAULT 15
);

-- Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    slot_id INT NOT NULL,
    status ENUM('PREORDERED','PREPARING','READY','COLLECTED','NO_SHOW') DEFAULT 'PREORDERED',
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    ready_at DATETIME NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id)
);

-- Order Items Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    payment_status ENUM('PAID','FAILED','PENDING') DEFAULT 'PENDING',
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Pickup Logs Table
CREATE TABLE pickup_logs (
    pickup_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    picked_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
