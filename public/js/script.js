document.addEventListener("DOMContentLoaded", function () {
    var map;
    var socket = io();
    var markers = {};

    document.getElementById('start-tracking').addEventListener('click', function () {
        var username = document.getElementById('username').value;
        if (!username) {
            alert('Please enter your name.');
            return;
        }

        document.getElementById('username-prompt').style.display = 'none';
        document.getElementById('map').style.display = 'block';

        // Initialize the map
        map = L.map('map').setView([0, 0], 2);

        // Add a tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // Update the map view to the user's current location
                map.setView([lat, lng], 13);

                // Emit the location to the server
                socket.emit('send-location', { username: username, latitude: lat, longitude: lng });
            }, function (error) {
                console.error('Error getting location', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    });

    // Listen for 'recieve-location' event from the server
    socket.on('recieve-location', function (data) {
        var lat = data.latitude;
        var lng = data.longitude;

        // If marker for user exists, update position
        if (markers[data.id]) {
            markers[data.id].setLatLng([lat, lng]);
        } else {
            // Create a new marker and add it to the map
            markers[data.id] = L.marker([lat, lng]).addTo(map)
                .bindPopup(`User: ${data.username}`)
                .openPopup();
        }
    });

    // Listen for 'user-disconnected' event to remove marker
    socket.on('user-disconnected', function (id) {
        if (markers[id]) {
            map.removeLayer(markers[id]);
            delete markers[id];
        }
    });
});
