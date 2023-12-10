/********************************************************************
 *                           app.js                                 *
 *                                                                  *
 *   Entry point for the backend, containing routers to handle      *
 *   requests for all file in website.                              *
 *                                                                  *
 ********************************************************************/


/****************** Import necessary modules and dependencies  *****************/
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
/*******************************************************************************/


/*************************** Import route modules   ****************************/
const accountRoutes = require('./routes/accountRoutes');
const authRoute = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoutes');
const addressRoutes = require('./routes/addressRoutes');
const creditCardRoutes = require('./routes/creditCardRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productListRoutes = require('./routes/productListRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const homeRoutes = require('./routes/homeRoutes');
const chatRoutes = require('./routes/chatRoutes');
/*******************************************************************************/


/*********** Create Express app and enable CORS for all routes   ***************/
// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
/*******************************************************************************/


/*********** Create HTTP server and Initialize Socket.io server  ***************/
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
const initializedChatRoutes = chatRoutes(io);
/*******************************************************************************/


/****************** Initialize chat routes with Socket.io instance  ************/
// Use routes
app.use('/address', addressRoutes);
app.use('/account', accountRoutes);
app.use('/product', productRoutes);
app.use('/auth', authRoute);
app.use('/chat', initializedChatRoutes);
app.use('/creditCard', creditCardRoutes);
app.use('/cart', cartRoutes);
app.use('/shop', shopRoutes);
app.use('/list', productListRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/home', homeRoutes);
app.use('/system', adminRoutes);
/*******************************************************************************/

/****************************** Start the server *******************************/
server.listen(3000, () => {
    console.log('Server started successfully on port 3000!');
});
/*******************************************************************************/