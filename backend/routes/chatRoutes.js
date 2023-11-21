// chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

module.exports = (io) => {
  // Use the chatController instance to handle socket events
  const chatController = new ChatController(io);

  io.on('connection', (socket) => {
    // Pass the socket to handleConnection
    chatController.handleConnection(socket);
  });

  router.post('/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { message, senderId, receiverId } = req.body;

    // Save the message to the database with senderId, receiverId, and roomId
    chatController.saveMessageToDatabase(message, senderId, receiverId, roomId);

    // Emit the message to the receiver's room
    io.to(roomId).emit('chat message', { message, sender: senderId, receiver: receiverId });

    res.sendStatus(200);
  });

  return router;
};
