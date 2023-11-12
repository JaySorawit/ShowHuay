const express = require('express');
const mysql =  require('mysql');

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ShowHuay_DB'
})

connection.connect((err) => {
    if(err) {
        console.log('Error connecting to MySQL database!', err);
        return;
    }
    console.log('MySQL successfully connected!');
})

app.listen(3000, () => {
    console.log('Sever started successfully!');
})