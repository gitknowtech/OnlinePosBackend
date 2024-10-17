const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates

const router = express.Router();


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
        lockedPrice DECIMAL(10,2),
        openingBalance DECIMAL(10,2),
        stockAlert DECIMAL(10,2),
        store VARCHAR(500),
        user VARCHAR(500),
        status VARCHAR(10),  -- Adding the status column here
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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

  createProductTable();


// API to create product
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
    openingBalance,
    stockAlert,
    store,
    user,
    status
  } = req.body;

  // Check for required fields
  if (!productId || !productName || !costPrice || !mrpPrice) {
    return res.status(400).json({ message: 'Product ID, Product Name, Cost Price, and MRP Price are required fields.' });
  }

  // Format dates to 'YYYY-MM-DD' format using moment.js
  const formattedManufacturingDate = manufacturingDate ? moment(manufacturingDate).format('YYYY-MM-DD') : null;
  const formattedExpiringDate = expiringDate ? moment(expiringDate).format('YYYY-MM-DD') : null;

  const insertProductQuery = `
    INSERT INTO products 
    (productId, productName, productNameSinhala, barcode, batchNumber, selectedSupplier, selectedCategory, selectedUnit, 
    manufacturingDate, expiringDate, costPrice, mrpPrice, profitPercentage, profitAmount, discountPrice, discountPercentage, 
    wholesalePrice, wholesalePercentage, lockedPrice, openingBalance, stockAlert, store, user, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
    openingBalance,
    stockAlert,
    store,
    user,
    status
  ];

  db.query(insertProductQuery, values, (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Error creating product', error: err });
    } else {
      res.status(201).json({ message: 'Product created successfully!' });
    }
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
