// ChatController.js
const db = require('../Database/database');

class ChatController {
  constructor(io) {
    this.io = io;
    this.handleConnection = this.handleConnection.bind(this);

    // Listen for connections when the instance is created
    this.io.on('connection', this.handleConnection);
  }

  handleConnection(socket) {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });

    socket.on('chat message', ({ message, sender, receiver }) => {
      // Save the message to the database
      this.saveMessageToDatabase(message, sender, receiver)
        .then(() => {
          // Emit the message to the receiver's room
          this.io.to(receiver).emit('chat message', { message, sender });
        })
        .catch((error) => {
          console.error('Error saving message to database:', error);
          // Emit an error event back to the client
          socket.emit('error', 'Failed to save the message to the database');
        });
    });
  }

  async saveMessageToDatabase(message, sender, receiver) {
    const query = 'INSERT INTO chat (chat_text, sender, receiver) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [message, sender, receiver], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = ChatController;
