const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = socketIo(server);

// Routes
const chatRoutes = require('./routes/chatRoutes');

app.use('/chat', chatRoutes(io));


// Start the server
app.listen(3001, () => {
    console.log('Sever started successfully on port 3001!');
})


