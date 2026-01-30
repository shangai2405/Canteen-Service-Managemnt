<?php
session_start();
session_destroy();
header("Location: /Canteen-Services/login.php");
exit;
