<?php include("../includes/auth_check.php"); ?>
<?php include("../components/navbar.php"); ?>

<div class="container mt-4">
<h3>My Profile</h3>

<div class="card p-3">
Name: <?= $_SESSION['name'] ?><br>
Email: <?= $_SESSION['email'] ?? '' ?><br>
Role: <?= $_SESSION['role'] ?>
</div>
</div>
