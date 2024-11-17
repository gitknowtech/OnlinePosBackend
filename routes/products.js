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





const createDeletedProductsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS deleted_products (
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
      stockQuantity DECIMAL(10, 4),
      stockAlert DECIMAL(10, 4),
      store VARCHAR(500),
      user VARCHAR(500),
      status VARCHAR(10),
      deleteTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      imageLink VARCHAR(2000),
      openingBalance DECIMAL(10,4)
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating deleted_products table:", err);
    } else {
      console.log("Deleted products table exists or created successfully");
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
createDeletedProductsTable( );



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


// API to search for products based on a query parameter
router.get('/search_stock', (req, res) => {
  const searchTerm = req.query.query;

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({ message: 'Query parameter is required.' });
  }

  // Construct SQL query to search for products
  const searchQuery = `
  SELECT 
    productId, 
    productName, 
    barcode, 
    mrpPrice AS salePrice, 
    stockQuantity AS quantity, 
    wholesalePrice, 
    discountPrice 
  FROM 
    products 
  WHERE 
    productName LIKE ? OR 
    barcode LIKE ? OR 
    productId LIKE ? OR 
    mrpPrice LIKE ?
`;


  // Prepare the search term for partial matching
  const searchValue = `%${searchTerm}%`;

  // Execute the query with prepared statements to prevent SQL injection
  db.query(searchQuery, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error executing search query', error: err });
    }

    // Return the search results
    res.status(200).json(results);
  });
});




router.delete('/delete_removed_product/:productId', (req, res) => {
  const { productId } = req.params;

  const deleteProductQuery = `DELETE FROM deleted_products WHERE productId = ?`;

  db.query(deleteProductQuery, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product', error: err });
    }

    if (result.affectedRows === 0) {
      // No product found with the provided productId
      return res.status(404).json({ message: 'Product not found' });
    }

    // Successfully deleted the product
    return res.status(200).json({ message: `Product with ID ${productId} deleted successfully` });
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

 


// API to fetch all products with optional filtering and pagination
router.get('/fetch_removed_products', (req, res) => {
  const { store, status, searchTerm } = req.query;

  let query = `SELECT * FROM deleted_products WHERE 1=1`;
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





// API to delete product by productId
router.delete('/delete_removed_product/:productId', (req, res) => {
  const { productId } = req.params;

  const deleteProductQuery = `DELETE FROM products WHERE productId = ?`;
  const deleteOpeningBalanceQuery = `DELETE FROM opening_balance_table WHERE productId = ?`;

  db.query(deleteProductQuery, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product', error: err });
    }

    // After deleting from products table, delete the opening balance for that product
    db.query(deleteOpeningBalanceQuery, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting opening balance:', err);
        return res.status(500).json({ message: 'Error deleting opening balance', error: err });
      }

      res.status(200).json({ message: 'Product and opening balance deleted successfully!' });
    });
  });
});




