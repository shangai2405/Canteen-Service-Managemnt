<?php
include("../config/db.php");

$q = $_GET['q'] ?? '';

if(strlen($q) < 2) exit;

$q = $conn->real_escape_string($q);

$res = $conn->query("
SELECT item_name 
FROM menu_items
WHERE item_name LIKE '%$q%'
AND is_available = 1
LIMIT 5
");

$out = [];
while($r = $res->fetch_assoc()){
    $out[] = $r;
}

echo json_encode($out);
