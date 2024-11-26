const express = require('express')
const db = require('../db')
const moment = require('moment')
const router = express.Router();



// Function to create the 'categories' table if it doesn't exist
const createCategoriesTable = () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        catName VARCHAR(255) NOT NULL,
        user VARCHAR(255) NOT NULL,
        store VARCHAR(255) NOT NULL,
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating categories table:', err);
      } else {
        console.log('Categories table exists or created successfully');
      }
    });
  };

  
  createCategoriesTable();


  
//add category for the table
router.post("/create_categories", (req, res) => {
    const { id, catName, user, store, saveTime } = req.body;
  
    const insertQuery = "INSERT INTO categories (id, catName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";
  
    db.query(insertQuery, [id, catName, user, store, saveTime], (err, result) => {
      if (err) {
        // Handle duplicate entry error (MySQL error code 1062)
        if (err.code === 'ER_DUP_ENTRY') {
          console.error('Duplicate ID detected:', err);
          return res.status(400).json({ 
            message: "Duplicate ID",
            error: err.message || 'Duplicate ID error',
            code: err.code || 'No code',
            errno: err.errno || 'No errno'
          });
        }
  
        // Log other MySQL errors
        console.error('Error saving category to database:', err);
        return res.status(500).json({ 
          message: "Error saving category. Please try again.", 
          error: err.message || 'Unknown error', 
          sqlMessage: err.sqlMessage || 'No SQL message', 
          code: err.code || 'No code', 
          errno: err.errno || 'No errno'
        });
      }
  
      return res.status(201).json({ message: "Category added successfully" });
    });
  });
  
  
  
  
  // Fetch all categories from the database
router.get("/get_categories", (req, res) => {
    const query = "SELECT * FROM categories";
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: "Error fetching categories" });
      }
      return res.status(200).json(results);
    });
  });
  
  
  router.put('/update_category/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const { catName } = req.body;
  
    if (!catName || catName.trim() === '') {
      return res.status(400).json({ message: 'Category name cannot be empty' });
    }
  
    // First, check if the category name already exists in other records
    const checkDuplicateQuery = `SELECT * FROM categories WHERE LOWER(catName) = LOWER(?) AND id != ?`;
    db.query(checkDuplicateQuery, [catName, categoryId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking for duplicate category' });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
  
      // Retrieve the old category name for updating the products table
      const getOldCategoryQuery = `SELECT catName FROM categories WHERE id = ?`;
      db.query(getOldCategoryQuery, [categoryId], (selectErr, selectResult) => {
        if (selectErr) {
          return res.status(500).json({ message: 'Error retrieving old category name' });
        }
  
        if (selectResult.length === 0) {
          return res.status(404).json({ message: 'Category not found' });
        }
  
        const oldCategoryName = selectResult[0].catName;
  
        // Start transaction to ensure both updates occur together
        db.beginTransaction((transactionErr) => {
          if (transactionErr) {
            return res.status(500).json({ message: 'Error starting transaction' });
          }
  
          // Update the category name in the `categories` table
          const updateCategoryQuery = `UPDATE categories SET catName = ? WHERE id = ?`;
          db.query(updateCategoryQuery, [catName, categoryId], (updateErr, updateResult) => {
            if (updateErr) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error updating category' });
              });
            }
  
            // Update the `selectedCategory` in the `products` table
            const updateProductsQuery = `UPDATE products SET selectedCategory = ? WHERE selectedCategory = ?`;
            db.query(updateProductsQuery, [catName, oldCategoryName], (productUpdateErr, productUpdateResult) => {
              if (productUpdateErr) {
                return db.rollback(() => {
                  res.status(500).json({ message: 'Error updating related products' });
                });
              }
  
              // Commit transaction if both updates are successful
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                }
  
                res.status(200).json({ message: 'Category and related products updated successfully' });
              });
            });
          });
        });
      });
    });
  });
  
  
  
  
  router.delete("/delete_category", (req, res) => {
    const { catName } = req.body;
  
    // Query to check if the category is associated with any products
    const checkCategoryQuery =
      "SELECT COUNT(*) AS productCount FROM products WHERE selectedCategory = ?";
  
    db.query(checkCategoryQuery, [catName], (err, result) => {
      if (err) {
        console.error("Error checking category association:", err);
        return res.status(500).json({ message: "Error checking category association" });
      }
  
      // If category is associated with any product, return an error
      if (result[0].productCount > 0) {
        return res
          .status(400)
          .json({ message: "Cannot delete category. It is associated with products." });
      }
  
      // Proceed to delete the category if no association exists
      const deleteQuery = "DELETE FROM categories WHERE catName = ?";
      db.query(deleteQuery, [catName], (err, result) => {
        if (err) {
          console.error("Error deleting category from database:", err);
          return res.status(500).json({ message: "Error deleting category" });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Category not found" });
        }
  
        return res.status(200).json({ message: "Category deleted successfully" });
      });
    });
  });
  

  
module.exports = router;