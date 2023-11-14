const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

module.exports = (io) => {
  const chatController = new ChatController(io);

  io.on('connection', (socket) => {
    chatController.handleConnection(socket);
  });

  return router;
};