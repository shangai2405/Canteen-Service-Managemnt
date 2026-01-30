<?php
include("../config/db.php");

$slot_id = $_GET['slot_id'];

$q = $conn->query("SELECT max_orders, current_orders FROM time_slots WHERE slot_id=$slot_id");
$r = $q->fetch_assoc();

if ($r['current_orders'] < $r['max_orders']) {
    echo "AVAILABLE";
} else {
    echo "FULL";
}
?>
