const express = require('express');
const router = express.Router();
const { getChat } = require('../controllers/chatController');

router.get("/:id", (req, res) => {
  // Access io directly from the app
  const io = req.app.get('io');
  getChat(req, res, io);
});

module.exports = router;
