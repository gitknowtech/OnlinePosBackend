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




// Route to fetch all customers using raw SQL (adjust as necessary based on your database structure)
router.get('/fetch_customers', (req, res) => {
  const fetchQuery = 'SELECT * FROM customers';
  db.query(fetchQuery, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      console.error(err.stack); // Log detailed stack trace
      return res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
    res.status(200).json(results);
  });
});



// Delete customer route
router.delete('/delete_customer/:cusId', (req, res) => {
  const { cusId } = req.params;
  const deleteQuery = 'DELETE FROM customers WHERE cusId = ?';

  db.query(deleteQuery, [cusId], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err.message);
      return res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
    if (result.affectedRows > 0) {
      console.log(`Customer "${cusId}" deleted successfully`);
      return res.status(200).json({ message: `Customer "${cusId}" deleted successfully` });
    } else {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }
  });
});



// Route to update a customer
router.put('/update_customer/:cusId', (req, res) => {
  const { cusId } = req.params;
  const { address1, address2, mobile1, mobile2, idNumber, user, store } = req.body;

  // Validate mobile numbers
  if (!/^\d{10}$/.test(mobile1)) {
    return res.status(400).json({ message: 'Mobile 1 must be exactly 10 digits.' });
  }
  if (mobile2 && !/^\d{10}$/.test(mobile2)) {
    return res.status(400).json({ message: 'Mobile 2 must be exactly 10 digits if provided.' });
  }

  // Check if the customer exists
  const checkCustomerQuery = 'SELECT * FROM customers WHERE cusId = ?';
  db.query(checkCustomerQuery, [cusId], (err, results) => {
    if (err) {
      console.error('Error checking customer existence:', err.message);
      return res.status(500).json({ message: 'Error checking customer existence', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check for duplicates in mobile numbers and ID number (excluding the current customer)
    const checkDuplicateQuery = `
      SELECT * FROM customers 
      WHERE (mobile1 = ? OR (mobile2 = ? AND mobile2 IS NOT NULL) OR idNumber = ?) AND cusId != ?
    `;
    db.query(checkDuplicateQuery, [mobile1, mobile2, idNumber, cusId], (err, duplicateResults) => {
      if (err) {
        console.error('Error checking for duplicates:', err.message);
        return res.status(500).json({ message: 'Error checking for duplicates', error: err.message });
      }

      if (duplicateResults.length > 0) {
        return res.status(409).json({
          message: 'Duplicate found: Mobile 1, Mobile 2, or ID Number already exists for another customer.'
        });
      }

      // Update the customer without modifying cusId or cusName
      const updateCustomerQuery = `
        UPDATE customers
        SET address1 = ?, address2 = ?, mobile1 = ?, mobile2 = ?, idNumber = ?, user = ?, store = ?
        WHERE cusId = ?
      `;
      const updateValues = [address1, address2, mobile1, mobile2 || null, idNumber || null, user, store, cusId];

      db.query(updateCustomerQuery, updateValues, (err, result) => {
        if (err) {
          console.error('Error updating customer:', err.message);
          return res.status(500).json({ message: 'Error updating customer', error: err.message });
        }

        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Customer updated successfully!' });
        } else {
          res.status(404).json({ message: 'Customer not found or no changes made' });
        }
      });
    });
  });
});


module.exports = router;
