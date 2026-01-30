<?php
include("config/db.php");
$msg = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];

    $stmt = $conn->prepare("INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)");
    $stmt->bind_param("ssss", $name, $email, $pass, $role);
    $stmt->execute();

    $msg = "Registration Successful! Please login.";
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Register</title>
<link rel="stylesheet" href="./assets/css/auth.css">
</head>
<body>

<div class="auth-container">
    <h2>Create Account ✨</h2>
    <p class="subtitle">Register and get started</p>

    <?php if($msg): ?>
        <p class="success"><?= $msg ?></p>
    <?php endif; ?>

    <form method="POST" class="auth-form">

        <div class="input-group">
            <label>Name</label>
            <input type="text" name="name" required>
        </div>

        <div class="input-group">
            <label>Email</label>
            <input type="email" name="email" required>
        </div>

        <div class="input-group">
            <label>Password</label>
            <input type="password" name="password" required>
        </div>

        <div class="input-group">
            <label>Role</label>
            <select name="role" required>
                <option value="student">Student</option>
                <option value="counter">Counter</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        <button type="submit" class="btn">Register</button>
    </form>

    <p class="footer-text">Already have an account?
        <a href="login.php">Log in</a>
    </p>
</div>

</body>
</html>
