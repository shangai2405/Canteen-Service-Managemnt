<?php
if (session_status() === PHP_SESSION_NONE) session_start();
?>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<nav class="navbar navbar-expand-lg bg-white shadow-sm px-4 sticky-top">

    <!-- BRAND -->
    <a class="navbar-brand fw-bold text-warning"
       href="/Canteen-Services/student/dashboard.php"
       style="font-size:22px;">
        🍴 CanteenX
    </a>

    <!-- CANTEEN SELECT -->
    <div class="ms-3">
        <select id="canteenSelect" class="form-select form-select-sm">
            <option value="AB1">AB1 Canteen</option>
            <option value="IT">IT Canteen</option>
            <option value="MBA">MBA Canteen</option>
            <option value="CAFETERIA">Cafeteria</option>
        </select>
    </div>

    <!-- SEARCH -->
    <div class="mx-auto w-50 position-relative">
        <input
            id="foodSearch"
            class="form-control"
            placeholder="Search food items…"
            autocomplete="off"
        >
        <div id="searchResults"
             class="list-group position-absolute w-100"
             style="z-index:2000;">
        </div>
    </div>

    <!-- RIGHT -->
    <div class="d-flex align-items-center gap-3">

        <a href="/Canteen-Services/student/help.php"
           class="text-dark fw-semibold text-decoration-none">
            Help
        </a>

        <!-- PROFILE -->
        <div class="dropdown">
            <button class="btn btn-outline-dark dropdown-toggle"
                    data-bs-toggle="dropdown">
                <?= htmlspecialchars($_SESSION['name'] ?? 'Profile') ?>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <a class="dropdown-item"
                       href="/Canteen-Services/student/profile.php">
                        Profile
                    </a>
                </li>
                <li>
                    <a class="dropdown-item"
                       href="/Canteen-Services/student/current_orders.php">
                        Current Orders
                    </a>
                </li>
                <li>
                    <a class="dropdown-item"
                       href="/Canteen-Services/student/past_orders.php">
                        Past Orders
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger"
                       href="/Canteen-Services/logout.php">
                        Logout
                    </a>
                </li>
            </ul>
        </div>

        <!-- CART ICON -->
        <div id="cartIcon"
             class="position-relative"
             style="cursor:pointer; font-size:22px;">
            🛒
            <span id="cartCount"
                  class="badge bg-danger position-absolute top-0 start-100 translate-middle hidden">
                0
            </span>
        </div>

    </div>
</nav>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
