const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

const io = socketIo(server);
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle WebSocket events here
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

// Routes
const chatRoutes = require('./routes/chatRoutes');

app.use('/chat', chatRoutes(io));

// Start the server
app.listen(3000, () => {
    console.log('Sever started successfully on port 3000!');
})


