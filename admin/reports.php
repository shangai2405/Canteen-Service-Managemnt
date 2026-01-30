<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('admin');
?>

<h2>Daily Reports</h2>

<?php
$q = $conn->query("
SELECT DATE(order_time) as day, COUNT(*) as total
FROM orders
GROUP BY DATE(order_time)
ORDER BY day DESC
");

while ($r = $q->fetch_assoc()) {
    echo "Date: {$r['day']} | Orders: {$r['total']}<br>";
}
?>
