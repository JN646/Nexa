// Requires
const express = require('express');
const mysql = require('mysql');

// System Settings
const port = 3000;
const consoleLogging = false;

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

// Log all requests
app.use((req, res, next) => {
    // Console Logging
    if (consoleLogging == true) {
        console.log(req.method + ' ' + req.url);
    }

    next();
});

// Log all api requests to database
app.use('/api', (req, res, next) => {
    let post = {
        log_method: req.method,
        log_url: req.url
    };

    let sql = 'INSERT INTO api_logs SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }
    });

    next();
});

// Home Page
app.get('/', (req, res) => {
    res.send('Nexa Core API');
});

// Status
app.get('/status', (req, res) => {
    // Get information about server
    let server = {
        name: 'ParaplannerNexa',
        version: '1.0.0',
        status: 'Running',
        port: port
    };

    // Console Logging
    if (consoleLogging == true) {
        console.log(server);
    }

    // JSON Response
    res.json(server);
});

// Nexa Core API
app.get('/api', (req, res) => {
    res.send('Nexa Core API Initiated');
});

// Nexa Core API - Get All Cases
app.get('/api/cases/all', (req, res) => {
    let sql = 'SELECT work_case.*, pp_firstname, pp_lastname, ad_firstname, ad_lastname FROM work_case LEFT JOIN paraplanners ON work_case.case_pp_id = paraplanners.pp_id LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id';

    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }
        
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

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.json(result);
    });
});

// Create Case
app.post('/api/cases/create', (req, res) => {
    let post = {
        case_pp_id: req.body.case_pp_id,
        case_ad_id: req.body.case_ad_id,
        case_due_date: req.body.case_due_date
    };

    let sql = 'INSERT INTO work_case SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Update Case
app.put('/api/cases/update/:id', (req, res) => {
    let sql = `UPDATE work_case SET case_pp_id = '${req.body.case_pp_id}', case_ad_id = '${req.body.case_ad_id}', case_due_date = '${req.body.case_due_date}' WHERE case_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Delete Case
app.delete('/api/cases/delete/:id', (req, res) => {
    let sql = `DELETE FROM work_case WHERE case_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

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

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

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

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.json(result);
    });
});

// Nexa Core API - Get Cases that do not have a Paraplanner assigned
app.get('/api/cases/paraplanner/none', (req, res) => {
    let sql = `SELECT * FROM work_case WHERE case_pp_id IS NULL OR case_pp_id = ''`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.json(result);
    });
});

// List of all Paraplanners
app.get('/api/paraplanners/all', (req, res) => {
    let sql = 'SELECT * FROM paraplanners';

    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.json(results);
    });
});

// Create Paraplanner
app.post('/api/paraplanners/create', (req, res) => {
    let post = {
        pp_firstname: req.body.pp_firstname,
        pp_lastname: req.body.pp_lastname,
        pp_email: req.body.pp_email
    };

    let sql = 'INSERT INTO paraplanners SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Update Paraplanner
app.put('/api/paraplanners/update/:id', (req, res) => {
    let sql = `UPDATE paraplanners SET pp_firstname = '${req.body.pp_firstname}', pp_lastname = '${req.body.pp_lastname}', pp_email = '${req.body.pp_email}' WHERE pp_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Delete Paraplanner
app.delete('/api/paraplanners/delete/:id', (req, res) => {
    let sql = `DELETE FROM paraplanners WHERE pp_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// List of all Advisers
app.get('/api/advisers/all', (req, res) => {
    let sql = 'SELECT * FROM advisers';

    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.json(results);
    });
});

// Create Adviser
app.post('/api/advisers/create', (req, res) => {
    let post = {
        ad_firstname: req.body.ad_firstname,
        ad_lastname: req.body.ad_lastname,
        ad_email: req.body.ad_email
    };

    let sql = 'INSERT INTO advisers SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Update Adviser
app.put('/api/advisers/update/:id', (req, res) => {
    let sql = `UPDATE advisers SET ad_firstname = '${req.body.ad_firstname}', ad_lastname = '${req.body.ad_lastname}', ad_email = '${req.body.ad_email}' WHERE ad_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Delete Adviser
app.delete('/api/advisers/delete/:id', (req, res) => {
    let sql = `DELETE FROM advisers WHERE ad_id = ${req.params.id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Listen on Port
app.listen(port, () => console.log('Nexa Core is listening on port 3000.'));