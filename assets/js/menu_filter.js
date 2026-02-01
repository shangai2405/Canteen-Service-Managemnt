document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab");
    const cards = document.querySelectorAll(".food-card");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            // active tab UI
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filter = tab.dataset.filter;

            cards.forEach(card => {

                // MOST ORDERED
                if (filter === "popular") {
                    card.style.display =
                        card.dataset.popular === "1"
                            ? "block"
                            : "none";
                }
                // CATEGORY FILTER
                else {
                    card.style.display =
                        card.dataset.category === filter
                            ? "block"
                            : "none";
                }
            });
        });
    });

});
