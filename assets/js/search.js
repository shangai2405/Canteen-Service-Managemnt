document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("foodSearch");
    const box = document.getElementById("searchResults");

    if(!input) return;

    input.addEventListener("keyup", () => {

        let q = input.value.trim();

        if(q.length < 2){
            box.style.display = "none";
            return;
        }

        fetch(`/Canteen-Services/ajax/search_food.php?q=${q}`)
        .then(r => r.json())
        .then(data => {

            box.innerHTML = "";

            if(data.length === 0){
                box.style.display = "none";
                return;
            }

            data.forEach(i => {
                let div = document.createElement("div");
                div.className = "list-group-item list-group-item-action";
                div.innerText = i.item_name;
                box.appendChild(div);
            });

            box.style.display = "block";
        });

    });

});
