const db = require('../Database/database.js');

class ChatController {
  constructor(io) {
    this.io = io;
  }

  handleConnection(socket) {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg, sender) => {
      // Save the message to the database
      this.saveMessageToDatabase(msg, sender);

      // Emit the message to all clients
      this.io.emit('chat message', { message: msg, sender });
    });
  }

  saveMessageToDatabase(message, sender) {
    const query = 'INSERT INTO chat (message, sender) VALUES (?, ?)';
    db.query(query, [message, sender], (err, result) => {
      if (err) {
        console.error('Error saving message to database:', err);
      } else {
        console.log('Message saved to database:', result);
      }
    });
  }
}

module.exports = ChatController;

  