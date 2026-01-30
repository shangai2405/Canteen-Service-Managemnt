console.log("student.js loaded");
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("orderForm");

    if (form) {
        form.addEventListener("submit", (e) => {
            console.log("submit event fired");
            e.preventDefault();

            const formData = new FormData(form);

            fetch("http://localhost/Canteen-Services/ajax/place_order.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.text())
            .then(data => {
                console.log("ORDER_RESPONSE_RAW:", data);
            

                switch (data) {
                    case "ORDER_SUCCESS":
                        alert("Order placed!");
                        window.location.href = "/Canteen-Services/student/my_orders.php";
                        break;
                    case "NO_SLOT":
                        alert("Please select a slot!");
                        break;
                    case "NO_ITEMS":
                        alert("Select at least one item");
                        break;
                    case "SLOT_FULL":
                        alert("Slot is full");
                        break;
                    case "CUTOFF_EXCEEDED":
                        alert("Cutoff exceeded for slot");
                        break;
                    default:
                        alert("Error: " + data);
                }
            });
        });
    }

    // Optional status polling (for live tracking)
    /*const statusBox = document.getElementById("orderStatus");
    if (statusBox) {
        fetch("http://localhost/Canteen-Services/ajax/check_order_status.php")
        .then(res => res.text())
        .then(status => {
      console.log("STATUS:", status);
      // update UI only if status exists
  });

    }*/

});
