const express = require('express');
const router = express.Router();
const { getMessage, createMessage, getUserChat, getChat } = require('../controllers/chatController');

router.route("/:id").post(createMessage);
router.route("/:id").get(getMessage);
router.route("/").get(getUserChat); 
// router.get("/:id", (req, res) => {
//   // Access io directly from the app
//   const io = req.app.get('io');
//   getChat(req, res, io);
// });

module.exports = router;
