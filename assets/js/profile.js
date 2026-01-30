document.addEventListener("DOMContentLoaded", () => {
    const profile = document.querySelector(".profile");
    const menu = document.querySelector(".profile-menu");

    if (!profile || !menu) return;

    profile.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        menu.classList.remove("show");
    });
});
