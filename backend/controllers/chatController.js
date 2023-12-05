const db = require('../Database/database');

const getMessage = (req, res) => {
  const receiverId = req.query.receiverId;
  const senderId = req.query.senderId;
  // console.log(receiverId);
  // console.log(senderId);

  try {
    const SELECT_CHAT_QUERY = `SELECT * FROM chat WHERE (send_user_id = ? AND receive_user_id = ?) OR (send_user_id = ? AND receive_user_id = ?);`;
    db.query(SELECT_CHAT_QUERY, [receiverId, senderId, senderId, receiverId], (err, results) => {
      if (err) {
        console.error('Error finding chat: ' + err);
        res.status(500).json({ error: 'Error finding chat' });
        return;
      } else {
        if (results.length > 0) {
          const chatData = results.map(chat => {
          const chatTimestamp = new Date(chat.chat_timestamp);
          const formattedTimestamp = chatTimestamp.toISOString().replace('T', ' ').slice(0, -5);
          return {
            chat_id: chat.chat_id,
            receive_user_id: chat.receive_user_id,
            send_user_id: chat.send_user_id,
            chat_text: chat.chat_text,
            time: formattedTimestamp,
          };
        });
        res.status(200).json({
          status: 'success',
          message: 'Chat already exists',
          chat: chatData,
        });
        }
        else {
          res.status(404).json({
            status: 'fail',
            message: 'Chats not found',
            chat: [],
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getUserChat = (req, res) => {
  const { receiverId } = req.body;
  // console.log(receiverId);

  try {
    const SELECT_USER_CHAT_QUERY = `
    SELECT 
        CASE 
            WHEN send_user_id = ? THEN receive_user_id
            ELSE send_user_id
        END AS user_id,
        CASE 
            WHEN send_user_id = ? THEN (SELECT username FROM user WHERE user_id = receive_user_id)
            ELSE (SELECT username FROM user WHERE user_id = send_user_id)
        END AS username
    FROM chat
    WHERE send_user_id = ? OR receive_user_id = ?
    GROUP BY user_id, username;
    `;
    db.query(SELECT_USER_CHAT_QUERY, [receiverId,receiverId,receiverId,receiverId], (err, results) => {
      if (err) {
        console.error('Error finding user chats: ' + err);
        res.status(500).json({ error: 'Error finding user chats' });
        return;
      } else {
        if (results.length > 0) {
          const chatData = results.map(chat => ({
          send_user_id: chat.send_user_id,
          userId: chat.user_id,
          username: chat.username,
          }));
          res.status(200).json({
            status: 'success',
            message: 'Chats found',
            chat: chatData,
          });
        } else {
          res.status(404).json({
            status: 'fail',
            message: 'Chats not found',
            chat: [],
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// createMessage
const createMessage = (req, res) => {
  const { receiverId, senderId, text } = req.body;

  console.log(receiverId);
  console.log(senderId);
  console.log(text);
  try{
    const INSERT_CHAT_QUERY = 'INSERT INTO chat (receive_user_id, send_user_id, chat_text) VALUES (?, ?, ?)';
    db.query(INSERT_CHAT_QUERY, [receiverId, senderId, text], (err, results) => {
    if (err) {
      console.error('Error creating chat: ' + err);
      res.status(500).json({ error: 'Error creating chat' });
      return;
    }
    else {
      const Message = results;
      console.log(Message); 
      res.status(200).json({
        status: 'success',
        message: 'Message created successfully', Message
      });
    }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
}


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

module.exports = { getMessage, getUserChat, createMessage, getChat, saveMessageToDatabase };
