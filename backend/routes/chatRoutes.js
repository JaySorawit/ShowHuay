const express = require('express');
const router = express.Router();
const { getMessage, createMessage, getUserChat } = require('../controllers/chatController');

const chatRoutes = (io) => {
    router.route("/:id").post(createMessage(io)).get(getMessage(io));
    router.route("/").post(getUserChat(io));
    return router;
};

module.exports = chatRoutes;

