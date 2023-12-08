const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const accountRoutes = require('./routes/accountRoutes');
const authRoute = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoutes');
const addressRoutes = require('./routes/addressRoutes');
const creditCardRoutes = require('./routes/creditCardRoutes');
const cartRoutes = require('./routes/cartRoutes');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
const chatRoutes = require('./routes/chatRoutes')(io);


// Routes
app.use('/address', addressRoutes);
app.use('/account', accountRoutes); 
app.use('/product', productRoutes); 
app.use('/auth', authRoute);
app.use('/chat', chatRoutes);
app.use('/creditCard', creditCardRoutes);
app.use('/cart', cartRoutes);
app.use('/shop', shopRoutes);
app.use('/system', adminRoutes);

// Start the server
server.listen(3000, () => {
    console.log('Server started successfully on port 3000!');
});