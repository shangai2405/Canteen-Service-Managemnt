document.addEventListener("DOMContentLoaded", () => {

    const bar = document.getElementById("floatingCartBar");
    if(!bar) return;

    window.updateFloatingCart = function(){

        let totalQty = 0;
        let totalPrice = 0;

        Object.values(window.cart).forEach(i=>{
            totalQty += i.qty;
            totalPrice += i.qty * i.price;
        });

        if(totalQty > 0){
            bar.classList.remove("hidden");
            document.getElementById("floatQty").innerText = totalQty;
            document.getElementById("floatTotal").innerText = totalPrice;
        }else{
            bar.classList.add("hidden");
        }
    }

});
