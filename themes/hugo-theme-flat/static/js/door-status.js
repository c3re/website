
document.addEventListener("DOMContentLoaded", function() {
    const update=function(){
        fetch("https://spaceapi.c3re.de/").then(function(response) {
            return( response.json());
        }).then(function(data) {
            console.log(data)
            document.getElementById("ds-img").setAttribute("src",data.state.open?data.state.icon.open:data.state.icon.closed);
            document.getElementById("ds-status").innerHTML=data.state.open?"Geöffnet":"Geschlossen";

            document.getElementById("ds-temp").innerHTML=""+data.sensors.temperature[0].value+data.sensors.temperature[0].unit;
            const lastchange=new Date(data.state.lastchange*1000)
            document.getElementById('ds-date').innerHTML=lastchange.getDate().toString().padStart(2, "0")     + "."
                + (lastchange.getMonth()+1).toString().padStart(2, "0") + "."
                + lastchange.getFullYear()  + " "
                + lastchange.getHours().toString().padStart(2, "0")     + ":"
                + lastchange.getMinutes().toString().padStart(2, "0")
        })
    }
    update();
    setInterval(update,10000);
});
