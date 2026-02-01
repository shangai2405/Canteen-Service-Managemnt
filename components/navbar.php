<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">

    <a class="navbar-brand fw-bold text-warning"
       href="/Canteen-Services/student/dashboard.php">
        🍴 CanteenX
    </a>

    <select id="canteenSelect" class="form-select w-auto ms-3">
        <option value="AB1">AB1</option>
        <option value="IT">IT</option>
        <option value="MBA">MBA</option>
        <option value="CAFETERIA">CAFETERIA</option>
    </select>

    
    <input class="form-control" id="foodSearch" placeholder="Search food...">
    <div id="searchResults" class="list-group position-absolute w-100"></div>


    <div class="ms-auto d-flex align-items-center gap-4">

        <a href="/Canteen-Services/student/help.php"
           class="text-dark fw-semibold">Help</a>

        <!-- PROFILE -->
        <div class="dropdown">
            <button class="btn btn-outline-dark dropdown-toggle"
                    data-bs-toggle="dropdown">
                <?= $_SESSION['name'] ?? 'Profile' ?>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item"
                       href="/Canteen-Services/student/profile.php">
                       Profile</a></li>
                <li><a class="dropdown-item"
                       href="/Canteen-Services/student/current_orders.php">
                       Current Orders</a></li>
                <li><a class="dropdown-item"
                       href="/Canteen-Services/student/past_orders.php">
                       Past Orders</a></li>
                <li><hr></li>
                <li><a class="dropdown-item text-danger"
                       href="/Canteen-Services/logout.php">
                       Logout</a></li>
            </ul>
        </div>

        <!-- CART -->
        <div id="cartIcon" class="position-relative" style="cursor:pointer">
            🛒
            <span id="cartCount"
                class="badge bg-danger position-absolute top-0 start-100 translate-middle hidden">
            </span>
        </div>


    </div>

</nav>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
