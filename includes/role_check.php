<?php
function checkRole($requiredRole) {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== $requiredRole) {
        die("❌ Access Denied for this role");
    }
}
?>
