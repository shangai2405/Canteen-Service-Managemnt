<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include("config/db.php");

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role'];

            header("Location: /Canteen-Services/");
            exit;
        } else {
            $message = "Incorrect Password";
        }
    } else {
        $message = "Account not found";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link rel="stylesheet" href="./assets/css/auth.css">
</head>
<body>

<div class="auth-container">
    <h2>Welcome Back </h2>
    <p class="subtitle">Login to continue</p>

    <?php if($message): ?>
        <p class="error"><?= $message ?></p>
    <?php endif; ?>

    <form method="POST" class="auth-form">

        <div class="input-group">
            <label>Email</label>
            <input type="email" name="email" required>
        </div>

        <div class="input-group">
            <label>Password</label>
            <input type="password" name="password" required>
        </div>

        <button type="submit" class="btn">Login</button>
    </form>

    <p class="footer-text">New user?
        <a href="register.php">Create an account</a>
    </p>
</div>

</body>
</html>
