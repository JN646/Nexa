// *****************************************************
// Nexa Core API
// *****************************************************

// Requires
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load env vars
require('dotenv').config();

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
    if (process.env.consoleLogging == true) {
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
    if (req.query.apiKey == process.env.apiKey) {
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
    res.status(200).send('Nexa Core API');
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
    if (process.env.consoleLogging == true) {
        console.log(server);
    }

    // JSON Response
    res.status(200).json(result);
});

// *****************************************************
// API
// *****************************************************

// Nexa Core API
app.get('/api', (req, res) => {
    res.status(200).send('Nexa Core API Initiated');
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }
        
        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Paraplanner has no cases.');
            return;
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Adviser not found.');
            return;
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.status(200).json(result);
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.status(200).json(result);
    });
});

// Get Paraplanner by ID
app.get('/api/paraplanners/:id', (req, res) => {
    // Get ID
    let id = req.params.id;

    // Check if ID is empty
    if (id == '' || id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(id)) {
        res.status(400).json('ID is not a number');
        return;
    }

    let sql = `SELECT * FROM paraplanners WHERE pp_id = ${id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Adviser not found.');
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

// Create Paraplanner
app.post('/api/paraplanners/create', (req, res) => {
    // Get variables
    let pp_firstname = req.body.pp_firstname;
    let pp_lastname = req.body.pp_lastname;
    let pp_email = req.body.pp_email;

    // Check if variables are empty
    if (pp_firstname == '' || pp_lastname == '' || pp_email == '') {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the variables are not empty
    if (pp_firstname == null || pp_lastname == null || pp_email == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }
    
    // Ensure that the email is valid
    if (pp_email.indexOf('@') == -1 || pp_email.indexOf('.') == -1) {
        res.status(400).json('Please enter a valid email address.');
        return;
    }

    // Create array
    let post = {
        pp_firstname: pp_firstname,
        pp_lastname: pp_lastname,
        pp_email: pp_email
    };

    let sql = 'INSERT INTO paraplanners SET ?';

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
    });
});

// Update Paraplanner
app.put('/api/paraplanners/update/:id', (req, res) => {
    // Get variables
    let pp_firstname = req.body.pp_firstname;
    let pp_lastname = req.body.pp_lastname;
    let pp_email = req.body.pp_email;
    let pp_id = req.params.id;

    // Check if ID is empty
    if (pp_id == '' || pp_id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(pp_id)) {
        res.status(400).json('ID is not a number');
        return;
    }

    // Check if variables are empty
    if (pp_firstname == '' || pp_lastname == '' || pp_email == '') {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the variables are not empty
    if (pp_firstname == null || pp_lastname == null || pp_email == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Ensure that the email is valid
    if (pp_email.indexOf('@') == -1 || pp_email.indexOf('.') == -1) {
        res.status(400).json('Please enter a valid email address.');
        return;
    }

    // Create array
    let post = {
        pp_firstname: pp_firstname,
        pp_lastname: pp_lastname,
        pp_email: pp_email,
        pp_id: pp_id
    };

    // Update Paraplanner
    let sql = `UPDATE paraplanners SET pp_firstname = ?, pp_lastname = ?, pp_email = ? WHERE pp_id = ?`;

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
    });
});

// Delete Paraplanner
app.delete('/api/paraplanners/delete/:id', (req, res) => {
    // Get ID
    let id = req.params.id;

    // Check if ID is empty
    if (id == '' || id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(id)) {
        res.status(400).json('ID is not a number');
        return;
    }

    let sql = `DELETE FROM paraplanners WHERE pp_id = ${id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Paraplanner not found.');
            return;
        } else {
            res.status(200).json('Paraplanner deleted.');
        }
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
        if (process.env.consoleLogging == true) {
            console.log(results);
        }

        // JSON Response
        res.status(200).json(results);
    });
});

// Get Adviser by ID
app.get('/api/advisers/:id', (req, res) => {
    // Get ID
    let id = req.params.id;

    // Check if ID is empty
    if (id == '' || id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(id)) {
        res.status(400).json('ID is not a number');
        return;
    }

    let sql = `SELECT * FROM advisers WHERE ad_id = ${id}`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Adviser not found.');
            return;
        } else {
            res.status(200).json(result);
        }
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

    // Ensure that the email is valid
    if (ad_email.indexOf('@') == -1 || ad_email.indexOf('.') == -1) {
        res.status(400).json('Please enter a valid email address.');
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
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Update Adviser
app.put('/api/advisers/update/:id', (req, res) => {
    // Get variables
    let ad_firstname = req.body.ad_firstname;
    let ad_lastname = req.body.ad_lastname;
    let ad_email = req.body.ad_email;
    let ad_id = req.params.id;

    // Check if ID is empty
    if (ad_id == '' || ad_id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(ad_id)) {
        res.status(400).json('ID is not a number');
        return;
    }

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

    // Ensure that the email is valid
    if (ad_email.indexOf('@') == -1 || ad_email.indexOf('.') == -1) {
        res.status(400).json('Please enter a valid email address.');
        return;
    }

    // Create array
    let post = {
        ad_firstname: ad_firstname,
        ad_lastname: ad_lastname,
        ad_email: ad_email,
        ad_id: ad_id
    };

    // Update Adviser
    let sql = `UPDATE advisers SET ad_firstname = ?, ad_lastname = ?, ad_email = ? WHERE ad_id = ?`;

    let query = db.query(sql, post, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // JSON Response
        res.json(result);
    });
});

// Delete Adviser
app.delete('/api/advisers/delete/:id', (req, res) => {
    // Get ID
    let id = req.params.id;

    // Check if ID is empty
    if (id == '' || id == null) {
        res.status(400).json('Please fill in all fields.');
        return;
    }

    // Check that the ID is a number
    if (isNaN(id)) {
        res.status(400).json('ID is not a number');
        return;
    }

    // Prevent deletion if the adviser has any cases assigned to them
    let sql1 = `SELECT * FROM work_case WHERE case_ad_id = ${id}`;

    let query1 = db.query(sql1, (err, result) => {
        if (err) {
            throw err;
        }

        // Check if the adviser has any cases assigned to them
        if (result.length > 0) {
            res.status(400).json('Adviser has cases assigned to them.');
            return;
        }
    });

    // If the adviser has no cases assigned to them, delete them
    let sql2 = `DELETE FROM advisers WHERE ad_id = ${id}`;

    let query2 = db.query(sql2, (err, result) => {
        if (err) {
            throw err;
        }

        // Console Logging
        if (process.env.consoleLogging == true) {
            console.log(result);
        }

        // If result not found
        if (result.length == 0) {
            res.status(400).json('Adviser not found.');
            return;
        } else {
            res.status(200).json('Adviser deleted.');
        }
    });
});

// *****************************************************
// SERVER
// *****************************************************

// Listen on Port
app.listen(process.env.port, () => console.log('Nexa Core is listening on port ' + process.env.port));