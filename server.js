const express = require('express');
const mysql = require('mysql');

const app = express();

// Configure Mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'nexa',
    password: 'Nexa1234',
    port: 3306,
    database: 'nexa'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Nexa Core
app.get('/', (req, res) => {
  res.send('Nexa Core Initiated');
});

// Nexa Core API
app.get('/api', (req, res) => {
    res.send('Nexa Core API Initiated');
});

app.listen(3000, () => console.log('Nexa Core is listening on port 3000.'));