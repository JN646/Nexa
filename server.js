// Requires
const express = require('express');
const mysql = require('mysql');

// System Settings
const port = 3000;

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

// Nexa Core API - Get Case by Paraplanner id
app.get('/api/cases/paraplanner/:id', (req, res) => {
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

// Nexa Core API - Get Case by Adviser id
app.get('/api/cases/adviser/:id', (req, res) => {
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

// Nexa Core API - Get Cases that do not have a Paraplanner assigned
app.get('/api/cases/paraplanner/none', (req, res) => {
    let sql = `SELECT * FROM work_case WHERE case_pp_id IS NULL`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);

        // JSON Response
        res.json(result);
    });
});

// Listen on Port
app.listen(port, () => console.log('Nexa Core is listening on port 3000.'));