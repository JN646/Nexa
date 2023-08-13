// *****************************************************
// Nexa Core API
// *****************************************************

// Requires
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { body, validationResult, param } = require("express-validator");

// Load env vars
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a rate limiter to prevent excessive API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api", apiLimiter);

// *****************************************************
// DATABASE
// *****************************************************

// Configure Mysql
const db = mysql.createConnection({
  host: "localhost",
  user: "nexa",
  password: "Nexa1234",
  port: 3306,
  database: "nexa",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");
});

// *****************************************************
// FUNCTIONS
// *****************************************************

// Log all requests
app.use((req, res, next) => {
  // Console Logging
  if (process.env.consoleLogging == true) {
    console.log(req.method + " " + req.url + " " + res.statusCode);
  }

  next();
});

// Middleware to log API requests
app.use("/api", (req, res, next) => {
  const logEntry = {
    log_method: req.method,
    log_url: req.url,
    log_status: res.statusCode,
    log_request: JSON.stringify(req.body),
    log_response: JSON.stringify(res.body),
  };

  db.query("INSERT INTO api_logs SET ?", logEntry, (err) => {
    if (err) {
      console.error("Error logging API request:", err);
    }
  });

  next();
});

// Custom validation function for email domains
const validEmailDomain = (value) => {
    if (!value.match(/@(sjp\.co\.uk|sjpp\.co\.uk)$/)) {
      throw new Error('Email must be from @sjp.co.uk or @sjpp.co.uk domain');
    }
    return value;
  };

// *****************************************************
// MIDDLEWARE
// *****************************************************

// Check for API Key
app.use("/api", (req, res, next) => {
  const apiKey = req.headers["x-api-key"]; // Change 'x-api-key' to your header key

  // Replace 'YOUR_VALID_API_KEY' with your actual valid API key
  if (apiKey === process.env.apiKey) {
    next();
  } else {
    res.status(401).json({ error: "Invalid API key" });
  }
});

// Trim and sanitize all inputs
app.use((req, res, next) => {
  // Trim all inputs
  for (let key in req.body) {
    req.body[key] = req.body[key].trim();
  }

  next();
});

// Middleware to validate and sanitize inputs using express-validator
app.use(
  "/api",
  [
    // Trim and sanitize body inputs
    (req, res, next) => {
      for (const key in req.body) {
        if (typeof req.body[key] === "string") {
          req.body[key] = req.body[key].trim();
        }
      }
      next();
    },
    // Use express-validator to sanitize and validate inputs
    body().customSanitizer((value, { req }) => {
      // Sanitize value here (e.g., escape HTML characters)
      return value;
    }),
  ],
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
);

// *****************************************************
// CORE PAGES
// *****************************************************

// Home Page
app.get("/", (req, res) => {
  res.status(200).send("Nexa Core API");
});

