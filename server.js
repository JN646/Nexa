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
const cors = require("cors");
const helmet = require("helmet");

// Load env vars
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.disable('x-powered-by')

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
        console.log(new Date().toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '') + " " + req.method + " " + req.url + " " + res.statusCode);
    }

    console.log(new Date().toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '') + " " + req.method + " " + req.url + " " + res.statusCode);

    next();
});

// Create Audit
function createAudit(audit_attach, audit_attach_id, audit_message) {
    // Create Audit
    let sql = `INSERT INTO audit SET audit_attach = ?, audit_attach_id = ?, audit_message = ?`;

    let query = db.query(
        sql,
        [audit_attach, audit_attach_id, audit_message],
        (err, result) => {
            if (err) {
                throw err;
            }
        }
    );
}

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

// Get All Cases
/**
 * Endpoint to get all cases with associated paraplanner and adviser information.
 * @name GET/api/cases/all
 * @function
 * @memberof module:routes/cases
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Returns a JSON object containing all cases with associated paraplanner and adviser information.
 * @throws {Error} Throws an error if there was a problem querying the database.
 */
app.get("/api/cases/all", (req, res) => {
  let sql =
    "SELECT work_case.*, pp_firstname, pp_lastname, ad_firstname, ad_lastname FROM work_case LEFT JOIN paraplanners ON work_case.case_pp_id = paraplanners.pp_id LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id";

    const query = db.query(sql, (err, result) => {
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


// Get all unassigned cases
/**
 * Endpoint to get all unassigned cases with associated paraplanner and adviser information.
 * @name GET/api/cases/unassigned
 * @function
 * @memberof module:routes/cases
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Returns a JSON object containing all unassigned cases with associated paraplanner and adviser information.
 * @throws {Error} Throws an error if there was a problem querying the database.
 */
app.get("/api/cases/unassigned", (req, res) => {
    let sql =
      "SELECT work_case.*, pp_firstname, pp_lastname, ad_firstname, ad_lastname FROM work_case LEFT JOIN paraplanners ON work_case.case_pp_id = paraplanners.pp_id LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id WHERE work_case.case_bid_status = 'Unassigned'";
  
      const query = db.query(sql, (err, result) => {
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

// Get Case by ID
/**
 * Endpoint to get a case by ID with associated adviser information.
 * @name GET/api/cases/:id
 * @function
 * @memberof module:routes/cases
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {number} req.params.id - The ID of the case to retrieve.
 * @returns {Object} Returns a JSON object containing the case with associated adviser information.
 * @throws {Error} Throws an error if there was a problem querying the database.
 * @throws {Error} Throws an error if the ID parameter is not an integer.
 */
app.get("/api/cases/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const sql = `SELECT work_case.*, ad_id, ad_firstname, ad_lastname FROM work_case LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id WHERE case_id = ${req.params.id}`;

    const query = db.query(sql, (err, result) => {
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

// Create Case
/**
 * Endpoint to create a new case.
 * @name POST/api/cases/create
 * @function
 * @memberof module:routes/cases
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {number} req.body.case_ad_id - The ID of the adviser associated with the case.
 * @param {string} req.body.case_due_date - The due date of the case in ISO8601 format.
 * @param {string} req.body.case_type - The type of the case.
 * @param {string} req.body.case_notes - The notes associated with the case.
 * @returns {Object} Returns a JSON object containing the result of the insert query.
 * @throws {Error} Throws an error if there was a problem querying the database.
 * @throws {Error} Throws an error if the case due date is in the past.
 */
app.post("/api/cases/create", [
    body("case_ad_id")
        .isInt().withMessage("Adviser ID is required and must be an integer"),
    body("case_due_date")
        .isISO8601()
        .withMessage("Case due date is required and must be in ISO8601 format")
        .custom((value, { req, res }) => {
            if (new Date(value) < new Date()) {
                return false;
            }
            return true;
        }).withMessage("Case due date cannot be in the past"),
    body("case_type").isString().withMessage("Case type is required and must be a string"),
    body("case_notes")
        .isString()
        .withMessage("Case notes is required")
        .isLength({ max: 3000 })
        .withMessage("Case notes cannot be longer than 3000 characters"),
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        case_ad_id,
        case_due_date,
        case_type,
        case_notes,
    } = req.body;

    // Create array
    const post = {
        case_ad_id,
        case_due_date,
        case_type,
        case_notes,
    };

    const sql = "INSERT INTO work_case SET ?";

    const query = db.query(sql, post, (err, result) => {
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
app.put("/api/cases/update/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
    body("case_pp_id").optional().isInt().withMessage("Case PP ID must be an integer"),
    body("case_ad_id").isInt().withMessage("Case AD ID is required and must be an integer"),
    body("case_due_date").isISO8601().withMessage("Case due date is required and must be in ISO8601 format"),
    body("case_type").isString().withMessage("Case type is required and must be a string"),
    body("case_bid_price").isDecimal().withMessage("Case bid price is required and must be a decimal"),
    body("case_bid_status").isString().withMessage("Case bid status is required and must be a string"),
    body("case_notes")
        .optional()
        .isString()
        .withMessage("Case notes must be a string")
        .isLength({ max: 3000 })
        .withMessage("Case notes cannot be longer than 3000 characters"),
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        case_pp_id,
        case_ad_id,
        case_due_date,
        case_type,
        case_bid_price,
        case_bid_status,
        case_notes,
    } = req.body;

    const case_id = req.params.id;

    // Create array
    const post = {
        case_pp_id,
        case_ad_id,
        case_due_date,
        case_type,
        case_bid_price,
        case_bid_status,
        case_notes,
        case_id,
    };

    // Update Case
    const sql = `UPDATE work_case SET case_pp_id = ?, case_ad_id = ?, case_due_date = ?, case_type = ?, case_bid_price = ?, case_bid_status = ?, case_notes = ? WHERE case_id = ?`;

    const query = db.query(sql, post, (err, result) => {
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
app.delete("/api/cases/delete/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const sql = `DELETE FROM work_case WHERE case_id = ${req.params.id}`;

    const query = db.query(sql, (err, result) => {
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
app.get("/api/cases/bids/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    const id = req.params.id;

    // Get Bids
    const sql = `SELECT * FROM bids WHERE bid_case_id = ${id}`;

    const query = db.query(sql, (err, result) => {
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

// Cases Bids Count
app.get("/api/cases/bids/count/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    const id = req.params.id;

    // Get Bids
    const sql = `SELECT COUNT(*) FROM bids WHERE bid_case_id = ${id}`;

    const query = db.query(sql, (err, result) => {
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

// Change Case Status to Start Work
app.put("/api/cases/:id/status", [
    param("id").isInt().withMessage("ID must be an integer")
], (req, res) => {
    // Get ID
    const id = req.params.id;
    const status = req.body.status.toString();

    // Update Case Status
    const sql = `UPDATE work_case SET case_bid_status = ? WHERE case_id = ?`;

    db.query(sql, status, id, (err, result) => {
        if (err) {
            throw err;
        }

        // Check that the case exists
        if (result.affectedRows == 0) {
            // Create Audit
            createAudit("work_case", id, "Can't update, case not found.")

            res.status(400).json("Case not found.");
            return;
        } else {
            // Create Audit
            createAudit("work_case", id, "Case status changed to " + status + ".")

            res.status(200).json(result);
        }
    });
});

// Get all cases assigned to a paraplanner
app.get("/api/cases/paraplanner/:id", [
    param("id").isInt().withMessage("ID must be an integer"),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    const id = req.params.id;

    // Get Cases
    const sql = `SELECT work_case.*, pp_firstname, pp_lastname, ad_firstname, ad_lastname, bid_price 
                 FROM work_case 
                 LEFT JOIN paraplanners ON work_case.case_pp_id = paraplanners.pp_id 
                 LEFT JOIN advisers ON work_case.case_ad_id = advisers.ad_id 
                 LEFT JOIN bids ON work_case.case_bid_id = bids.bid_id
                 WHERE work_case.case_pp_id = ${id}
                `;

    const query = db.query(sql, (err, result) => {
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
app.post("/api/bids/create", 
    [
        body("bid_case_id").notEmpty().withMessage("Please fill in all fields.").isInt().withMessage("ID is not a number"),
        body("bid_pp_id").notEmpty().withMessage("Please fill in all fields."),
        body("bid_ad_id").notEmpty().withMessage("Please fill in all fields."),
        body("bid_price").notEmpty().withMessage("Please fill in all fields.").isFloat({ min: 30 }).withMessage("Please enter a bid over £30."),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get variables
        let bid_case_id = req.body.bid_case_id;
        let bid_pp_id = req.body.bid_pp_id;
        let bid_ad_id = req.body.bid_ad_id;
        let bid_price = req.body.bid_price;

        // Create array
        let post = {
            bid_case_id: bid_case_id,
            bid_pp_id: bid_pp_id,
            bid_ad_id: bid_ad_id,
            bid_price: bid_price,
        };

        console.log(post);

        let sql = "INSERT INTO bids SET ?";

        let query = db.query(sql, post, (err, result) => {
            if (err) {
                throw err;
            }

            // Check that the case exists
            if (result.length == 0) {
                // Create Audit
                createAudit("bids", bid_case_id, "Can't create, case not found.")

                res.status(400).json("Case not found.");
                return;
            } else {
                // Create Audit
                createAudit("bids", bid_case_id, "Bid created.")
                
                res.status(200).json(result);
            }
        });
    }
);

// Update Bid by ID
app.put(
    "/api/bids/update/:id",
    [
        param("id").isInt().withMessage("ID is not a number"),
        body("bid_case_id").notEmpty().withMessage("Please fill in all fields."),
        body("bid_pp_id").notEmpty().withMessage("Please fill in all fields."),
        body("bid_ad_id").notEmpty().withMessage("Please fill in all fields."),
        body("bid_price")
            .notEmpty()
            .withMessage("Please fill in all fields.")
            .isFloat({ min: 30 })
            .withMessage("Please enter a bid over £30."),
        body("bid_status").notEmpty().withMessage("Please fill in all fields."),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let bid_ad_id = req.body.bid_ad_id;
        let bid_price = req.body.bid_price;
        let bid_status = req.body.bid_status;
        let bid_id = req.params.id;
        let bid_case_id = req.body.bid_case_id;
        let bid_pp_id = req.body.bid_pp_id;

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
            if (result.affectedRows == 0) {
                // Create Audit
                createAudit("bids", bid_id, "Can't update, bid not found.")

                res.status(400).json("Case not found.");
                return;
            } else {
                // Create Audit
                createAudit("bids", bid_id, "Bid updated.")

                res.status(200).json(result);
            }
        });
    }
);

// Accept Bid by ID
app.put(
    "/api/bids/accept/:id",
    [param("id").isInt().withMessage("ID is not a number")],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get ID
        let id = req.params.id;

        // Update Bid and Case Bid Status
        let sql = `
            UPDATE bids b
            JOIN bids b2 ON b.bid_case_id = b2.bid_case_id
            JOIN work_case wc ON b.bid_case_id = wc.case_id
            SET b.bid_status = 'Accepted', b2.bid_status = 'Rejected', wc.case_bid_status = 'Accepted', wc.case_bid_id = b.bid_id
            WHERE b.bid_id = ${id} AND b.bid_status != 'Accepted' AND b2.bid_id != ${id}
        `;

        let query = db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }

            // Check that the bid exists
            if (result.affectedRows == 0) {
                // Create Audit
                createAudit("bids", id, "Bid not found or already accepted.")

                res.status(400).json("Bid not found or already accepted.");
                return;
            }

            // Get ID of all cases with the same case ID that have been rejected
            let sql2 = `SELECT bid_id FROM bids WHERE bid_case_id = (SELECT bid_case_id FROM bids WHERE bid_id = ${id}) AND bid_status = 'Rejected'`;

            let query2 = db.query(sql2, (err, result) => {
                if (err) {
                    throw err;
                }

                // Loop through all rejected bids and create audits
                for (let i = 0; i < result.length; i++) {
                    createAudit("bids", result[i].bid_id, "Bid rejected.")
                }
            });

            // Create Audit
            createAudit("bids", id, "Bid accepted.")

            res.status(200).json(result);
        });
    }
);

// Delete Bid
app.delete(
    "/api/bids/delete/:id",
    [param("id").isInt().withMessage("ID is not a number")],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get ID
        let id = req.params.id;

        // Delete Bid
        let sql = `DELETE FROM bids WHERE bid_id = ${id}`;

        let query = db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }

            // Check that the case exists
            if (result.affectedRows == 0) {
                // Create Audit
                createAudit("bids", id, "Can't delete, bid not found.")

                res.status(400).json("Bid not found.");
                return;
            } else {
                // Create Audit
                createAudit("bids", id, "Bid deleted.")

                res.status(200).json(result);
            }
        });
    }
);

// List of all Bids
app.get("/api/bids/all", (req, res) => {
    let sql = "SELECT bids.*, paraplanners.pp_firstname, paraplanners.pp_lastname, advisers.ad_firstname, advisers.ad_lastname, work_case.case_type FROM bids JOIN paraplanners ON bids.bid_pp_id = paraplanners.pp_id JOIN advisers ON bids.bid_ad_id = advisers.ad_id JOIN work_case ON bids.bid_case_id = work_case.case_id";

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
app.get(
    "/api/bids/:id",
    [param("id").isInt().withMessage("ID is not a number")],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get ID
        let id = req.params.id;

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
    }
);

// Count number of bids by case ID
app.get(
    "/api/bids/count/:id",
    [param("id").isInt().withMessage("ID is not a number")],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get ID
        let id = req.params.id;

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
    }
);

// *****************************************************
// PARAPLANNERS
// *****************************************************

// Get Case by Paraplanner id
app.get("/api/cases/paraplanner/:id", [
    param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

// Get Case by Adviser id
app.get("/api/cases/adviser/:id", [
    param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

// Get Cases that do not have a Paraplanner assigned
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
        res.status(200).json(results);
    });
});

// Get Paraplanner by ID
app.get("/api/paraplanners/:id", [
    param("id").notEmpty().withMessage("ID is required").isNumeric().withMessage("ID must be a number")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    let id = req.params.id;

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
app.post("/api/paraplanners/create", [
    body("pp_firstname").notEmpty().withMessage("First name is required"),
    body("pp_lastname").notEmpty().withMessage("Last name is required"),
    body("pp_email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email address")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get variables
    let pp_firstname = req.body.pp_firstname;
    let pp_lastname = req.body.pp_lastname;
    let pp_email = req.body.pp_email;

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
app.put("/api/paraplanners/update/:id", [
    param("id").notEmpty().withMessage("ID is required").isNumeric().withMessage("ID must be a number"),
    body("pp_firstname").notEmpty().withMessage("First name is required"),
    body("pp_lastname").notEmpty().withMessage("Last name is required"),
    body("pp_email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email address")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get variables
    let pp_firstname = req.body.pp_firstname;
    let pp_lastname = req.body.pp_lastname;
    let pp_email = req.body.pp_email;
    let pp_id = req.params.id;

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
app.delete("/api/paraplanners/delete/:id", [
    param("id").notEmpty().withMessage("ID is required").isNumeric().withMessage("ID must be a number")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    let id = req.params.id;

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
app.get("/api/paraplanners/star-rating/:id", [
    param("id").notEmpty().withMessage("ID is required").isNumeric().withMessage("ID must be a number")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    let id = req.params.id;

    let sql = `SELECT AVG(review_stars) AS rating FROM reviews WHERE review_pp_id = ${id}`;

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

    db.query(sql, (err, results) => {
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
app.get("/api/advisers/:id", [
    param('id').notEmpty().isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const sql = `SELECT * FROM advisers WHERE ad_id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length == 0) {
            res.status(404).json({ error: "Adviser not found." });
        } else {
            res.status(200).json(result);
        }
    });
});

// Get Adviser by ID
app.get("/api/advisers/:id", [
    param('id').notEmpty().isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const sql = `SELECT * FROM advisers WHERE ad_id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length == 0) {
            res.status(404).json({ error: "Adviser not found." });
        } else {
            res.status(200).json(result);
        }
    });
});

// Update Adviser
app.put("/api/advisers/update/:id", [
    param('id').notEmpty().isInt(),
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
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { ad_firstname, ad_lastname, ad_email, ad_role, ad_tel } = req.body;
    const sql = `UPDATE advisers SET ad_firstname = ?, ad_lastname = ?, ad_email = ?, ad_role = ?, ad_tel = ? WHERE ad_id = ?`;
    const values = [ad_firstname, ad_lastname, ad_email, ad_role, ad_tel, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.affectedRows == 0) {
            res.status(404).json({ error: "Adviser not found." });
        } else {
            res.status(200).json({ message: "Adviser updated successfully." });
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

// Get paraplanner star rating
app.get("/api/advisers/star-rating/:id", [
    param("id").notEmpty().withMessage("ID is required").isNumeric().withMessage("ID must be a number")
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get ID
    let id = req.params.id;

    let sql = `SELECT AVG(review_stars) AS rating FROM reviews WHERE review_ad_id = ${id}`;

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

// Bids by paraplanner id
app.get("/api/bids/paraplanner/:id", [
    param('id').isInt().withMessage('ID must be an integer'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    // Get Bids
    const sql = `SELECT * FROM bids WHERE bid_pp_id = ?`;
    try {
        const result = await db.query(sql, [id]);

        // Console Logging
        if (process.env.consoleLogging === true) {
            console.log(result);
        }

        // JSON Response
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Bids by adviser id
app.get("/api/bids/adviser/:id", [
    param('id').isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let id = req.params.id;

    // Get Bids
    let sql = `SELECT * FROM bids WHERE bid_ad_id = ${id}`;

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
app.get("/api/reviews/adviser/:id", [
    param('id').notEmpty().isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    // Get Reviews
    const sql = `SELECT * FROM reviews WHERE review_ad_id = ?`;
    const values = [id];

    db.query(sql, values, (err, result) => {
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
app.get("/api/reviews/paraplanner/:id", [
    param('id').notEmpty().isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    // Get Reviews
    const sql = `SELECT * FROM reviews WHERE review_pp_id = ?`;
    const values = [id];

    db.query(sql, values, (err, result) => {
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

// Create a review
app.post("/api/reviews/create", [
    body('review_pp_id').notEmpty().isInt(),
    body('review_ad_id').notEmpty().isInt(),
    body('review_case_id').notEmpty().isInt(),
    body('review_stars').notEmpty().isInt().isIn([1, 2, 3, 4, 5]),
    body('review_comment').notEmpty().isLength({ max: 1000 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { review_pp_id, review_ad_id, review_case_id, review_stars, review_comment } = req.body;

    // Create Review
    const sql = `INSERT INTO reviews (review_pp_id, review_ad_id, review_case_id, review_stars, review_comment) VALUES (?, ?, ?, ?, ?)`;
    const values = [review_pp_id, review_ad_id, review_case_id, review_stars, review_comment];

    db.query(sql, values, (err, result) => {
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
app.put("/api/reviews/update/:id", [
    param('id').notEmpty().isInt(),
    body('review_stars').notEmpty().isInt().isIn([1, 2, 3, 4, 5]),
    body('review_comment').notEmpty().isLength({ max: 1000 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get variables
    const { id } = req.params;
    const { review_stars, review_comment } = req.body;

    // Update Review
    const sql = `UPDATE reviews SET review_stars = ?, review_comment = ? WHERE review_id = ?`;
    const values = [review_stars, review_comment, id];

    db.query(sql, values, (err, result) => {
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
app.delete("/api/reviews/delete/:id", [
    // Validate ID
    body('id').notEmpty().isInt(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get variables
    let id = req.params.id;

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

    db.query(sql, (err, result) => {
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
