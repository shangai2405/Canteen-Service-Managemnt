<?php
include("../includes/auth_check.php");
include("../includes/role_check.php");
include("../config/db.php");
checkRole('student');
?>

<?php include("../includes/header.php"); ?>

<h2>Select Food & Time Slot</h2>

<form id="orderForm">

<h3>Menu Items</h3>

<?php
$menu = $conn->query("SELECT * FROM menu_items WHERE is_available = 1");
while ($item = $menu->fetch_assoc()) {
    echo "
    <div>
        <input type='checkbox' name='items[{$item['item_id']}]' value='1'>
        {$item['item_name']} - ₹{$item['price']}
        Qty:
        <input type='number' name='qty[{$item['item_id']}]' value='1' min='1'>
    </div>
    ";
}
?>

<h3>Time Slot</h3>
<select name='slot_id' required>
    <option value=''>-- Select Slot --</option>
    <?php
    $slots = $conn->query("SELECT * FROM time_slots");
    while ($slot = $slots->fetch_assoc()) {
        echo "<option value='{$slot['slot_id']}'>{$slot['start_time']} - {$slot['end_time']}</option>";
    }
    ?>
</select>

<br><br>
<button type="submit" id="preorderBtn">Preorder</button>

</form>

<script src="/Canteen-Services/assets/js/student.js"></script>

<?php include("../includes/footer.php"); ?>
