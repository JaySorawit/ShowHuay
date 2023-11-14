const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'showhuay_db'
})

connection.connect((err) => {
    if(err) {
        console.log('Error connecting to MySQL database!', err);
        return;
    }
    console.log('MySQL successfully connected!');
})

module.exports = connection;