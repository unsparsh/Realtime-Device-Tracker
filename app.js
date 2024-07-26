const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// Create the Express app
const app = express();

// Create the HTTP server
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = socketio(server);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO connection handler
io.on('connection', function (socket) {
    socket.on('send-location', function (data) {
        io.emit('recieve-location', { id: socket.id, ...data });
    });

    console.log('Client connected');

    socket.on('disconnect', function () {
        io.emit('user-disconnected', socket.id);
        console.log('Client disconnected');
    });
});

// Handle the root route
app.get('/', function (req, res) {
    res.render('index'); // Make sure there's a file named "index.ejs" in the "views" directory
});

// Start the server on a specified port (e.g., 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
