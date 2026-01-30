<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('admin');

if ($_SERVER['REQUEST_METHOD']=="POST") {
    $s=$_POST['start'];
    $e=$_POST['end'];
    $m=$_POST['max'];
    $stmt=$conn->prepare(
        "INSERT INTO time_slots(start_time,end_time,max_orders) VALUES(?,?,?)"
    );
    $stmt->bind_param("ssi",$s,$e,$m);
    $stmt->execute();
}
?>

<h2>Manage Slots</h2>

<form method="post">
Start: <input type="time" name="start">
End: <input type="time" name="end">
Max Orders: <input name="max">
<button>Add</button>
</form>
