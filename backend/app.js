const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql');
const chatRoutes = require('./routes/chatRoutes');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

/********************************** Connect to MySQL Database **********************************/
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "showhuay_db",
});
/***********************************************************************************************/

/********************************** Register BackEnd ****************************************/

/***** Registration System *****/
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    const INSERT_USER_QUERY = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;
    db.query(INSERT_USER_QUERY, [email, username, password], (err, results) => {
        if (err) {
            console.error('Error registering user: ' + err);
            res.status(500).json({ error: 'Error registering user' });
            return;
        }

        const userId = results.insertId; // Assuming your database returns the inserted ID

        res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            userId: userId,
            // You can add more data here if needed
        });
    });
});


/******************************/

/***** Query Email System *****/
app.get('/check-email', (req, res) => {
    const { email } = req.query;

    const query = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';

    db.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const count = results[0].count;

        if (count > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
});
/******************************/

/***********************************************************************************************/

/************************************** LogIn BackEnd ******************************************/
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = 'SELECT * FROM user WHERE email = ?';
    
    db.query(SELECT_USER_QUERY, [email], (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ error: 'Error retrieving user' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const user = results[0];
     
      if (password !== user.password) {
        res.status(401).json({ error: 'Incorrect password' });
        return;
      }
  
      // Login successful
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        userId: user.id,
      });
    });
  });
  
/***********************************************************************************************/


// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = socketIo(server);

// Routes
app.use('/apis/chat', chatRoutes(io));


// Start the server
app.listen(3000, () => {
    console.log('Server started successfully on port 3000!');
})


