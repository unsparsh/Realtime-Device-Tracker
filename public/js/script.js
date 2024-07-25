const socket = io();
console.log("hery");
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude , longitude} = position.coords;
        socket.emit("send-loc",{latitude, longitude});
        },
        (error) => {
            console.error(error);
        },{
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge:0
        }
    );
}

const map =L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png",{
    attribution : "OpenStreetMap"
}).addTo(map);