setInterval(() => {

    fetch("/Canteen-Services/ajax/update_status.php");

    fetch("/Canteen-Services/ajax/check_order_status.php")
    .then(r => r.text())
    .then(status => {

        document.querySelectorAll(".order-status").forEach(el => {

            let current = el.innerText.trim();

            if(status === "READY" && current === "PREPARING"){
                el.innerText = "READY";
                el.classList.remove("text-warning");
                el.classList.add("text-success");
            }

            if(status === "COLLECTED"){
                location.reload(); // remove from current orders
            }

        });

    });

}, 4000); // every 4 seconds
