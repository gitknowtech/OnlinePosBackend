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
      store VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      invoiceId VARCHAR(255)
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
    const { productId, productName, barcode, quantity, store } = req.body;
  
    if (!productId || isNaN(quantity) || parseFloat(quantity) <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }
  
    const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4)); // Ensure decimal precision
  
    // Step 1: Insert a record into `product_stockin`
    const insertStockInQuery = `
        INSERT INTO product_stockin (productId, productName, barcode, quantity, type, store,  date)
        VALUES (?, ?, ?, ?, 'StockIn', ? , NOW())
    `;
  
    db.query(insertStockInQuery, [productId, productName, barcode, parsedQuantity, store], (err, result) => {
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
    const fetchAllRecordsQuery = `
        SELECT productId, productName, quantity, type, date
        FROM product_stockin
        ORDER BY date DESC
    `;

    db.query(fetchAllRecordsQuery, (err, results) => {
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

    const fetchRecordsQuery = `
        SELECT productId, productName, quantity, type, date
        FROM product_stockin
        WHERE productId = ?
        ORDER BY date DESC
    `;

    const fetchTotalInQuery = `
        SELECT SUM(quantity) AS totalIn
        FROM product_stockin
        WHERE productId = ? 
    `;

    // First, fetch all records for the specific productId
    db.query(fetchRecordsQuery, [productId], (err, records) => {
        if (err) {
            console.error('Error fetching product records:', err);
            return res.status(500).json({ message: 'Error fetching product records' });
        }

        // Then, fetch the total quantity (totalIn) for the productId
        db.query(fetchTotalInQuery, [productId], (err, totalResult) => {
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
  
   

  

  const createProductStockOutTable = () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS product_stockout (
      stockOutId INT AUTO_INCREMENT PRIMARY KEY,
      productId INT NOT NULL,
      productName VARCHAR(1000) NOT NULL,
      barcode VARCHAR(1000) NOT NULL,
      quantity DECIMAL(10,4),
      type VARCHAR(255),
      store VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      invoiceId VARCHAR(255)
    )`;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error("Error creating product stock out table:", err);
        } else {
            console.log("Product stock out table exists or created successfully");
        }
    });
};

createProductStockOutTable();






// API to update stock out
router.post('/update_stock_out', (req, res) => {
  const { productId, productName, barcode, quantity, store } = req.body;

  if (!productId || isNaN(quantity) || parseFloat(quantity) <= 0) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
  }

  const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4)); // Ensure decimal precision

  // Step 1: Insert a record into `product_stockout`
  const insertStockOutQuery = `
      INSERT INTO product_stockout (productId, productName, barcode, quantity, type, store, date)
      VALUES (?, ?, ?, ?, 'StockOut', ? , NOW())
  `;

  db.query(insertStockOutQuery, [productId, productName, barcode, parsedQuantity, store], (err, result) => {
      if (err) {
          console.error('Error inserting into product_stockout:', err);
          return res.status(500).json({ message: 'Error logging stock deduction' });
      }

      // Step 2: Decrease the stock quantity in `products`
      const updateProductStockQuery = `
          UPDATE products
          SET stockQuantity = stockQuantity - ?
          WHERE productId = ? AND stockQuantity >= ?
      `;

      db.query(updateProductStockQuery, [parsedQuantity, productId, parsedQuantity], (err, result) => {
          if (err) {
              console.error('Error updating products table:', err);
              return res.status(500).json({ message: 'Error updating product stock' });
          }

          if (result.affectedRows === 0) {
              return res.status(400).json({ message: 'Insufficient stock quantity' });
          }

          res.json({ message: 'Stock deducted successfully!' });
      });
  });
});






// API to fetch the last 50 stock out records
router.get('/get_last_50_stockout_records', (req, res) => {
    const fetchAllRecordsQuery = `
    SELECT productId, productName, quantity, type, date
    FROM product_stockout
    ORDER BY date DESC
`;

db.query(fetchAllRecordsQuery, (err, results) => {
    if (err) {
        console.error('Error fetching stock out records:', err);
        return res.status(500).json({ message: 'Error fetching stock out records' });
    }
    res.json(results);
});
});




// Backend route to get last 50 records and total out quantity for a specific productId
router.get('/get_last_50_records_by_product_out', (req, res) => {
    const { productId } = req.query;
    
    const fetchRecordsQuery = `
        SELECT productId, productName, quantity, type, store, date
        FROM product_stockout
        WHERE productId = ?
        ORDER BY date DESC
    `;
  
    const fetchTotalOutQuery = `
        SELECT SUM(quantity) AS totalOut
        FROM product_stockout
        WHERE productId = ?
    `;
  
    // First, fetch all records for the specific productId
    db.query(fetchRecordsQuery, [productId], (err, records) => {
        if (err) {
            console.error('Error fetching product records:', err);
            return res.status(500).json({ message: 'Error fetching product records' });
        }
  
        // Then, fetch the total quantity (totalOut) for the productId
        db.query(fetchTotalOutQuery, [productId], (err, totalResult) => {
            if (err) {
                console.error('Error fetching total quantity:', err);
                return res.status(500).json({ message: 'Error fetching total quantity' });
            }
  
            const totalOut = totalResult[0]?.totalOut || 0; // Set totalOut to 0 if no result
  
            res.json({ records, totalOut });
        });
    });
});







router.post('/update_stock_transfer', (req, res) => {
    const { productId, productName, barcode, quantity, store } = req.body;

    if (!productId || isNaN(quantity) || parseFloat(quantity) <= 0 || !store) {
        return res.status(400).json({ message: 'Invalid product ID, quantity, or store name' });
    }

    const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4));

    // Insert a record into `product_stockin`
    const insertStockInQuery = `
        INSERT INTO product_stockin (productId, productName, barcode, quantity, type, store, date)
        VALUES (?, ?, ?, ?, 'StockInTransfer', ?, NOW())
    `;

    db.query(insertStockInQuery, [productId, productName, barcode, parsedQuantity, store], (err, result) => {
        if (err) {
            console.error('Error inserting into product_stockin:', err);
            return res.status(500).json({ message: 'Error logging stock addition' });
        }

        // Update the stock quantity in `products`
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
router.get('/get_last_50_stock_records_transfer_up', (req, res) => {
    const fetchAllRecordsQuery = `
        SELECT productId, productName, quantity, type, store, date
        FROM product_stockin
        WHERE store IS NOT NULL
        ORDER BY date DESC
    `;

    db.query(fetchAllRecordsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching stock records:', err);
            return res.status(500).json({ message: 'Error fetching stock records' });
        }
        res.json(results);
    });
});





// Backend route to get last 50 records and total quantity for a specific productId
router.get('/get_last_50_records_by_product_transfer_up', (req, res) => {
    const { productId } = req.query;

    const fetchRecordsQuery = `
        SELECT productId, productName, quantity, type, store, date
        FROM product_stockin
        WHERE productId = ? AND store IS NOT NULL
        ORDER BY date DESC
    `;

    const fetchTotalInQuery = `
        SELECT SUM(quantity) AS totalIn
        FROM product_stockin
        WHERE productId = ? AND store IS NOT NULL
    `;

    // First, fetch all records for the product with non-null store values
    db.query(fetchRecordsQuery, [productId], (err, records) => {
        if (err) {
            console.error('Error fetching product records:', err);
            return res.status(500).json({ message: 'Error fetching product records' });
        }

        // Then, fetch the total quantity (totalIn) for the productId with non-null store values
        db.query(fetchTotalInQuery, [productId], (err, totalResult) => {
            if (err) {
                console.error('Error fetching total quantity:', err);
                return res.status(500).json({ message: 'Error fetching total quantity' });
            }

            const totalIn = totalResult[0]?.totalIn || 0; // Set totalIn to 0 if no result

            res.json({ records, totalIn });
        });
    });
});






// In your backend (e.g., Express.js)
router.get('/get_last_50_stock_records_transfer_down', (req, res) => {
    const fetchAllRecordsQuery = `
        SELECT productId, productName, quantity, type, store, date
        FROM product_stockout
        WHERE store IS NOT NULL
        ORDER BY date DESC
    `;

    db.query(fetchAllRecordsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching stock records:', err);
            return res.status(500).json({ message: 'Error fetching stock records' });
        }
        res.json(results);
    });
});




// Backend route to get last 50 records and total quantity for a specific productId
router.get('/get_last_50_records_by_product_transfer_down', (req, res) => {
    const { productId } = req.query;

    const fetchRecordsQuery = `
        SELECT productId, productName, quantity, type, store, date
        FROM product_stockout
        WHERE productId = ? AND store IS NOT NULL
        ORDER BY date DESC
    `;

    const fetchTotalOutQuery = `
        SELECT SUM(quantity) AS totalOut
        FROM product_stockout
        WHERE productId = ? AND store IS NOT NULL
    `;

    // First, fetch all records for the product with non-null store values
    db.query(fetchRecordsQuery, [productId], (err, records) => {
        if (err) {
            console.error('Error fetching product records:', err);
            return res.status(500).json({ message: 'Error fetching product records' });
        }

        // Then, fetch the total quantity (totalOut) for the productId with non-null store values
        db.query(fetchTotalOutQuery, [productId], (err, totalResult) => {
            if (err) {
                console.error('Error fetching total quantity:', err);
                return res.status(500).json({ message: 'Error fetching total quantity' });
            }

            const totalOut = totalResult[0]?.totalOut || 0; // Set totalOut to 0 if no result

            res.json({ records, totalOut });
        });
    });
});




router.post('/update_stock_transfer_out', (req, res) => {
    const { productId, productName, barcode, quantity, store } = req.body;

    if (!productId || isNaN(quantity) || parseFloat(quantity) <= 0 || !store) {
        return res.status(400).json({ message: 'Invalid product ID, quantity, or store name' });
    }

    const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4));

    // Insert a record into `product_stockout`
    const insertStockOutQuery = `
        INSERT INTO product_stockout (productId, productName, barcode, quantity, type, store, date)
        VALUES (?, ?, ?, ?, 'StockOutTransfer', ?, NOW())
    `;

    db.query(insertStockOutQuery, [productId, productName, barcode, parsedQuantity, store], (err, result) => {
        if (err) {
            console.error('Error inserting into product_stockout:', err);
            return res.status(500).json({ message: 'Error logging stock deduction' });
        }

        // Update the stock quantity in `products` by subtracting the quantity
        const updateProductStockQuery = `
            UPDATE products
            SET stockQuantity = stockQuantity - ?
            WHERE productId = ? AND stockQuantity >= ?
        `;

        db.query(updateProductStockQuery, [parsedQuantity, productId, parsedQuantity], (err, result) => {
            if (err) {
                console.error('Error updating products table:', err);
                return res.status(500).json({ message: 'Error updating product stock' });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Insufficient stock quantity' });
            }

            res.json({ message: 'Stock deducted successfully!' });
        });
    });
});
  



// API to search categories based on search term
router.get("/get_categories_stock", (req, res) => {
    const searchTerm = req.query.searchTerm || "";

    const query = `
        SELECT id AS category_id, catName AS name, user, store, saveTime
        FROM categories
        WHERE catName LIKE ? 
    `;

    const searchValue = `%${searchTerm}%`;
    db.query(query, [searchValue], (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ message: "Error fetching categories" });
        }
        res.status(200).json(results); // Return matched categories
    });
});




// API to fetch products by selected category
router.get("/fetch_products_by_category", (req, res) => {
    const { category } = req.query;

    const query = `
        SELECT 
            productId,
            productName,
            selectedCategory AS stockCategory,
            selectedUnit,
            mrpPrice,
            stockQuantity,
            store,
            user,
            saveTime
        FROM products
        WHERE selectedCategory = ?
    `;

    db.query(query, [category], (err, results) => {
        if (err) {
            console.error("Error fetching products by category:", err);
            return res.status(500).json({ message: "Error fetching products by category" });
        }
        res.status(200).json(results); // Return products in the selected category
    });
});









// API to search batches based on search term
router.get("/get_batches_stock", (req, res) => {
    const searchTerm = req.query.searchTerm || "";

    const query = `
        SELECT id, batchName 
        FROM batches
        WHERE batchName LIKE ? 
    `;

    const searchValue = `%${searchTerm}%`;
    db.query(query, [searchValue], (err, results) => {
        if (err) {
            console.error("Error fetching batches:", err);
            return res.status(500).json({ message: "Error fetching batches" });
        }
        res.status(200).json(results); // Return matched batches
    });
});






// API to fetch products by batch number
router.get("/fetch_products_by_batch", (req, res) => {
    const { batch } = req.query;

    const query = `
        SELECT productId, productName, batchNumber, selectedUnit, costPrice, mrpPrice, stockQuantity 
        FROM products
        WHERE batchNumber = ?
    `;

    db.query(query, [batch], (err, results) => {
        if (err) {
            console.error("Error fetching products by batch:", err);
            return res.status(500).json({ message: "Error fetching products by batch" });
        }
        res.status(200).json(results); // Return products with the selected batch
    });
});



module.exports = router;

