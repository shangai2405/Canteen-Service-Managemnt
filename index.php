<?php
session_start();

if (isset($_SESSION['role'])) {
    header("Location: /Canteen-Services/" . $_SESSION['role'] . "/dashboard.php");
} else {
    header("Location: /Canteen-Services/login.php");
}
exit;
