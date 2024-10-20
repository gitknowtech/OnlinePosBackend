const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates

const router = express.Router();




// Create `products` table if it doesn't exist
const createProductTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(1000) NOT NULL,
      productName VARCHAR(1000) NOT NULL,
      productNameSinhala VARCHAR(255),
      barcode VARCHAR(255),
      batchNumber VARCHAR(255),
      selectedSupplier VARCHAR(1000),
      selectedCategory VARCHAR(1000),
      selectedUnit VARCHAR(255),
      manufacturingDate DATE,
      expiringDate DATE,
      costPrice DECIMAL(10, 2),
      mrpPrice DECIMAL(10, 2),
      profitPercentage DECIMAL(5, 2),
      profitAmount DECIMAL(10, 2),
      discountPrice DECIMAL(10, 2),
      discountPercentage DECIMAL(5, 2),
      wholesalePrice DECIMAL(10, 2),
      wholesalePercentage DECIMAL(5, 2),
      lockedPrice DECIMAL(10, 2),
      stockQuantity DECIMAL(10, 4),  -- Renamed from openingBalance to stockQuantity
      stockAlert DECIMAL(10, 4),
      store VARCHAR(500),
      user VARCHAR(500),
      status VARCHAR(10),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      imageLink VARCHAR(2000)
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating products table:", err);
    } else {
      console.log("Products table exists or created successfully");
    }
  });
};

// Create `opening_balance_table` to store opening balance separately
const createOpeningBalanceTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS opening_balance_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(1000) NOT NULL,
      productName VARCHAR(1000) NOT NULL,
      openingBalance DECIMAL(10, 4),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating opening_balance_table:", err);
    } else {
      console.log("Opening balance table exists or created successfully");
    }
  });
};


// Call both table creation functions
createProductTable();
createOpeningBalanceTable();




// API to create product and insert into both tables
router.post('/create_product', (req, res) => {
  const {
    productId,
    productName,
    productNameSinhala,
    barcode,
    batchNumber,
    selectedSupplier,
    selectedCategory,
    selectedUnit,
    manufacturingDate,
    expiringDate,
    costPrice,
    mrpPrice,
    profitPercentage,
    profitAmount,
    discountPrice,
    discountPercentage,
    wholesalePrice,
    wholesalePercentage,
    lockedPrice,
    openingBalance,  // Use stockQuantity instead of openingBalance
    stockAlert,  // Ensure this is included
    store,
    user,
    status,
    imageLink
  } = req.body;

  // Check for required fields
  if (!productId || !productName || !costPrice || !mrpPrice) {
    return res.status(400).json({ message: 'Product ID, Product Name, Cost Price, and MRP Price are required fields.' });
  }

  // Format dates to 'YYYY-MM-DD' format using moment.js
  const formattedManufacturingDate = manufacturingDate ? moment(manufacturingDate).format('YYYY-MM-DD') : null;
  const formattedExpiringDate = expiringDate ? moment(expiringDate).format('YYYY-MM-DD') : null;

  // Insert into products table
  const insertProductQuery = `
    INSERT INTO products 
    (productId, productName, productNameSinhala, barcode, batchNumber, selectedSupplier, selectedCategory, selectedUnit, 
    manufacturingDate, expiringDate, costPrice, mrpPrice, profitPercentage, profitAmount, discountPrice, discountPercentage, 
    wholesalePrice, wholesalePercentage, lockedPrice, stockQuantity, stockAlert, store, user, status, imageLink) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const productValues = [
    productId,
    productName,
    productNameSinhala,
    barcode,
    batchNumber,
    selectedSupplier,
    selectedCategory,
    selectedUnit,
    formattedManufacturingDate,
    formattedExpiringDate,
    costPrice,
    mrpPrice,
    profitPercentage,
    profitAmount,
    discountPrice,
    discountPercentage,
    wholesalePrice,
    wholesalePercentage,
    lockedPrice,
    openingBalance,  // Save stockQuantity in products table
    stockAlert,  // Save stockAlert in products table
    store,
    user,
    status,
    imageLink
  ];

  // Insert into the products table
  db.query(insertProductQuery, productValues, (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ message: 'Error creating product', error: err });
    }

    // Insert stockQuantity (as openingBalance) into opening_balance_table
    const insertOpeningBalanceQuery = `
      INSERT INTO opening_balance_table (productId, productName, openingBalance)
      VALUES (?, ?, ?)
    `;

    const openingBalanceValues = [productId, productName, openingBalance];  // Use stockQuantity as openingBalance

    db.query(insertOpeningBalanceQuery, openingBalanceValues, (err, result) => {
      if (err) {
        console.error('Error saving opening balance:', err);
        return res.status(500).json({ message: 'Error saving opening balance', error: err });
      }

      res.status(201).json({ message: 'Product and opening balance saved successfully!' });
    });
  });
});






// API to check product ID
router.get('/check_product_id/:productId', (req, res) => {
  const { productId } = req.params;

  const query = 'SELECT COUNT(*) AS count FROM products WHERE productId = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking Product ID', error: err });
    }

    const exists = results[0].count > 0;
    return res.json({ exists });
  });
});

module.exports = router;
