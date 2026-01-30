<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('admin');

if ($_SERVER['REQUEST_METHOD']=="POST") {
    $name=$_POST['name'];
    $price=$_POST['price'];
    $stmt=$conn->prepare(
        "INSERT INTO menu_items(item_name,price) VALUES(?,?)"
    );
    $stmt->bind_param("sd",$name,$price);
    $stmt->execute();
}
?>

<h2>Manage Menu</h2>

<form method="post">
Item name: <input name="name" required>
Price: <input name="price" required>
<button>Add</button>
</form>

<hr>

<?php
$menu=$conn->query("SELECT * FROM menu_items");
while($m=$menu->fetch_assoc()){
    echo "{$m['item_name']} - ₹{$m['price']}<br>";
}
?>