// Status
app.get("/status", (req, res) => {
  // Get information about server
  let server = {
    name: "ParaplannerNexa",
    version: "1.0.0",
    status: "Running",
    port: port,
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
app.get("/api", (req, res) => {
  res.status(200).send("Nexa Core API Initiated");
});

// *****************************************************
// CASES
// *****************************************************

// Nexa Core API - Get All Cases
app.get("/api/cases/all", (req, res) => {
  let sql =
    "SELECT work_case.*, pp_firstname, pp_lastname, ad_firstname, ad_lastname FROM work_case LEFT JOIN paraplanners ON work_case.case_pp_id = paraplanners.pp_id LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id";

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

// Nexa Core API - Get Case by ID
app.get("/api/cases/:id", (req, res) => {
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
app.post("/api/cases/create", (req, res) => {
  // Get variables
  let case_pp_id = req.body.case_pp_id;
  let case_ad_id = req.body.case_ad_id;
  let case_due_date = req.body.case_due_date;
  let case_type = req.body.case_type;
  let case_bid_price = req.body.case_bid_price;
  let case_bid_status = req.body.case_bid_status;

  // Check if variables are empty
  if (
    case_ad_id == "" ||
    case_due_date == "" ||
    case_type == "" ||
    case_bid_price == "" ||
    case_bid_status == ""
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (
    case_ad_id == null ||
    case_due_date == null ||
    case_type == null ||
    case_bid_price == null ||
    case_bid_status == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are numbers
  if (isNaN(case_pp_id) || isNaN(case_ad_id) || isNaN(case_bid_price)) {
    res.status(400).json("Please enter a number.");
    return;
  }

  // Create array
  let post = {
    case_pp_id: case_pp_id,
    case_ad_id: case_ad_id,
    case_due_date: case_due_date,
    case_type: case_type,
    case_bid_price: case_bid_price,
    case_bid_status: case_bid_status,
  };

  let sql = "INSERT INTO work_case SET ?";

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
app.put("/api/cases/update/:id", (req, res) => {
  // Get variables
  let case_pp_id = req.body.case_pp_id;
  let case_ad_id = req.body.case_ad_id;
  let case_due_date = req.body.case_due_date;
  let case_type = req.body.case_type;
  let case_bid_price = req.body.case_bid_price;
  let case_bid_status = req.body.case_bid_status;
  let case_id = req.params.id;

  // Check if ID is empty
  if (case_id == "" || case_id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(case_id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Check if variables are empty
  if (
    case_ad_id == "" ||
    case_due_date == "" ||
    case_type == "" ||
    case_bid_price == "" ||
    case_bid_status == ""
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (
    case_ad_id == null ||
    case_due_date == null ||
    case_type == null ||
    case_bid_price == null ||
    case_bid_status == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are numbers
  if (isNaN(case_ad_id) || isNaN(case_bid_price)) {
    res.status(400).json("Please enter a number.");
    return;
  }

  // Create array
  let post = {
    case_pp_id: case_pp_id,
    case_ad_id: case_ad_id,
    case_due_date: case_due_date,
    case_type: case_type,
    case_bid_price: case_bid_price,
    case_bid_status: case_bid_status,
    case_id: case_id,
  };

  // Update Case
  let sql = `UPDATE work_case SET case_pp_id = ?, case_ad_id = ?, case_due_date = ?, case_type = ?, case_bid_price = ?, case_bid_status = ? WHERE case_id = ?`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // Console Logging
    if (process.env.consoleLogging == true) {
      console.log(result);
    }

    // Check that the case exists
    if (result.length == 0) {
      res.status(400).json("Case not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Delete Case
app.delete("/api/cases/delete/:id", (req, res) => {
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

// Cases Bids
app.get("/api/cases/bids/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Get Bids
  let sql = `SELECT * FROM bids WHERE bid_case_id = ${id}`;

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
// BIDS
// *****************************************************

// Create Bid
app.post("/api/bids/create", (req, res) => {
  // Get variables
  let bid_case_id = req.body.bid_case_id;
  let bid_pp_id = req.body.bid_pp_id;
  let bid_ad_id = req.body.bid_ad_id;
  let bid_price = req.body.bid_price;
  let bid_status = req.body.bid_status;

  // Check if variables are empty
  if (
    bid_case_id == "" ||
    bid_pp_id == "" ||
    bid_ad_id == "" ||
    bid_price == "" ||
    bid_status == ""
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (
    bid_case_id == null ||
    bid_pp_id == null ||
    bid_ad_id == null ||
    bid_price == null ||
    bid_status == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are numbers
  if (
    isNaN(bid_case_id) ||
    isNaN(bid_pp_id) ||
    isNaN(bid_ad_id) ||
    isNaN(bid_price)
  ) {
    res.status(400).json("Please enter a number.");
    return;
  }

  // Check that the bid price is not a negative number
  if (bid_price < 0) {
    res.status(400).json("Please enter a positive number.");
    return;
  }

  // Check that the bid price is over 30
  if (bid_price < 30) {
    res.status(400).json("Please enter a bid over £30.");
    return;
  }

  // Create array
  let post = {
    bid_case_id: bid_case_id,
    bid_pp_id: bid_pp_id,
    bid_ad_id: bid_ad_id,
    bid_price: bid_price,
    bid_status: bid_status,
  };

  let sql = "INSERT INTO bids SET ?";

  let query = db.query(sql, post, (err, result) => {
    if (err) {
      throw err;
    }

    // Check that the case exists
    if (result.length == 0) {
      res.status(400).json("Case not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Update Bid
app.put("/api/bids/update/:id", (req, res) => {
  // Get variables
  let bid_case_id = req.body.bid_case_id;
  let bid_pp_id = req.body.bid_pp_id;
  let bid_ad_id = req.body.bid_ad_id;
  let bid_price = req.body.bid_price;
  let bid_status = req.body.bid_status;
  let bid_id = req.params.id;

  // Check if ID is empty
  if (bid_id == "" || bid_id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(bid_id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Check if variables are empty
  if (
    bid_case_id == "" ||
    bid_pp_id == "" ||
    bid_ad_id == "" ||
    bid_price == "" ||
    bid_status == ""
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (
    bid_case_id == null ||
    bid_pp_id == null ||
    bid_ad_id == null ||
    bid_price == null ||
    bid_status == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are numbers
  if (
    isNaN(bid_case_id) ||
    isNaN(bid_pp_id) ||
    isNaN(bid_ad_id) ||
    isNaN(bid_price)
  ) {
    res.status(400).json("Please enter a number.");
    return;
  }

  // Check that the bid price is not a negative number
  if (bid_price < 0) {
    res.status(400).json("Please enter a positive number.");
    return;
  }

  // Check that the bid price is over 30
  if (bid_price < 30) {
    res.status(400).json("Please enter a bid over £30.");
    return;
  }

  // Create array
  let post = {
    bid_case_id: bid_case_id,
    bid_pp_id: bid_pp_id,
    bid_ad_id: bid_ad_id,
    bid_price: bid_price,
    bid_status: bid_status,
    bid_id: bid_id,
  };

  // Update Bid
  let sql = `UPDATE bids SET bid_case_id = ?, bid_pp_id = ?, bid_ad_id = ?, bid_price = ?, bid_status = ? WHERE bid_id = ?`;

  let query = db.query(sql, post, (err, result) => {
    if (err) {
      throw err;
    }

    // Check that the case exists
    if (result.length == 0) {
      res.status(400).json("Case not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Accept Bid by ID
app.put("/api/bids/accept/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Update Bid
  let sql = `UPDATE bids SET bid_status = 'Accepted' WHERE bid_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // Check that the case exists
    if (result.length == 0) {
      res.status(400).json("Case not found.");
      return;
    } else {
      console.log(result);

      // Check if bid already been accepted
      if (result.bid_status == "Accepted") {
        res.status(400).json("Bid already accepted.");
        return;
      }

      // Update Case
      res.status(200).json(result);
    }
  });
});

// Delete Bid
app.delete("/api/bids/delete/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Delete Bid
  let sql = `DELETE FROM bids WHERE bid_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // Check that the case exists
    if (result.length == 0) {
      res.status(400).json("Case not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// List of all Bids
app.get("/api/bids/all", (req, res) => {
  let sql = "SELECT * FROM bids";

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

// Get Bid by ID
app.get("/api/bids/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  let sql = `SELECT * FROM bids WHERE bid_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // If result not found
    if (result.length == 0) {
      res.status(400).json("Bid not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Count number of bids by case ID
app.get("/api/bids/count/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  let sql = `SELECT COUNT(*) AS bid_count FROM bids WHERE bid_case_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // If result not found
    if (result.length == 0) {
      res.status(400).json("Bid not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// *****************************************************
// PARAPLANNERS
// *****************************************************

// Nexa Core API - Get Case by Paraplanner id
app.get("/api/cases/paraplanner/:id", (req, res) => {
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
      res.status(400).json("Paraplanner has no cases.");
      return;
    }

    // JSON Response
    res.status(200).json(result);
  });
});

// Nexa Core API - Get Case by Adviser id
app.get("/api/cases/adviser/:id", (req, res) => {
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
      res.status(400).json("Adviser not found.");
      return;
    }

    // JSON Response
    res.status(200).json(result);
  });
});

// Nexa Core API - Get Cases that do not have a Paraplanner assigned
app.get("/api/cases/paraplanner/none", (req, res) => {
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
app.get("/api/paraplanners/all", (req, res) => {
  let sql = "SELECT * FROM paraplanners";

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
app.get("/api/paraplanners/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  let sql = `SELECT * FROM paraplanners WHERE pp_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // If result not found
    if (result.length == 0) {
      res.status(400).json("Adviser not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Create Paraplanner
app.post("/api/paraplanners/create", (req, res) => {
  // Get variables
  let pp_firstname = req.body.pp_firstname;
  let pp_lastname = req.body.pp_lastname;
  let pp_email = req.body.pp_email;

  // Check if variables are empty
  if (pp_firstname == "" || pp_lastname == "" || pp_email == "") {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (pp_firstname == null || pp_lastname == null || pp_email == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Ensure that the email is valid
  if (pp_email.indexOf("@") == -1 || pp_email.indexOf(".") == -1) {
    res.status(400).json("Please enter a valid email address.");
    return;
  }

  // Create array
  let post = {
    pp_firstname: pp_firstname,
    pp_lastname: pp_lastname,
    pp_email: pp_email,
  };

  let sql = "INSERT INTO paraplanners SET ?";

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
app.put("/api/paraplanners/update/:id", (req, res) => {
  // Get variables
  let pp_firstname = req.body.pp_firstname;
  let pp_lastname = req.body.pp_lastname;
  let pp_email = req.body.pp_email;
  let pp_id = req.params.id;

  // Check if ID is empty
  if (pp_id == "" || pp_id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(pp_id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Check if variables are empty
  if (pp_firstname == "" || pp_lastname == "" || pp_email == "") {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the variables are not empty
  if (pp_firstname == null || pp_lastname == null || pp_email == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Ensure that the email is valid
  if (pp_email.indexOf("@") == -1 || pp_email.indexOf(".") == -1) {
    res.status(400).json("Please enter a valid email address.");
    return;
  }

  // Create array
  let post = {
    pp_firstname: pp_firstname,
    pp_lastname: pp_lastname,
    pp_email: pp_email,
    pp_id: pp_id,
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
app.delete("/api/paraplanners/delete/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
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
      res.status(400).json("Paraplanner not found.");
      return;
    } else {
      res.status(200).json("Paraplanner deleted.");
    }
  });
});

// Get paraplanner star rating
app.get("/api/paraplanners/star-rating/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  let sql = `SELECT AVG(rating) AS rating FROM reviews WHERE pp_id = ${id}`;

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
      res.status(400).json("Paraplanner not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// *****************************************************
// ADVISERS
// *****************************************************

// List of all Advisers
app.get("/api/advisers/all", (req, res) => {
  let sql = "SELECT * FROM advisers";

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
app.get("/api/advisers/:id", (req, res) => {
  // Get ID
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  let sql = `SELECT * FROM advisers WHERE ad_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // If result not found
    if (result.length == 0) {
      res.status(400).json("Adviser not found.");
      return;
    } else {
      res.status(200).json(result);
    }
  });
});

// Create Adviser
app.post("/api/advisers/create", [
    body('ad_firstname').trim().notEmpty(),
    body('ad_lastname').trim().notEmpty(),
    body('ad_email')
      .trim()
      .isEmail()
      .custom(validEmailDomain)
      .custom(async (value) => {
        const existingEmail = await db.query(
          "SELECT ad_email FROM advisers WHERE ad_email = ?",
          [value]
        );
        if (existingEmail.length > 0) {
          throw new Error('Email is already in use');
        }
        return value;
      }),
    body('ad_role').optional().trim(),
    body('ad_tel').optional().trim(),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      ad_firstname,
      ad_lastname,
      ad_email,
      ad_role,
      ad_tel
    } = req.body;
  
    const post = {
      ad_firstname,
      ad_lastname,
      ad_role,
      ad_email,
      ad_tel,
    };
  
    const sql = "INSERT INTO advisers SET ?";
  
    db.query(sql, post, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
  
      // Console Logging
      if (process.env.consoleLogging === true) {
        console.log(result);
      }
  
      // JSON Response
      res.json(result);
    });
  });

// Update Adviser
app.put("/api/advisers/update/:id", [
    body('ad_firstname').optional().trim().notEmpty(),
    body('ad_lastname').optional().trim().notEmpty(),
    body('ad_email')
      .optional()
      .trim()
      .isEmail()
      .custom(validEmailDomain)
      .custom(async (value, { req }) => {
        const existingEmail = await db.query(
          "SELECT ad_email FROM advisers WHERE ad_email = ? AND ad_id != ?",
          [value, req.params.id]
        );
        if (existingEmail.length > 0) {
          throw new Error('Email is already in use');
        }
        return value;
      }),
    body('ad_role').optional().trim(),
    body('ad_tel').optional().trim(),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      ad_firstname,
      ad_lastname,
      ad_email,
      ad_role,
      ad_tel
    } = req.body;
  
    const updatedFields = {};
    if (ad_firstname) updatedFields.ad_firstname = ad_firstname;
    if (ad_lastname) updatedFields.ad_lastname = ad_lastname;
    if (ad_email) updatedFields.ad_email = ad_email;
    if (ad_role) updatedFields.ad_role = ad_role;
    if (ad_tel) updatedFields.ad_tel = ad_tel;
  
    const sql = "UPDATE advisers SET ? WHERE ad_id = ?";
  
    db.query(sql, [updatedFields, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
  
      // Console Logging
      if (process.env.consoleLogging === true) {
        console.log(result);
      }
  
      // JSON Response
      res.json(result);
    });
  });

// Delete Adviser
app.delete("/api/advisers/delete/:id", [
    param('id').isInt(),
  ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const adviserId = req.params.id;
  
    // Check if adviser has associated cases in word_cases table
    const checkCasesQuery = "SELECT * FROM work_cases WHERE case_ad_id = ?";
    const cases = await db.query(checkCasesQuery, [adviserId]);
  
    if (cases.length > 0) {
      return res.status(400).json({ error: "Adviser has associated cases. Cannot delete." });
    }
  
    const deleteAdviserQuery = "DELETE FROM advisers WHERE id = ?";
    
    db.query(deleteAdviserQuery, [adviserId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
  
      // Console Logging
      if (process.env.consoleLogging === true) {
        console.log(result);
      }
  
      // JSON Response
      res.json(result);
    });
  });

// Bids by paraplanner id
app.get("/api/bids/paraplanner/:id", (req, res) => {
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Get Bids
  let sql = `SELECT * FROM bids WHERE bid_pp_id = ${req.params.id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // Console Logging
    if (process.env.consoleLogging == true) {
      console.log(result);

      // JSON Response
      res.status(200).json(result);
    }

    // JSON Response
    res.status(200).json(result);
  });
});

// Bids by adviser id
app.get("/api/bids/adviser/:id", (req, res) => {
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Get Bids
  let sql = `SELECT * FROM bids WHERE bid_ad_id = ${id}`;

  let query = db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    // Console Logging
    if (process.env.consoleLogging == true) {
      console.log(result);

      // JSON Response
      res.status(200).json(result);
    }

    // JSON Response
    res.status(200).json(result);
  });
});

// *****************************************************
// REVIEWS
// *****************************************************

// Get all reviews
app.get("/api/reviews/all", (req, res) => {
  // Get Reviews
  let sql = `SELECT * FROM reviews`;

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

// Get reviews by adviser id
app.get("/api/reviews/adviser/:id", (req, res) => {
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Get Reviews
  let sql = `SELECT * FROM reviews WHERE review_ad_id = ${id}`;

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

// Get reviews by paraplanner id
app.get("/api/reviews/paraplanner/:id", (req, res) => {
  let id = req.params.id;

  // Check if ID is empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Get Reviews
  let sql = `SELECT * FROM reviews WHERE review_pp_id = ${id}`;

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

// Post a review
app.post("/api/reviews/create", (req, res) => {
  // Get variables
  let review_pp_id = req.body.review_pp_id;
  let review_ad_id = req.body.review_ad_id;
  let review_case_id = req.body.review_case_id;
  let review_stars = req.body.review_stars;
  let review_comment = req.body.review_comment;

  // Check if variables are empty
  if (
    review_pp_id == "" ||
    review_pp_id == null ||
    review_ad_id == "" ||
    review_ad_id == null ||
    review_case_id == "" ||
    review_case_id == null ||
    review_stars == "" ||
    review_stars == null ||
    review_comment == "" ||
    review_comment == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(review_pp_id) || isNaN(review_ad_id) || isNaN(review_case_id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Check that the stars is a number
  if (isNaN(review_stars)) {
    res.status(400).json("Stars is not a number");
    return;
  }

  // Check that the stars is a number
  if (review_stars > 5 || review_stars < 1) {
    res.status(400).json("Stars must be between 1 and 5");
    return;
  }

  // Check that the comment is less than 1000 characters
  if (review_comment.length > 1000) {
    res.status(400).json("Comment must be less than 1000 characters");
    return;
  }

  // Create Review
  let sql = `INSERT INTO reviews (review_pp_id, review_ad_id, review_case_id, review_stars, review_comment) VALUES (${review_pp_id}, ${review_ad_id}, ${review_case_id}, ${review_stars}, '${review_comment}')`;

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

// Update a review
app.put("/api/reviews/update/:id", (req, res) => {
  // Get variables
  let id = req.params.id;
  let review_stars = req.body.review_stars;
  let review_comment = req.body.review_comment;

  // Check if variables are empty
  if (
    id == "" ||
    id == null ||
    review_stars == "" ||
    review_stars == null ||
    review_comment == "" ||
    review_comment == null
  ) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Check that the stars is a number
  if (isNaN(review_stars)) {
    res.status(400).json("Stars is not a number");
    return;
  }

  // Check that the stars is a number
  if (review_stars > 5 || review_stars < 1) {
    res.status(400).json("Stars must be between 1 and 5");
    return;
  }

  // Check that the comment is less than 1000 characters
  if (review_comment.length > 1000) {
    res.status(400).json("Comment must be less than 1000 characters");
    return;
  }

  // Update Review
  let sql = `UPDATE reviews SET review_stars = ${review_stars}, review_comment = '${review_comment}' WHERE review_id = ${id}`;

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

// Delete a review
app.delete("/api/reviews/delete/:id", (req, res) => {
  // Get variables
  let id = req.params.id;

  // Check if variables are empty
  if (id == "" || id == null) {
    res.status(400).json("Please fill in all fields.");
    return;
  }

  // Check that the ID is a number
  if (isNaN(id)) {
    res.status(400).json("ID is not a number");
    return;
  }

  // Delete Review
  let sql = `DELETE FROM reviews WHERE review_id = ${id}`;

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

// Total number of reviews
app.get("/api/reviews/total", (req, res) => {
  // Get total number of reviews
  let sql = `SELECT COUNT(*) AS total FROM reviews`;

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
// SERVER
// *****************************************************

// Listen on Port
app.listen(process.env.port, () =>
  console.log("Nexa Core is listening on port " + process.env.port)
);
