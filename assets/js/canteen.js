document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("canteenSelect");
    if (!select) return;

    // Restore from cookie
    const match = document.cookie.match(/canteen=([^;]+)/);
    if (match) select.value = match[1];

    select.addEventListener("change", () => {
        document.cookie = `canteen=${select.value}; path=/`;
        location.reload();
    });

});
