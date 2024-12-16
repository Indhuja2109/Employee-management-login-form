// Import required modules
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

// Initialize express app
const app = express();

// Enable CORS to allow requests from your frontend
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// MySQL Connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connected...");
});

// API endpoint to handle form submission and save employee data
app.post("/api/employees", (req, res) => {
  const {
    firstName,
    lastName,
    employeeId,
    email,
    phoneNumber,
    countryCode,
    department,
    dateOfJoining,
    role,
  } = req.body;

  // Validate form data
  if (
    !firstName ||
    !lastName ||
    !employeeId ||
    !email ||
    !phoneNumber ||
    !department ||
    !dateOfJoining ||
    !role
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if the employeeId, email, or phone number already exists in the database
  const checkQuery = `
    SELECT * FROM employees WHERE employee_id = ? OR email = ? OR phone_number = ?;
  `;

  db.query(checkQuery, [employeeId, email, phoneNumber], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error." });
    }

    // If any of the fields already exist, return an error message
    if (results.length > 0) {
        let errorMessage = {};
        results.forEach((row) => {
          if (row.employee_id === employeeId) errorMessage.employeeId = "Employee ID already exists.";
          if (row.email === email) errorMessage.email = "Email already exists.";
          if (row.phone_number === phoneNumber) errorMessage.phoneNumber = "Phone number already exists.";
        });
        return res.status(400).json(errorMessage);
      }

    // Insert the new employee data into the database
    const query = `
      INSERT INTO employees (first_name, last_name, employee_id, email, phone_number, country_code, department, date_of_joining, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      firstName,
      lastName,
      employeeId,
      email,
      phoneNumber,
      countryCode || "",
      department,
      dateOfJoining,
      role,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error inserting data into the database." });
      }

      res.status(201).json({ message: "Employee added successfully.", employeeId: result.insertId });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
