
<?php
require_once 'db.php';

$result = $conn->query("SELECT * FROM menu ORDER BY popularity DESC");
$menu = [];
while($row = $result->fetch_assoc()) {
    $menu[] = $row;
}

sendResponse($menu);
?>
