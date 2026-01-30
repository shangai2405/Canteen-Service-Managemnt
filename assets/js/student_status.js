document.querySelectorAll(".timer").forEach(timer => {

    let end = parseInt(timer.dataset.end);
    let span = timer.querySelector(".time");

    function tick() {

        let now = Math.floor(Date.now()/1000);
        let diff = end - now;

        if(diff <= 0){
            span.innerText = "READY!";
            return;
        }

        let m = Math.floor(diff/60);
        let s = diff%60;

        span.innerText = `${m}:${s.toString().padStart(2,'0')}`;
    }

    tick();
    setInterval(tick,1000);

});
