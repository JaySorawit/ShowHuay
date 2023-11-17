const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

module.exports = (io) => {

  router.get('/', (req,res) => {
    res.send(ChatController(io));
  })

  const chatController = ChatController(io);

  io.on('connection', (socket) => {
    chatController.handleConnection(socket);
  });

  return router;
};