// API to delete product by productId
router.delete('/delete_product/:productId', (req, res) => {
  const { productId } = req.params;

  const getProductQuery = `SELECT * FROM products WHERE productId = ?`;
  const getOpeningBalanceQuery = `SELECT openingBalance FROM opening_balance_table WHERE productId = ?`;
  
  const insertDeletedProductQuery = `
    INSERT INTO deleted_products (
      productId, productName, productNameSinhala, barcode, batchNumber, 
      selectedSupplier, selectedCategory, selectedUnit, manufacturingDate, 
      expiringDate, costPrice, mrpPrice, profitPercentage, profitAmount, 
      discountPrice, discountPercentage, wholesalePrice, wholesalePercentage, 
      lockedPrice, stockQuantity, stockAlert, store, user, status, imageLink, openingBalance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const deleteProductQuery = `DELETE FROM products WHERE productId = ?`;
  const deleteOpeningBalanceQuery = `DELETE FROM opening_balance_table WHERE productId = ?`;

  // First, get the product data before deleting
  db.query(getProductQuery, [productId], (err, productResult) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Error fetching product', error: err });
    }

    if (productResult.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = productResult[0];

    // Fetch the opening balance from opening_balance_table
    db.query(getOpeningBalanceQuery, [productId], (err, openingBalanceResult) => {
      if (err) {
        console.error('Error fetching opening balance:', err);
        return res.status(500).json({ message: 'Error fetching opening balance', error: err });
      }

      const openingBalance = openingBalanceResult.length > 0 ? openingBalanceResult[0].openingBalance : 0;

      // Insert the product data and the related opening balance into deleted_products table
      db.query(insertDeletedProductQuery, [
        productData.productId, productData.productName, productData.productNameSinhala, productData.barcode,
        productData.batchNumber, productData.selectedSupplier, productData.selectedCategory,
        productData.selectedUnit, productData.manufacturingDate, productData.expiringDate,
        productData.costPrice, productData.mrpPrice, productData.profitPercentage, productData.profitAmount,
        productData.discountPrice, productData.discountPercentage, productData.wholesalePrice,
        productData.wholesalePercentage, productData.lockedPrice, productData.stockQuantity,
        productData.stockAlert, productData.store, productData.user, productData.status, productData.imageLink,
        openingBalance // Save the related opening balance
      ], (err, insertResult) => {
        if (err) {
          console.error('Error saving deleted product:', err);
          return res.status(500).json({ message: 'Error saving deleted product', error: err });
        }

        // After saving to deleted_products, delete the product from products table
        db.query(deleteProductQuery, [productId], (err, deleteProductResult) => {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product', error: err });
          }

          // After deleting the product, delete the related opening balance
          db.query(deleteOpeningBalanceQuery, [productId], (err, deleteOpeningBalanceResult) => {
            if (err) {
              console.error('Error deleting opening balance:', err);
              return res.status(500).json({ message: 'Error deleting opening balance', error: err });
            }

            // Successfully deleted product and opening balance
            res.status(200).json({ message: 'Product and opening balance deleted successfully!' });
          });
        });
      });
    });
  });
});







// API to update product status
router.put('/update_status/:productId', (req, res) => {
  const { productId } = req.params;
  const { status } = req.body;

  // Validate if the status is either "active" or "inactive"
  if (status !== 'active' && status !== 'inactive') {
    return res.status(400).json({ message: 'Invalid status value. Must be "active" or "inactive".' });
  }

  // Update the product's status in the database
  const updateStatusQuery = `UPDATE products SET status = ? WHERE productId = ?`;

  db.query(updateStatusQuery, [status, productId], (err, result) => {
    if (err) {
      console.error('Error updating product status:', err);
      return res.status(500).json({ message: 'Failed to update product status', error: err });
    }

    // Check if the product was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product status updated successfully' });
  });
});



// API to fetch products by supplier
router.get('/fetch_products_by_supplier', (req, res) => {
  const { supplier } = req.query;

  if (!supplier) {
    return res.status(400).json({ message: "Supplier name is required" });
  }

  const query = `SELECT * FROM products WHERE selectedSupplier = ?`;
  
  db.query(query, [supplier], (err, results) => {
    if (err) {
      console.error('Error fetching products by supplier:', err);
      return res.status(500).json({ message: 'Error fetching products', error: err });
    }

    res.json(results);
  });
});




// Endpoint to fetch all categories
router.get('/fetch_categories_for_invoice', (req, res) => {
  const query = "SELECT * FROM categories";

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching categories:", err);
          return res.status(500).json({ message: "Failed to fetch categories." });
      }
      res.status(200).json(results); // Return the categories
  });
});



// Endpoint to fetch products by category ID
router.get('/fetch_products_by_category', (req, res) => {
  const { categoryId } = req.query;

  if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
  }

  const query = "SELECT * FROM products WHERE selectedCategory = ?";

  db.query(query, [categoryId], (err, results) => {
      if (err) {
          console.error("Error fetching products:", err);
          return res.status(500).json({ message: "Failed to fetch products." });
      }
      res.status(200).json(results); // Return the products for the category
  });
});




// Endpoint to search products by name, barcode, or product ID
router.get('/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  // SQL query to search by product name, barcode, or product ID
  const sqlQuery = `
    SELECT productId, productName, barcode, mrpPrice, costPrice, discountPrice, wholesalePrice, lockedPrice
    FROM products
    WHERE productName LIKE ? OR barcode LIKE ? OR productId LIKE ?
    LIMIT 10
  `;

  const searchTerm = `%${query}%`; // Using % wildcard for partial match

  db.query(sqlQuery, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("Error fetching product suggestions:", err);
      return res.status(500).json({ message: "Failed to fetch product suggestions." });
    }
    res.status(200).json(results); // Return matching products
  });
});


router.get('/search_invoice_by_store', (req, res) => {
  const { query, store } = req.query;

  if (!query || !store) {
    return res.status(400).json({ message: "Search query and store are required." });
  }

  // SQL query to search by product name, barcode, or product ID for a specific store with "active" status
  const sqlQuery = `
    SELECT productId, productName, barcode, mrpPrice, costPrice, discountPrice, wholesalePrice, lockedPrice, store
    FROM products
    WHERE (productName LIKE ? OR barcode LIKE ? OR productId LIKE ?)
      AND store = ?
      AND status = 'active'
    LIMIT 10
  `;

  const searchTerm = `%${query}%`; // Using % wildcard for partial match

  db.query(sqlQuery, [searchTerm, searchTerm, searchTerm, store], (err, results) => {
    if (err) {
      console.error("Error fetching product suggestions:", err); 
      return res.status(500).json({ message: "Failed to fetch product suggestions." });
    }
    res.status(200).json(results); // Return matching products
  });
});





router.put('/update_product/:id', async (req, res) => {
  const productId = req.params.id;
  const {
    productName,
    productNameSinhala,
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
    lockedPrice,
    imageLink,
  } = req.body;

  // Format date fields if necessary
  const formattedManufacturingDate = manufacturingDate ? manufacturingDate.split('T')[0] : null;
  const formattedExpiringDate = expiringDate ? expiringDate.split('T')[0] : null;

  const updateProductQuery = `
    UPDATE products 
    SET 
      productName = ?,
      productNameSinhala = ?,
      batchNumber = ?,
      selectedSupplier = ?,
      selectedCategory = ?,
      selectedUnit = ?,
      manufacturingDate = ?,
      expiringDate = ?,
      costPrice = ?,
      mrpPrice = ?,
      profitPercentage = ?,
      profitAmount = ?,
      lockedPrice = ?,
      imageLink = ?
    WHERE 
      productId = ?
  `;

  try {
    await db.query(updateProductQuery, [
      productName,
      productNameSinhala,
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
      lockedPrice,
      imageLink,
      productId,
    ]);

    res.status(200).json({
      message: 'Product updated successfully',
      productId,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Error updating product',
      error: error.message,
    });
  }
});


// Get all products for a specific supplier by Supname (matches products table selectedSupplier column)
router.get('/get_supplier_products/:supplierName', (req, res) => {
  const { supplierName } = req.params;

  const query = `SELECT * FROM products WHERE selectedSupplier = ?`;

  db.query(query, [supplierName], (err, results) => {
    if (err) {
      console.error('Error fetching products by supplier name:', err);
      return res.status(500).json({ message: 'Error fetching products', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found for this supplier' });
    }

    res.status(200).json(results);
  });
});






module.exports = router;
