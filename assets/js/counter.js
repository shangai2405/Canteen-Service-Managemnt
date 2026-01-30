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

