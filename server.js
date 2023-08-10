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

// Nexa Core API - Get All Cases
app.get('/api/cases/all', (req, res) => {
    let sql = 'SELECT * FROM work_case';

    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        
        // JSON Response
        res.json(results);
    });
});

// Nexa Core API - Get Case by ID
app.get('/api/cases/:id', (req, res) => {
    let sql = `SELECT * FROM work_case WHERE case_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);

        // JSON Response
        res.json(result);
    });
});

// Nexa Core API - Get Case by PP id
app.get('/api/cases/pp/:id', (req, res) => {
    let sql = `SELECT * FROM work_case WHERE case_pp_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);

        // JSON Response
        res.json(result);
    });
});

// Nexa Core API - Get Case by Ad id
app.get('/api/cases/ad/:id', (req, res) => {
    let sql = `SELECT * FROM work_case WHERE case_ad_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);

        // JSON Response
        res.json(result);
    });
});

app.listen(3000, () => console.log('Nexa Core is listening on port 3000.'));