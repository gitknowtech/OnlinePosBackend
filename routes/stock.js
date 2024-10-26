const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates

const router = express.Router();


const createProductStockInTable = () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS product_stockin (
      stockInId INT AUTO_INCREMENT PRIMARY KEY,
      productId INT NOT NULL,
      productname VARCHAR(1000) NOT NULL,
      barcode VARCHAR(1000) NOT NULL,
      quantity DECIMAL(10,4),
      type VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating products Stock in table:", err);
      } else {
        console.log("Products Stock in table exists or created successfully");
      }
    });
  };


  
createProductStockInTable();




// API to fetch product by barcode or product ID
router.get('/fetch_products_barcode', (req, res) => {
    const { searchTerm, store } = req.query;
  
    // SQL query to search for products by barcode, product ID, or name
    const query = `
        SELECT * FROM products 
        WHERE barcode = ? OR productId = ? OR productName LIKE ? AND (store = ? OR store = 'all') 
        LIMIT 1;
    `;
  
    db.query(query, [searchTerm, searchTerm, `%${searchTerm}%`, store], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ message: 'Error fetching product' });
        }
  
        if (results.length > 0) {
            return res.json(results);
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    });
  });
  

  





  

router.post('/update_stock', (req, res) => {
    const { productId, productName, barcode, quantity } = req.body;
  
    if (!productId || isNaN(quantity) || parseFloat(quantity) <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }
  
    const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4)); // Ensure decimal precision
  
    // Step 1: Insert a record into `product_stockin`
    const insertStockInQuery = `
        INSERT INTO product_stockin (productId, productName, barcode, quantity, type,  date)
        VALUES (?, ?, ?, ?, 'StockUpdate', NOW())
    `;
  
    db.query(insertStockInQuery, [productId, productName, barcode, parsedQuantity], (err, result) => {
        if (err) {
            console.error('Error inserting into product_stockin:', err);
            return res.status(500).json({ message: 'Error logging stock addition' });
        }
  
        // Step 2: Update the stock quantity in `products`
        const updateProductStockQuery = `
            UPDATE products
            SET stockQuantity = stockQuantity + ?
            WHERE productId = ?
        `;
  
        db.query(updateProductStockQuery, [parsedQuantity, productId], (err, result) => {
            if (err) {
                console.error('Error updating products table:', err);
                return res.status(500).json({ message: 'Error updating product stock' });
            }
  
            res.json({ message: 'Stock updated successfully!' });
        });
    });
  });
  
  
  
  
  
  
  // In your backend (e.g., Express.js)
  router.get('/get_last_50_stock_records', (req, res) => {
    const fetchLast50RecordsQuery = `
        SELECT productId, productName, quantity, type, date
        FROM product_stockin
        ORDER BY date DESC
        LIMIT 50
    `;
  
    db.query(fetchLast50RecordsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching stock records:', err);
            return res.status(500).json({ message: 'Error fetching stock records' });
        }
        res.json(results);
    });
  });
  




  
  // Backend route to get last 50 records and total quantity for a specific productId
  router.get('/get_last_50_records_by_product', (req, res) => {
    const { productId } = req.query;
    const query = `
        SELECT productId, productName, quantity, type, date
        FROM product_stockin
        WHERE productId = ?
        ORDER BY date DESC
        LIMIT 50
    `;
  
    const sumQuery = `
        SELECT SUM(quantity) AS totalIn
        FROM product_stockin
        WHERE productId = ? 
    `;
  
    // First, fetch the last 50 records
    db.query(query, [productId], (err, records) => {
        if (err) {
            console.error('Error fetching product records:', err);
            return res.status(500).json({ message: 'Error fetching product records' });
        }
  
        // Then, fetch the total quantity (totalIn) for the productId
        db.query(sumQuery, [productId], (err, totalResult) => {
            if (err) {
                console.error('Error fetching total quantity:', err);
                return res.status(500).json({ message: 'Error fetching total quantity' });
            }
  
            const totalIn = totalResult[0]?.totalIn || 0; // Set totalIn to 0 if no result
  
            res.json({ records, totalIn });
        });
    });
  });
  



  

// API to fetch all products with optional filtering and pagination
router.get('/fetch_products', (req, res) => {
    const { store, status, searchTerm } = req.query;
  
    let query = `SELECT * FROM products WHERE 1=1`;
    let queryParams = [];
  
    if (store && store !== 'all') {
      query += ` AND (store = ? OR store = 'all')`;
      queryParams.push(store);
    }
  
    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }
  
    if (searchTerm) {
      query += ` AND (productId LIKE ? OR productName LIKE ? OR productNameSinhala LIKE ?)`;
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
  
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Error fetching products', error: err });
      }
  
      res.json(results);
    });
  });
  
   

  
  
  
  
  module.exports = router;