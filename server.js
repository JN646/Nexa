// *****************************************************
// Nexa Core API
// *****************************************************

// Requires
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// System Settings
const port = 3000;
const consoleLogging = false;
const apiKey = '6bc32663-fb4f-4b8b-86e7-f08faa2cf302';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// *****************************************************
// DATABASE
// *****************************************************

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

// *****************************************************
// FUNCTIONS
// *****************************************************

// Log all requests
app.use((req, res, next) => {
    // Console Logging
    if (consoleLogging == true) {
        console.log(req.method + ' ' + req.url + ' ' + res.statusCode);
    }

    next();
});

// Log all api requests to database
app.use('/api', (req, res, next) => {
    let post = {
        log_method: req.method,
        log_url: req.url,
        log_status: res.statusCode
    };

    let sql = 'INSERT INTO api_logs SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }
    });

    next();
});

// *****************************************************
// MIDDLEWARE
// *****************************************************

// Check for API Key
app.use((req, res, next) => {
    if (req.query.apiKey == apiKey) {
        next();
    } else {
        res.status(401).json('Invalid API Key');
    }
});

// Trim and sanitize all inputs
app.use((req, res, next) => {
    // Trim all inputs
    for (let key in req.body) {
        req.body[key] = req.body[key].trim();
    }

    // Sanitise all inputs
    // for (let key in req.body) {
    //     req.body[key] = req.sanitize(req.body[key]);
    // }

    next();
});

// *****************************************************
// CORE PAGES
// *****************************************************

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

// *****************************************************
// API
// *****************************************************

// Nexa Core API
app.get('/api', (req, res) => {
    res.send('Nexa Core API Initiated');
});

// *****************************************************
// CASES
// *****************************************************

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

// *****************************************************
// PARAPLANNERS
// *****************************************************

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

// *****************************************************
// ADVISERS
// *****************************************************

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
    // Get variables
    let ad_firstname = req.body.ad_firstname;
    let ad_lastname = req.body.ad_lastname;
    let ad_email = req.body.ad_email;

    // Check if variables are empty
    if (ad_firstname == '' || ad_lastname == '' || ad_email == '') {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the variables are not empty
    if (ad_firstname == null || ad_lastname == null || ad_email == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Create array
    let post = {
        ad_firstname: ad_firstname,
        ad_lastname: ad_lastname,
        ad_email: ad_email
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

// *****************************************************
// SERVER
// *****************************************************

// Listen on Port
app.listen(port, () => console.log('Nexa Core is listening on port 3000.'));