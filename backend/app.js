const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql');
const chatRoutes = require('./routes/chatRoutes');
const authRoute = require('./routes/authRoutes')
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = socketIo(server);

// Routes
app.use('/auth', authRoute);
// app.use('/api/chat', chatRoutes(io));


// Start the server
app.listen(3000, () => {
    console.log('Server started successfully on port 3000!');
})