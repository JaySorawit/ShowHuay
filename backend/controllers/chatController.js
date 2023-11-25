const db = require('../Database/database');

const getChat = (req, res, io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
      // Assuming you have sender and receiver information, you can modify this part accordingly
      const sender = 'SomeSender'; // Replace with actual sender information
      const receiver = 'SomeReceiver'; // Replace with actual receiver information

      // Emit the message to all connected clients
      io.emit('chat message', { message: msg, sender, receiver });

      // Save the message to the database
      saveMessageToDatabase(msg, sender, receiver);
    });
  });
};

const saveMessageToDatabase = (message, sender, receiver) => {
  const query = 'INSERT INTO chat (message, sender, receiver) VALUES (?, ?, ?)';
  db.query(query, [message, sender, receiver], (err, result) => {
    if (err) {
      console.error('Error saving message to database:', err);
    } else {
      console.log('Message saved to database:', result);
    }
  });
};

module.exports = { getChat, saveMessageToDatabase };
