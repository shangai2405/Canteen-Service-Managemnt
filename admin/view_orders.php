<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('admin');

$q=$conn->query(
"SELECT o.order_id,u.name,o.status
 FROM orders o JOIN users u ON o.user_id=u.user_id"
);

while($r=$q->fetch_assoc()){
    echo "Order {$r['order_id']} - {$r['name']} - {$r['status']}<br>";
}
