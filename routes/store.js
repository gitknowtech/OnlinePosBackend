  const express = require('express');
  const db = require('../db');
  const moment = require('moment');

  const router = express.Router();

  
const createStoresTable = () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        storeName VARCHAR(255) NOT NULL,
        user VARCHAR(255) NOT NULL,
        store VARCHAR(255) NOT NULL,
        saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating stores table:', err);
      } else {
        console.log('Stores table exists or created successfully');
      }
    });
  };
  
createStoresTable();




// Create new store
router.post("/create_store", (req, res) => {
    const { storeName, user, store } = req.body;
  
    const insertQuery = "INSERT INTO stores (storeName, user, store, saveTime) VALUES (?, ?, ?, NOW())";
  
    db.query(insertQuery, [storeName, user, store], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Duplicate store name" });
        }
  
        console.error('Error saving store to database:', err);
        return res.status(500).json({ message: "Error saving store" });
      }
  
      return res.status(201).json({ message: "Store added successfully", id: result.insertId });
    });
  });
  

  // Update store API
router.put('/update_store/:id', (req, res) => {
    const storeId = req.params.id; // Get the store ID from the URL parameters
    const { storeName } = req.body; // Extract new store name from the request body
  
    // Validation
    if (!storeName) {
      return res.status(400).json({ message: 'Store name is required' });
    }
  
    const query = 'UPDATE stores SET storeName = ? WHERE id = ?';
    db.query(query, [storeName, storeId], (err, result) => {
      if (err) {
        console.error('Error updating store:', err);
        return res.status(500).json({ message: 'Error updating store' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Store not found' });
      }
  
      res.status(200).json({ message: `Store has been updated successfully.` });
    });
  });
  
  

// Delete store
router.delete("/delete_store/:storeId", (req, res) => {
  const { storeId } = req.params;

  const deleteQuery = "DELETE FROM stores WHERE id = ?";

  db.query(deleteQuery, [storeId], (err, result) => {
    if (err) {
      console.error('Error deleting store from database:', err);
      return res.status(500).json({ message: "Error deleting store" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({ message: "Store deleted successfully" });
  });
});


  

// Get all stores
router.get("/get_stores", (req, res) => {
  const query = "SELECT * FROM stores";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stores:', err);
      return res.status(500).json({ message: "Error fetching stores" });
    }
    return res.status(200).json(results);
  });
});

module.exports = router;