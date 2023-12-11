/********************************************************************
 *   database.js                                                    *
 *                                                                  *
 *   File responsible for database configuration and connection.    *
 *   It often includes settings for connecting to and interacting   *
 *   with the database, such as connection URLs and configurations. *
 *                                                                  *
 ********************************************************************/

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