
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    var map = L.map('map').setView([0, 0], 16);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Sparsh Singh Chundawat</a>'
    }).addTo(map);

    // Initialize the socket.io connection
    var socket = io();

    // Listen for 'recieve-location' event from the server
    socket.on('recieve-location', function (data) {
        var lat = data.latitude;
        var lng = data.longitude;

        // Create a marker and add it to the map
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`User ${data.id}`)
            .openPopup();
    });

    // Get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Update the map view to the user's current location
            map.setView([lat, lng], 16);

            // Emit the location to the server
            socket.emit('send-location', { latitude: lat, longitude: lng });
        }, function (error) {
            console.error('Error getting location', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
});
