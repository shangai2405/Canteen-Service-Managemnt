<?php
include("../config/db.php");


$conn->query("
UPDATE orders
SET status='READY'
WHERE status='PREPARING'
AND prep_end <= NOW();
");

echo "OK";
?>
