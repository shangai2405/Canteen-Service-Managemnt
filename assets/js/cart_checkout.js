document.addEventListener("DOMContentLoaded", () => {

    loadSlots();

    document.getElementById("placeOrderBtn")
    ?.addEventListener("click", placeOrder);

});

/* ---------------- LOAD SLOTS ---------------- */
function loadSlots(){

    fetch("/Canteen-Services/ajax/get_slots.php")
    .then(r=>r.json())
    .then(data=>{

        let s=document.getElementById("slotSelect");
        if(!s) return;

        s.innerHTML='<option value="">Select Slot</option>';

        data.forEach(sl=>{
            s.innerHTML+=`
            <option value="${sl.slot_id}">
            ${sl.start_time} - ${sl.end_time}
            </option>`;
        });

    });

}

/* ---------------- PLACE ORDER ---------------- */
function placeOrder(){

    let slot=document.getElementById("slotSelect").value;

    if(!slot){
        alert("Please select slot");
        return;
    }

    if(Object.keys(cart).length===0){
        alert("Cart empty");
        return;
    }

    let items={};
    let qty={};

    Object.entries(cart).forEach(([id,v])=>{
        items[id]=1;
        qty[id]=v.qty;
    });

    let fd=new FormData();
    fd.append("slot_id",slot);

    Object.entries(items).forEach(([k,v])=>{
        fd.append(`items[${k}]`,v);
    });

    Object.entries(qty).forEach(([k,v])=>{
        fd.append(`qty[${k}]`,v);
    });

    fetch("/Canteen-Services/ajax/place_order.php",{
        method:"POST",
        body:fd
    })
    .then(r=>r.text())
    .then(res=>{

        if(res==="ORDER_SUCCESS"){
            alert("Order Placed!");
            location.reload();
        }
        else if(res==="SLOT_FULL"){
            alert("Slot Full — Try Another");
        }
        else{
            alert(res);
        }

    });

}
