const database = require('../Database/database')

class ChatController {
    constructor(io) {
      this.io = io;
    }
  
    handleConnection(socket) {
  
      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined the chat`);
      });
  
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  
      socket.on('chat message', ({ message, sender, receiver }) => {
        // Save the message to the database
        this.saveMessageToDatabase(message, sender, receiver);
  
        // Emit the message to the receiver's room
        this.io.to(receiver).emit('chat message', { message, sender });
      });
    }
  
    saveMessageToDatabase(message, sender, receiver) {
      const query = 'INSERT INTO chat (message, sender, receiver) VALUES (?, ?, ?)';
      db.query(query, [message, sender, receiver], (err, result) => {
        if (err) {
          console.error('Error saving message to database:', err);
        } else {
          console.log('Message saved to database:', result);
        }
      });
    }
  }
  
  module.exports = ChatController;
  

  