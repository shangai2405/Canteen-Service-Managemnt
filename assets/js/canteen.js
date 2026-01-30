document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("canteenSelect");

    const saved = localStorage.getItem("canteen");
    if (saved) select.value = saved;

    select.addEventListener("change", () => {
        localStorage.setItem("canteen", select.value);
        location.reload();
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const categories = document.querySelectorAll(".category");
    const cards = document.querySelectorAll(".food-card");

    categories.forEach(cat => {
        cat.addEventListener("click", () => {


            categories.forEach(c => c.classList.remove("active-cat"));
            cat.classList.add("active-cat");

            const selected = cat.dataset.category.toLowerCase();

            cards.forEach(card => {

                const name = card.querySelector("h4").innerText.toLowerCase();

                if (name.includes(selected)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }

            });

        });
    });

});
