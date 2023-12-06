const express = require("express");
const router = express.Router();
const {
  getMessage,
  createMessage,
  getUserChat,
} = require("../controllers/chatController");

const chatRoutes = (io) => {
  let onlineUsers = [];
  io.on("connection", (socket) => {
    socket.on("addNewUser", (userId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
    });
    io.emit("getOnlineUsers", onlineUsers);
    socket.on("sendMessage", ({ senderId, receiveId, chatText }) => {
      const user = onlineUsers.find((user) => user.userId === receiveId);
      if (user) {
        // console.log('user',user.socketId);
        // console.log('message',chatText);

        io.to(user.socketId).emit("getMessage", {
          receiveId,
          senderId,
          chatText,
        });
      }
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  router.route("/:id").post(createMessage(io)).get(getMessage(io));
  router.route("/").post(getUserChat(io));
  return router;
};

module.exports = chatRoutes;
