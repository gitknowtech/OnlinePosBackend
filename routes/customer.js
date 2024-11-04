const express = require('express');
const db = require('../db'); // Your database connection
const router = express.Router();

// Create `Customer` table if it doesn't exist
const createCustomerTable = () => {
  console.log("Initializing table creation...");
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cusId VARCHAR(100) NOT NULL UNIQUE,
      cusName VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      mobile1 VARCHAR(15) NOT NULL UNIQUE,
      mobile2 VARCHAR(15) UNIQUE,
      idNumber VARCHAR(100) UNIQUE,
      user VARCHAR(255),
      store VARCHAR(255),
      status VARCHAR(10) DEFAULT 'active',
      createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating customers table:", err.message);
      console.error(err.stack); // Log detailed stack trace
    } else {
      console.log("Customers table exists or created successfully");
    }
  });
};

// Call the function to create the table on server start
createCustomerTable();

// API to add a new customer
router.post('/add_customer', (req, res) => {
  console.log("Received request to add a new customer:", req.body);
  const {
    cusId,
    cusName,
    address1,
    address2,
    mobile1,
    mobile2,
    idNumber,
    user,
    store
  } = req.body;

  // Validate required fields
  if (!cusId || !cusName || !address1 || !mobile1) {
    console.warn("Validation failed: Missing required fields");
    return res.status(400).json({ message: 'Customer ID, Customer Name, Address 1, and Mobile 1 are required.' });
  }

  // Prepare the query and parameters for checking duplicates
  console.log("Checking for duplicates...");
  let duplicateConditions = `cusId = ? OR mobile1 = ?`;
  let duplicateParams = [cusId, mobile1];

  if (mobile2) {
    duplicateConditions += ` OR mobile2 = ?`;
    duplicateParams.push(mobile2);
  }

  if (idNumber) {
    duplicateConditions += ` OR idNumber = ?`;
    duplicateParams.push(idNumber);
  }

  const checkDuplicateQuery = `
    SELECT * FROM customers 
    WHERE ${duplicateConditions}
  `;

  db.query(checkDuplicateQuery, duplicateParams, (err, results) => {
    if (err) {
      console.error('Error checking for duplicates:', err.message);
      console.error(err.stack); // Log detailed stack trace
      return res.status(500).json({ message: 'Error checking for duplicates', error: err.message });
    }

    if (results.length > 0) {
      console.log("Duplicate data found:", results);
      return res.status(409).json({ message: 'Duplicate found: Customer ID, Mobile 1, Mobile 2, or ID Number already exists.' });
    }

    // Insert the new customer into the customers table
    console.log("Inserting new customer into database...");
    const insertCustomerQuery = `
      INSERT INTO customers (cusId, cusName, address1, address2, mobile1, mobile2, idNumber, user, store)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const customerValues = [cusId, cusName, address1, address2, mobile1, mobile2 || null, idNumber || null, user, store];

    db.query(insertCustomerQuery, customerValues, (err, result) => {
      if (err) {
        console.error('Error adding customer:', err.message);
        console.error(err.stack); // Log detailed stack trace
        return res.status(500).json({ message: 'Error adding customer', error: err.message });
      }

      console.log("Customer added successfully with ID:", result.insertId);
      res.status(201).json({ message: 'Customer added successfully!' });
    });
  });
});

module.exports = router;
