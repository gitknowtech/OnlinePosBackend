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
  
  
  // API to update the category by categoryId
 router.put('/update_category/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const { catName } = req.body;
  
    // Check if category name is provided
    if (!catName || catName.trim() === '') {
      return res.status(400).json({ message: 'Category name cannot be empty' });
    }
  
    // Check if category name already exists (ignore case)
    const checkDuplicateQuery = `SELECT * FROM categories WHERE LOWER(catName) = LOWER(?) AND id != ?`;
    db.query(checkDuplicateQuery, [catName, categoryId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking for duplicate category' });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
  
      // Update category name in the database
      const updateCategoryQuery = `UPDATE categories SET catName = ? WHERE id = ?`;
      db.query(updateCategoryQuery, [catName, categoryId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating category' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Category not found' });
        }
  
        res.status(200).json({ message: 'Category updated successfully' });
      });
    });
  });
  
  
  
router.delete("/delete_category", (req, res) => {
    const { catName } = req.body;
  
    const deleteQuery = "DELETE FROM categories WHERE catName = ?";
  
    db.query(deleteQuery, [catName], (err, result) => {
      if (err) {
        console.error('Error deleting category from database:', err);
        return res.status(500).json({ message: "Error deleting category" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });   
      }
  
      return res.status(200).json({ message: "Category deleted successfully" });
    });
  });


  
module.exports = router;