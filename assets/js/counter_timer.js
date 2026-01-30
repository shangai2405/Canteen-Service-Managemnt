function updateStatus(order_id, status) {
    const formData = new FormData();
    formData.append("order_id", order_id);
    formData.append("status", status);

    fetch("/Canteen-Services/ajax/update_order_status.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data === "STATUS_UPDATED") {
            alert("Status updated to " + status + "!");
            location.reload();
        } else {
            alert("Error: " + data);
        }
    });
}

document.querySelectorAll(".timer").forEach(timer => {
    let end = parseInt(timer.dataset.end);
    let span = timer.querySelector(".time");

    function tick() {
        let now = Math.floor(Date.now() / 1000);
        let diff = end - now;

        if (diff <= 0) {
            span.innerText = "READY!";
        
            fetch("../ajax/mark_ready.php", {
                method: "POST",
                body: new URLSearchParams({
                    order_id: timer.dataset.order
                })
            }).then(() => location.reload());
        
            return;
        }        

        let m = Math.floor(diff / 60);
        let s = diff % 60;
        span.innerText = `${m}:${s.toString().padStart(2,'0')}`;
    }

    tick();
    setInterval(tick, 1000);
});
