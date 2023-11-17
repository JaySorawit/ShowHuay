const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');


// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = socketIo(server);

// Routes
app.use('/apis/chat', chatRoutes(io));


// Start the server
app.listen(3000, () => {
    console.log('Sever started successfully on port 3001!');
})


